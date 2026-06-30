import json
import logging

from pywebpush import WebPushException, webpush

from app.core.config import settings
from app.models.push_subscription_model import PushSubscription

logger = logging.getLogger(__name__)


def send_push_notification(
    subscription: PushSubscription,
    title: str,
    body: str,
    url: str = "/dashboard",
    tag: str = "lifehub-notification",
):
    if not settings.vapid_private_key:
        raise ValueError("VAPID_PRIVATE_KEY não configurada.")

    if not settings.vapid_subject:
        raise ValueError("VAPID_SUBJECT não configurado.")

    subscription_info = {
        "endpoint": subscription.endpoint,
        "keys": {
            "p256dh": subscription.p256dh,
            "auth": subscription.auth,
        },
    }

    payload = {
        "title": title,
        "body": body,
        "url": url,
        "tag": tag,
    }

    try:
        webpush(
            subscription_info=subscription_info,
            data=json.dumps(payload),
            vapid_private_key=settings.vapid_private_key,
            vapid_claims={
                "sub": settings.vapid_subject,
            },
        )

        return True

    except WebPushException as error:
        logger.exception("Erro WebPush ao enviar notificação: %s", error)
        return False

    except Exception as error:
        logger.exception("Erro inesperado ao enviar push notification: %s", error)
        return False