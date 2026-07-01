from datetime import datetime, timezone
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

    current_weekday = now_local.weekday()
    current_time = now_local.time()

    recurring_reminders = (
        db.query(RecurringReminder)
        .filter(
            RecurringReminder.user_id == user_id,
            RecurringReminder.is_active == True,  # noqa: E712
            RecurringReminder.weekday == current_weekday,
            RecurringReminder.reminder_time <= current_time,
        )
        .all()
    )

    processed_count = 0
    sent_count = 0
    failed_count = 0
    skipped_count = 0

    for recurring_reminder in recurring_reminders:
        if was_already_sent_today(recurring_reminder, now_local):
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


def was_already_sent_today(
    recurring_reminder: RecurringReminder,
    now_local: datetime,
):
    if not recurring_reminder.last_sent_at:
        return False

    last_sent_at = recurring_reminder.last_sent_at

    if last_sent_at.tzinfo is None:
        last_sent_at = last_sent_at.replace(tzinfo=timezone.utc)

    last_sent_local = last_sent_at.astimezone(ZoneInfo(APP_TIMEZONE))

    return last_sent_local.date() == now_local.date()


def build_notification_body(recurring_reminder: RecurringReminder):
    reminder_time = recurring_reminder.reminder_time.strftime("%H:%M")

    if recurring_reminder.description:
        return f"{recurring_reminder.description} Horário: {reminder_time}."

    return f"Você tem um lembrete recorrente agora. Horário: {reminder_time}."