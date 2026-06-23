import { api } from "./api";

export type DueReminder = {
  reminder_id: number;
  event_id: number;
  event_title: string;
  event_datetime: string;
  reminder_datetime: string;
  minutes_before: number;
  notification_level: "normal" | "alert";
  sound_type: "default" | "alert";
};

export async function getDueReminders() {
  const response = await api.get<DueReminder[]>("/reminders/due");
  return response.data;
}

export async function markReminderAsSent(reminderId: number) {
  const response = await api.patch(`/reminders/${reminderId}/sent`);
  return response.data;
}