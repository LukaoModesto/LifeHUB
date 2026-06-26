export type BrowserNotificationPermission =
  | "granted"
  | "denied"
  | "default"
  | "unsupported";

type ShowBrowserNotificationData = {
  title: string;
  body: string;
  tag?: string;
};

export function getBrowserNotificationPermission(): BrowserNotificationPermission {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  return Notification.permission;
}

export async function requestBrowserNotificationPermission(): Promise<BrowserNotificationPermission> {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  const permission = await Notification.requestPermission();

  return permission;
}

export function showBrowserNotification({
  title,
  body,
  tag,
}: ShowBrowserNotificationData) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  new Notification(title, {
    body,
    tag,
    icon: "/favicon.png",
    badge: "/favicon.png",
  });
}