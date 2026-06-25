import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import EventCard from "./EventCard";
import type { LifeHubEvent } from "../../services/eventService";

type CalendarDotColor = "primary" | "success" | "danger";

type CalendarDayItem = {
  day: number;
  muted?: boolean;
  selected?: boolean;
  dot?: CalendarDotColor;
};

type EventCardColor = "primary" | "success" | "danger";

type CalendarSectionProps = {
  calendarDays: CalendarDayItem[];
  upcomingEvents: LifeHubEvent[];
  pastEvents: LifeHubEvent[];
  isEventsLoading: boolean;
  eventsErrorMessage: string;
  onCreateReminder: (event: LifeHubEvent) => void;
  onEditEvent: (event: LifeHubEvent) => void;
  onDeleteEvent: (event: LifeHubEvent) => void;
};

function CalendarSection({
  calendarDays,
  upcomingEvents,
  pastEvents,
  isEventsLoading,
  eventsErrorMessage,
  onCreateReminder,
  onEditEvent,
  onDeleteEvent,
}: CalendarSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:p-6"
    >
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100">
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-2xl font-bold tracking-tight">Agenda</h2>

          <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex w-fit rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <ViewButton label="Hoje" />
          <ViewButton label="Mês" active />
          <ViewButton label="Semana" />
          <ViewButton label="Dia" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((weekDay) => (
          <div
            key={weekDay}
            className="pb-3 text-xs font-bold tracking-wide text-slate-400"
          >
            {weekDay}
          </div>
        ))}

        {calendarDays.map((item, index) => (
          <CalendarDay
            key={`${item.day}-${index}`}
            day={item.day}
            muted={item.muted}
            selected={item.selected}
            dot={item.dot}
          />
        ))}
      </div>

      <div className="mt-9">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Próximos eventos</h3>
            <p className="mt-1 text-sm text-slate-400">
              Eventos que ainda vão acontecer.
            </p>
          </div>

          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Ver todos
          </button>
        </div>

        {isEventsLoading && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
            Carregando eventos...
          </div>
        )}

        {!isEventsLoading && eventsErrorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-600">
            {eventsErrorMessage}
          </div>
        )}

        {!isEventsLoading &&
          !eventsErrorMessage &&
          upcomingEvents.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
              Nenhum próximo evento cadastrado.
            </div>
          )}

        {!isEventsLoading &&
          !eventsErrorMessage &&
          upcomingEvents.length > 0 && (
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  time={formatEventTime(event)}
                  color={getEventCardColor(index)}
                  isPast={false}
                  onCreateReminder={() => onCreateReminder(event)}
                  onEdit={() => onEditEvent(event)}
                  onDelete={() => onDeleteEvent(event)}
                />
              ))}
            </div>
          )}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Histórico</h3>
            <p className="mt-1 text-sm text-slate-400">
              Eventos que já passaram.
            </p>
          </div>
        </div>

        {!isEventsLoading &&
          !eventsErrorMessage &&
          pastEvents.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
              Nenhum evento antigo por enquanto.
            </div>
          )}

        {!isEventsLoading &&
          !eventsErrorMessage &&
          pastEvents.length > 0 && (
            <div className="space-y-3">
              {pastEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  time={formatEventTime(event)}
                  color={getEventCardColor(index)}
                  isPast
                  onCreateReminder={() => onCreateReminder(event)}
                  onEdit={() => onEditEvent(event)}
                  onDelete={() => onDeleteEvent(event)}
                />
              ))}
            </div>
          )}
      </div>
    </motion.section>
  );
}

function ViewButton({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-500 hover:bg-white hover:text-slate-900"
      }`}
    >
      {label}
    </button>
  );
}

function CalendarDay({
  day,
  muted,
  selected,
  dot,
}: {
  day: number;
  muted?: boolean;
  selected?: boolean;
  dot?: CalendarDotColor;
}) {
  const dotColor: Record<CalendarDotColor, string> = {
    primary: "bg-indigo-600",
    success: "bg-emerald-500",
    danger: "bg-red-500",
  };

  return (
    <button
      className={`relative flex h-14 items-center justify-center rounded-2xl text-sm font-semibold transition hover:bg-slate-50 ${
        selected
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-600"
          : muted
            ? "text-slate-300"
            : "text-slate-800"
      }`}
    >
      {day}

      {dot && !selected && (
        <span
          className={`absolute bottom-2 h-1.5 w-1.5 rounded-full ${dotColor[dot]}`}
        />
      )}
    </button>
  );
}

function formatEventTime(event: LifeHubEvent) {
  const startTime = formatTime(event.start_time);

  if (!event.end_time) {
    return `${formatDate(event.event_date)} às ${startTime}`;
  }

  return `${formatDate(event.event_date)} • ${startTime} - ${formatTime(
    event.end_time
  )}`;
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

function getEventCardColor(index: number): EventCardColor {
  const colors: EventCardColor[] = ["primary", "success", "danger"];

  return colors[index % colors.length];
}

export default CalendarSection;