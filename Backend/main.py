from fastapi import FastAPI

from app.database import Base, engine

from app.models.user_model import User
from app.models.event_model import Event
from app.models.reminder_model import EventReminder

from app.routes.user_routes import router as user_router
from app.routes.event_routes import router as event_router
from app.routes.reminder_routes import router as reminder_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LifeHUB API",
    description="API do aplicativo LifeHUB - agenda, metas e produtividade.",
    version="0.1.0"
)

app.include_router(user_router)
app.include_router(event_router)
app.include_router(reminder_router)


@app.get("/")
def home():
    return {
        "message": "LifeHUB API online",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }