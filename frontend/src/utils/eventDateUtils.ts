import type { LifeHubEvent } from "../services/eventService";

export function getEventDateTime(event: LifeHubEvent) {
  return new Date(`${event.event_date}T${formatTime(event.start_time)}`);
}

export function isPastEvent(event: LifeHubEvent) {
  const eventEndTime = event.end_time
    ? new Date(`${event.event_date}T${formatTime(event.end_time)}`)
    : getEventDateTime(event);

  return eventEndTime.getTime() < new Date().getTime();
}

export function sortEventsAscending(
  firstEvent: LifeHubEvent,
  secondEvent: LifeHubEvent
) {
  return (
    getEventDateTime(firstEvent).getTime() -
    getEventDateTime(secondEvent).getTime()
  );
}

export function sortEventsDescending(
  firstEvent: LifeHubEvent,
  secondEvent: LifeHubEvent
) {
  return (
    getEventDateTime(secondEvent).getTime() -
    getEventDateTime(firstEvent).getTime()
  );
}

export function formatTime(time: string) {
  return time.slice(0, 5);
}