from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from app.models.push_subscription_model import PushSubscription
from app.models.recurring_reminder_model import RecurringReminder
from app.services.push_notification_service import send_push_notification


APP_TIMEZONE = "America/Sao_Paulo"


def process_due_recurring_reminders(
    db: Session,
    user_id: int,
):
    now_local = datetime.now(ZoneInfo(APP_TIMEZONE))
    now_utc = datetime.now(timezone.utc)

    recurring_reminders = (
        db.query(RecurringReminder)
        .filter(
            RecurringReminder.user_id == user_id,
            RecurringReminder.is_active == True,  # noqa: E712
        )
        .all()
    )

    processed_count = 0
    sent_count = 0
    failed_count = 0
    skipped_count = 0

    for recurring_reminder in recurring_reminders:
        notification_datetime = get_due_notification_datetime(
            recurring_reminder=recurring_reminder,
            now_local=now_local,
        )

        if notification_datetime is None:
            continue

        if was_already_sent_for_notification_day(
            recurring_reminder=recurring_reminder,
            notification_datetime=notification_datetime,
        ):
            skipped_count += 1
            continue

        subscriptions = (
            db.query(PushSubscription)
            .filter(PushSubscription.user_id == recurring_reminder.user_id)
            .all()
        )

        if not subscriptions:
            failed_count += 1
            continue

        reminder_sent_count = 0
        reminder_failed_count = 0

        for subscription in subscriptions:
            was_sent = send_push_notification(
                subscription=subscription,
                title=recurring_reminder.title,
                body=build_notification_body(recurring_reminder),
                url="/dashboard",
                tag=f"lifehub-recurring-reminder-{recurring_reminder.id}",
            )

            if was_sent:
                reminder_sent_count += 1
            else:
                reminder_failed_count += 1

        if reminder_sent_count > 0:
            recurring_reminder.last_sent_at = now_utc
            processed_count += 1
            sent_count += reminder_sent_count

        failed_count += reminder_failed_count

    db.commit()

    return {
        "message": "Processamento de lembretes recorrentes finalizado.",
        "processed": processed_count,
        "sent": sent_count,
        "failed": failed_count,
        "skipped": skipped_count,
    }


def get_due_notification_datetime(
    recurring_reminder: RecurringReminder,
    now_local: datetime,
):
    candidate_event_dates = get_candidate_event_dates(
        today=now_local.date(),
        weekday=recurring_reminder.weekday,
    )

    for event_date in candidate_event_dates:
        event_datetime = datetime.combine(
            event_date,
            recurring_reminder.event_time,
            tzinfo=ZoneInfo(APP_TIMEZONE),
        )

        notification_datetime = event_datetime - timedelta(
            minutes=recurring_reminder.minutes_before
        )

        if notification_datetime.date() != now_local.date():
            continue

        if notification_datetime > now_local:
            continue

        return notification_datetime

    return None


def get_candidate_event_dates(
    today: date,
    weekday: int,
):
    current_week_monday = today - timedelta(days=today.weekday())

    return [
        current_week_monday - timedelta(days=7) + timedelta(days=weekday),
        current_week_monday + timedelta(days=weekday),
        current_week_monday + timedelta(days=7) + timedelta(days=weekday),
    ]


def was_already_sent_for_notification_day(
    recurring_reminder: RecurringReminder,
    notification_datetime: datetime,
):
    if not recurring_reminder.last_sent_at:
        return False

    last_sent_at = recurring_reminder.last_sent_at

    if last_sent_at.tzinfo is None:
        last_sent_at = last_sent_at.replace(tzinfo=timezone.utc)

    last_sent_local = last_sent_at.astimezone(ZoneInfo(APP_TIMEZONE))

    return last_sent_local.date() == notification_datetime.date()


def build_notification_body(recurring_reminder: RecurringReminder):
    event_time = recurring_reminder.event_time.strftime("%H:%M")
    reminder_offset = format_minutes_before(recurring_reminder.minutes_before)

    if recurring_reminder.description:
        return (
            f"{recurring_reminder.description} "
            f"Compromisso às {event_time}. Aviso: {reminder_offset}."
        )

    return f"Compromisso às {event_time}. Aviso: {reminder_offset}."


def format_minutes_before(minutes_before: int):
    if minutes_before == 0:
        return "no horário"

    if minutes_before % 1440 == 0:
        days = minutes_before // 1440

        return f"{days} {'dia' if days == 1 else 'dias'} antes"

    if minutes_before % 60 == 0:
        hours = minutes_before // 60

        return f"{hours} {'hora' if hours == 1 else 'horas'} antes"

    return f"{minutes_before} minutos antes"