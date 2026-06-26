from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import Base, engine

from app.models.user_model import User
from app.models.event_model import Event
from app.models.reminder_model import EventReminder
from app.models.goal_model import Goal
from app.models.activity_session_model import ActivitySession

from app.routes.user_routes import router as user_router
from app.routes.event_routes import router as event_router
from app.routes.reminder_routes import router as reminder_router
from app.routes.goal_routes import router as goal_router
from app.routes.activity_session_routes import router as activity_session_router
from app.routes.reminder_engine_routes import router as reminder_engine_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LifeHUB API",
    description="API do aplicativo LifeHUB - agenda, metas e produtividade.",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router)
app.include_router(event_router)
app.include_router(reminder_router)
app.include_router(goal_router)
app.include_router(activity_session_router)
app.include_router(reminder_engine_router)


@app.get("/")
def home():
    return {
        "message": "LifeHUB API online",
        "status": "running",
        "version": "0.1.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
    }