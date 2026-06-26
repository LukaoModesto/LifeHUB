import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import EventCard from "./EventCard";
import type { LifeHubEvent } from "../../services/eventService";

type CalendarDotColor = "primary" | "success" | "danger";

type CalendarDayItem = {
  date: Date;
  day: number;
  muted: boolean;
  isToday: boolean;
  hasEvent: boolean;
  dot?: CalendarDotColor;
};

type EventCardColor = "primary" | "success" | "danger";

type CalendarSectionProps = {
  upcomingEvents: LifeHubEvent[];
  pastEvents: LifeHubEvent[];
  eventReminderCounts: Record<number, number>;
  isEventsLoading: boolean;
  eventsErrorMessage: string;
  onCreateReminder: (event: LifeHubEvent) => void;
  onEditEvent: (event: LifeHubEvent) => void;
  onDeleteEvent: (event: LifeHubEvent) => void;
};

function CalendarSection({
  upcomingEvents,
  pastEvents,
  eventReminderCounts,
  isEventsLoading,
  eventsErrorMessage,
  onCreateReminder,
  onEditEvent,
  onDeleteEvent,
}: CalendarSectionProps) {
  const [visibleMonthDate, setVisibleMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const allEvents = [...upcomingEvents, ...pastEvents];

  const calendarDays = useMemo(() => {
    return buildCalendarDays(visibleMonthDate, allEvents);
  }, [visibleMonthDate, allEvents]);

  const selectedDateEvents = selectedDate
    ? allEvents
        .filter((event) => isSameDate(parseEventDate(event.event_date), selectedDate))
        .sort(sortEventsByDateAscending)
    : [];

  const displayedUpcomingEvents = selectedDate
    ? selectedDateEvents.filter((event) => !isPastEventByDate(event))
    : upcomingEvents;

  const displayedPastEvents = selectedDate
    ? selectedDateEvents.filter((event) => isPastEventByDate(event))
    : pastEvents;

  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(visibleMonthDate);

  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(selectedDate)
    : null;

  function goToPreviousMonth() {
    setVisibleMonthDate((currentDate) => {
      return new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
    });

    setSelectedDate(null);
  }

  function goToNextMonth() {
    setVisibleMonthDate((currentDate) => {
      return new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
    });

    setSelectedDate(null);
  }

  function goToCurrentMonth() {
    const today = new Date();

    setVisibleMonthDate(today);
    setSelectedDate(today);
  }

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
  }

  function clearSelectedDate() {
    setSelectedDate(null);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:p-6"
    >
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ChevronLeft size={20} />
          </button>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Agenda</h2>
            <p className="mt-1 text-sm font-medium capitalize text-slate-400">
              {monthLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex w-fit rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <ViewButton label="Hoje" onClick={goToCurrentMonth} />
          <ViewButton label="Mês" active />
          <ViewButton label="Semana" disabled />
          <ViewButton label="Dia" disabled />
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

        {calendarDays.map((item) => (
          <CalendarDay
            key={item.date.toISOString()}
            day={item.day}
            muted={item.muted}
            selected={selectedDate ? isSameDate(item.date, selectedDate) : false}
            isToday={item.isToday}
            dot={item.hasEvent ? item.dot : undefined}
            onSelect={() => handleSelectDate(item.date)}
          />
        ))}
      </div>

      {selectedDateLabel && (
        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
          Mostrando eventos de{" "}
          <span className="capitalize">{selectedDateLabel}</span>.
        </div>
      )}

      <div className="mt-9">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {selectedDate ? "Eventos do dia" : "Próximos eventos"}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {selectedDate
                ? "Compromissos cadastrados para a data selecionada."
                : "Eventos que ainda vão acontecer."}
            </p>
          </div>

          {selectedDate ? (
            <button
              type="button"
              onClick={clearSelectedDate}
              className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
            >
              Limpar filtro
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed text-sm font-semibold text-slate-300"
              title="Essa função ainda será adicionada."
            >
              Ver todos
            </button>
          )}
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
          displayedUpcomingEvents.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
              {selectedDate
                ? "Nenhum evento futuro nesta data."
                : "Nenhum próximo evento cadastrado."}
            </div>
          )}

        {!isEventsLoading &&
          !eventsErrorMessage &&
          displayedUpcomingEvents.length > 0 && (
            <div className="space-y-3">
              {displayedUpcomingEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  time={formatEventTime(event)}
                  color={getEventCardColor(index)}
                  isPast={false}
                  reminderCount={eventReminderCounts[event.id] ?? 0}
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
            <h3 className="text-lg font-bold">
              {selectedDate ? "Eventos finalizados neste dia" : "Histórico"}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {selectedDate
                ? "Eventos desta data que já passaram."
                : "Eventos que já passaram."}
            </p>
          </div>
        </div>

        {!isEventsLoading &&
          !eventsErrorMessage &&
          displayedPastEvents.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
              {selectedDate
                ? "Nenhum evento finalizado nesta data."
                : "Nenhum evento antigo por enquanto."}
            </div>
          )}

        {!isEventsLoading &&
          !eventsErrorMessage &&
          displayedPastEvents.length > 0 && (
            <div className="space-y-3">
              {displayedPastEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  time={formatEventTime(event)}
                  color={getEventCardColor(index)}
                  isPast
                  reminderCount={eventReminderCounts[event.id] ?? 0}
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

function ViewButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : disabled
            ? "cursor-not-allowed text-slate-300"
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
  isToday,
  dot,
  onSelect,
}: {
  day: number;
  muted: boolean;
  selected: boolean;
  isToday: boolean;
  dot?: CalendarDotColor;
  onSelect: () => void;
}) {
  const dotColor: Record<CalendarDotColor, string> = {
    primary: "bg-indigo-600",
    success: "bg-emerald-500",
    danger: "bg-red-500",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex h-14 items-center justify-center rounded-2xl text-sm font-semibold transition ${
        selected
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
          : muted
            ? "text-slate-300 hover:bg-slate-50"
            : isToday
              ? "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              : "text-slate-800 hover:bg-slate-50"
      }`}
    >
      {day}

      {dot && !selected && (
        <span
          className={`absolute bottom-2 h-1.5 w-1.5 rounded-full ${dotColor[dot]}`}
        />
      )}

      {dot && selected && (
        <span className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-white" />
      )}
    </button>
  );
}

function buildCalendarDays(
  visibleMonthDate: Date,
  events: LifeHubEvent[]
): CalendarDayItem[] {
  const year = visibleMonthDate.getFullYear();
  const month = visibleMonthDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const firstCalendarDate = new Date(firstDayOfMonth);

  firstCalendarDate.setDate(
    firstCalendarDate.getDate() - firstCalendarDate.getDay()
  );

  const today = new Date();
  const calendarDays: CalendarDayItem[] = [];

  for (let index = 0; index < 42; index++) {
    const currentDate = new Date(firstCalendarDate);

    currentDate.setDate(firstCalendarDate.getDate() + index);

    const hasEvent = events.some((event) =>
      isSameDate(parseEventDate(event.event_date), currentDate)
    );

    calendarDays.push({
      date: currentDate,
      day: currentDate.getDate(),
      muted: currentDate.getMonth() !== month,
      isToday: isSameDate(currentDate, today),
      hasEvent,
      dot: getDotColorByDay(currentDate.getDate()),
    });
  }

  return calendarDays;
}

function parseEventDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function isSameDate(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function isPastEventByDate(event: LifeHubEvent) {
  const eventDateTime = new Date(
    `${event.event_date}T${formatTime(event.end_time ?? event.start_time)}`
  );

  return eventDateTime.getTime() < new Date().getTime();
}

function sortEventsByDateAscending(
  firstEvent: LifeHubEvent,
  secondEvent: LifeHubEvent
) {
  const firstDate = new Date(
    `${firstEvent.event_date}T${formatTime(firstEvent.start_time)}`
  );

  const secondDate = new Date(
    `${secondEvent.event_date}T${formatTime(secondEvent.start_time)}`
  );

  return firstDate.getTime() - secondDate.getTime();
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

function getDotColorByDay(day: number): CalendarDotColor {
  const colors: CalendarDotColor[] = ["primary", "success", "danger"];

  return colors[day % colors.length];
}

export default CalendarSection;