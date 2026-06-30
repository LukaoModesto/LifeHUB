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
  console.log("=== LifeHUB Push Debug ===");
  console.log("API URL:", import.meta.env.VITE_API_URL);
  console.log("Protocol:", window.location.protocol);
  console.log("Host:", window.location.host);
  console.log("Secure context:", window.isSecureContext);
  console.log("Notification support:", "Notification" in window);
  console.log("Service Worker support:", "serviceWorker" in navigator);
  console.log("PushManager support:", "PushManager" in window);
  console.log("Permission:", Notification.permission);

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

  console.log("VAPID public key exists:", Boolean(vapidPublicKey));
  console.log("VAPID public key length:", vapidPublicKey?.length);
  console.log("VAPID public key starts with:", vapidPublicKey?.slice(0, 8));

  if (!vapidPublicKey) {
    return {
      status: "missing-key",
      message: "VITE_VAPID_PUBLIC_KEY não foi configurada.",
    };
  }

  const permission = await Notification.requestPermission();

  console.log("Permission after request:", permission);

  if (permission !== "granted") {
    return {
      status: "denied",
      message: "Permissão de notificação não concedida.",
    };
  }

  try {
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    console.log("Decoded VAPID key length:", applicationServerKey.length);

    if (applicationServerKey.length !== 65) {
      return {
        status: "error",
        message: `Chave VAPID pública inválida. Tamanho decodificado: ${applicationServerKey.length}. O esperado é 65.`,
      };
    }

    const registration = await navigator.serviceWorker.ready;

    console.log("Service Worker ready:", registration);

    const existingSubscription =
      await registration.pushManager.getSubscription();

    console.log("Existing subscription:", existingSubscription);

    if (existingSubscription) {
      console.log("Removing old subscription...");
      await existingSubscription.unsubscribe();
    }

    console.log("Creating new push subscription...");

    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    console.log("New subscription created:", newSubscription);

    const subscriptionData = newSubscription.toJSON();

    console.log("Subscription JSON:", subscriptionData);

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
      message: "Notificações registradas neste dispositivo.",
    };
  } catch (error) {
    console.error("Erro completo ao registrar push notification:", error);

    return {
      status: "error",
      message:
        "Não foi possível registrar as notificações. Veja o erro completo no Console.",
    };
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const cleanBase64String = base64String.trim();

  const padding = "=".repeat((4 - (cleanBase64String.length % 4)) % 4);
  const base64 = `${cleanBase64String}${padding}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}