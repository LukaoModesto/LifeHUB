import { api } from "./api";

export type EventReminder = {
  id: number;
  event_id: number;
  minutes_before: number;
  sent_at: string | null;
};

export type CreateReminderData = {
  minutes_before: number;
};

export async function getEventReminders(eventId: number) {
  const response = await api.get<EventReminder[]>(
    `/events/${eventId}/reminders/`
  );

  return response.data;
}

export async function createEventReminder(
  eventId: number,
  reminderData: CreateReminderData
) {
  const response = await api.post<EventReminder>(
    `/events/${eventId}/reminders/`,
    reminderData
  );

  return response.data;
}

export async function deleteEventReminder(
  eventId: number,
  reminderId: number
) {
  await api.delete(`/events/${eventId}/reminders/${reminderId}`);
}