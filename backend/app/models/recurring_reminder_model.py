from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Time
from sqlalchemy.orm import relationship

from app.database import Base


class RecurringReminder(Base):
    __tablename__ = "recurring_reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    title = Column(String(80), nullable=False)
    description = Column(String(300), nullable=True)

    weekday = Column(Integer, nullable=False, index=True)

    # Coluna legada: mantida porque bancos SQLite antigos ainda exigem NOT NULL.
    # A lógica nova usa event_time + minutes_before.
    reminder_time = Column(Time, nullable=False)

    event_time = Column(Time, nullable=False)
    minutes_before = Column(Integer, default=0, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    last_sent_at = Column(DateTime, nullable=True)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User")