from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String, nullable= False)
    target_hours = Column(Float, nullable=False)
    period = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")