from datetime import datetime, timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.event_model import Event
from app.models.reminder_model import EventReminder
from app.models.user_model import User


def get_notification_behavior(minutes_before: int):
    if minutes_before <= 120:
        return {
            "notification_level": "alert",
            "sound_type": "alert"
        }

    return {
        "notification_level": "normal",
        "sound_type": "default"
    }


def get_due_reminders(db: Session, current_user: User):
    now = datetime.now()

    reminders = db.query(EventReminder).join(Event).filter(
        Event.user_id == current_user.id,
        EventReminder.sent_at.is_(None)
    ).all()

    due_reminders = []

    for reminder in reminders:
        event_datetime = datetime.combine(
            reminder.event.event_date,
            reminder.event.start_time
        )

        reminder_datetime = event_datetime - timedelta(
            minutes=reminder.minutes_before
        )

        if reminder_datetime <= now <= event_datetime:
            notification_behavior = get_notification_behavior(
                reminder.minutes_before
            )

            due_reminders.append({
                "reminder_id": reminder.id,
                "event_id": reminder.event.id,
                "event_title": reminder.event.title,
                "event_datetime": event_datetime,
                "reminder_datetime": reminder_datetime,
                "minutes_before": reminder.minutes_before,
                "notification_level": notification_behavior["notification_level"],
                "sound_type": notification_behavior["sound_type"]
            })

    return due_reminders


def mark_reminder_as_sent(
    db: Session,
    reminder_id: int,
    current_user: User
):
    reminder = db.query(EventReminder).join(Event).filter(
        EventReminder.id == reminder_id,
        Event.user_id == current_user.id
    ).first()

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Lembrete não encontrado."
        )

    if reminder.sent_at is not None:
        return {
            "message": "Lembrete já estava marcado como enviado."
        }

    reminder.sent_at = datetime.now()

    db.commit()
    db.refresh(reminder)

    return {
        "message": "Lembrete marcado como enviado."
    }