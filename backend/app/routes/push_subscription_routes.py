from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database import get_db
from app.models.push_subscription_model import PushSubscription
from app.models.user_model import User
from app.schemas.push_subscription_schema import (
    PushSubscriptionCreateRequest,
    PushSubscriptionResponse,
)
from app.services.push_notification_service import send_push_notification

router = APIRouter(
    prefix="/push-subscriptions",
    tags=["Push Subscriptions"],
)


@router.post("/", response_model=PushSubscriptionResponse)
def create_or_update_push_subscription(
    subscription_data: PushSubscriptionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_subscription = (
        db.query(PushSubscription)
        .filter(PushSubscription.endpoint == subscription_data.endpoint)
        .first()
    )

    if existing_subscription:
        existing_subscription.user_id = current_user.id
        existing_subscription.p256dh = subscription_data.keys.p256dh
        existing_subscription.auth = subscription_data.keys.auth

        db.commit()
        db.refresh(existing_subscription)

        return existing_subscription

    push_subscription = PushSubscription(
        user_id=current_user.id,
        endpoint=subscription_data.endpoint,
        p256dh=subscription_data.keys.p256dh,
        auth=subscription_data.keys.auth,
    )

    db.add(push_subscription)
    db.commit()
    db.refresh(push_subscription)

    return push_subscription


@router.post("/test")
def test_push_notification(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subscriptions = (
        db.query(PushSubscription)
        .filter(PushSubscription.user_id == current_user.id)
        .all()
    )

    if not subscriptions:
        return {
            "message": "Nenhuma inscrição push encontrada para este usuário.",
            "sent": 0,
            "failed": 0,
        }

    sent_count = 0
    failed_count = 0

    for subscription in subscriptions:
        was_sent = send_push_notification(
            subscription=subscription,
            title="Teste do LifeHUB",
            body="Se você recebeu isso, o push está funcionando.",
            url="/dashboard",
            tag="lifehub-test-push",
        )

        if was_sent:
            sent_count += 1
        else:
            failed_count += 1

    return {
        "message": "Teste de push finalizado.",
        "sent": sent_count,
        "failed": failed_count,
    }


@router.delete("/{subscription_id}")
def delete_push_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subscription = (
        db.query(PushSubscription)
        .filter(
            PushSubscription.id == subscription_id,
            PushSubscription.user_id == current_user.id,
        )
        .first()
    )

    if not subscription:
        return {
            "message": "Inscrição push não encontrada."
        }

    db.delete(subscription)
    db.commit()

    return {
        "message": "Inscrição push removida com sucesso."
    }