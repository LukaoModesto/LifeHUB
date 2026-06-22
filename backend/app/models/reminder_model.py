from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class EventReminder(Base):
    __tablename__ = "event_reminders"
    id = Column(Integer, primary_key=True, index=True)

    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    minutes_before = Column(Integer, nullable=False)

    sent_at = Column(DateTime, nullable=True)

    create_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="reminders")