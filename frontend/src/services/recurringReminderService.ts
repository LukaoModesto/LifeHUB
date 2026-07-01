import { api } from "./api";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type RecurringReminder = {
  id: number;
  title: string;
  description: string | null;
  weekday: Weekday;
  reminder_time: string;
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateRecurringReminderData = {
  title: string;
  description?: string | null;
  weekday: Weekday;
  reminder_time: string;
  is_active: boolean;
};

export type UpdateRecurringReminderData = {
  title?: string;
  description?: string | null;
  weekday?: Weekday;
  reminder_time?: string;
  is_active?: boolean;
};

export type ProcessRecurringRemindersResult = {
  message: string;
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
};

export async function getRecurringReminders() {
  const response = await api.get<RecurringReminder[]>(
    "/recurring-reminders/"
  );

  return response.data;
}

export async function createRecurringReminder(
  recurringReminderData: CreateRecurringReminderData
) {
  const response = await api.post<RecurringReminder>(
    "/recurring-reminders/",
    recurringReminderData
  );

  return response.data;
}

export async function updateRecurringReminder(
  recurringReminderId: number,
  recurringReminderData: UpdateRecurringReminderData
) {
  const response = await api.put<RecurringReminder>(
    `/recurring-reminders/${recurringReminderId}`,
    recurringReminderData
  );

  return response.data;
}

export async function deleteRecurringReminder(recurringReminderId: number) {
  await api.delete(`/recurring-reminders/${recurringReminderId}`);
}

export async function processDueRecurringReminders() {
  const response = await api.post<ProcessRecurringRemindersResult>(
    "/recurring-reminders/process-due"
  );

  return response.data;
}

export function getWeekdayLabel(weekday: Weekday) {
  const labels: Record<Weekday, string> = {
    0: "Segunda-feira",
    1: "Terça-feira",
    2: "Quarta-feira",
    3: "Quinta-feira",
    4: "Sexta-feira",
    5: "Sábado",
    6: "Domingo",
  };

  return labels[weekday];
}

export function formatRecurringReminderTime(time: string) {
  return time.slice(0, 5);
}