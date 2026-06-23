import { api } from "./api";

export type LifeHubEvent = {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
};

export type CreateEventData = {
  title: string;
  description?: string | null;
  event_date: string;
  start_time: string;
  end_time?: string | null;
};

export async function getEvents() {
  const response = await api.get<LifeHubEvent[]>("/events/");
  return response.data;
}

export async function createEvent(eventData: CreateEventData) {
  const response = await api.post<LifeHubEvent>("/events/", eventData);
  return response.data;
}