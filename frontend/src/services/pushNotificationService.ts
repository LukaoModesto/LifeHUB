import { api } from "./api";

type PushNotificationPermission =
  | "granted"
  | "denied"
  | "default"
  | "unsupported";

type PushNotificationRegisterResult = {
  status: "success" | "denied" | "unsupported" | "missing-key" | "error";
  message: string;
};

export function getPushNotificationPermission(): PushNotificationPermission {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  return Notification.permission;
}

export async function requestAndSavePushSubscription(): Promise<PushNotificationRegisterResult> {
  if (!("serviceWorker" in navigator)) {
    return {
      status: "unsupported",
      message: "Este navegador não suporta Service Worker.",
    };
  }

  if (!("PushManager" in window)) {
    return {
      status: "unsupported",
      message: "Este navegador não suporta notificações push.",
    };
  }

  if (!("Notification" in window)) {
    return {
      status: "unsupported",
      message: "Este navegador não suporta notificações.",
    };
  }

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  if (!vapidPublicKey) {
    return {
      status: "missing-key",
      message: "VITE_VAPID_PUBLIC_KEY não foi configurada.",
    };
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return {
      status: "denied",
      message: "Permissão de notificação não concedida.",
    };
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }

    const subscriptionData = subscription.toJSON();

    if (
      !subscriptionData.endpoint ||
      !subscriptionData.keys?.p256dh ||
      !subscriptionData.keys?.auth
    ) {
      return {
        status: "error",
        message: "Inscrição push inválida.",
      };
    }

    await api.post("/push-subscriptions/", {
      endpoint: subscriptionData.endpoint,
      keys: {
        p256dh: subscriptionData.keys.p256dh,
        auth: subscriptionData.keys.auth,
      },
    });

    return {
      status: "success",
      message: "Notificações ativadas neste dispositivo.",
    };
  } catch {
    return {
      status: "error",
      message: "Não foi possível ativar as notificações push.",
    };
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}