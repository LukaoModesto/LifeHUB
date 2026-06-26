import { motion } from "framer-motion";
import {
  CalendarPlus,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  X,
} from "lucide-react";

import type { LifeHubEvent } from "../../services/eventService";

type DayEventsModalProps = {
  selectedDate: Date;
  events: LifeHubEvent[];
  eventReminderCounts: Record<number, number>;
  onCreateEventForDate: (eventDate: string) => void;
  onCreateReminder: (event: LifeHubEvent) => void;
  onEditEvent: (event: LifeHubEvent) => void;
  onDeleteEvent: (event: LifeHubEvent) => void;
  onClose: () => void;
};

function DayEventsModal({
  selectedDate,
  events,
  eventReminderCounts,
  onCreateEventForDate,
  onCreateReminder,
  onEditEvent,
  onDeleteEvent,
  onClose,
}: DayEventsModalProps) {
  const selectedDateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(selectedDate);

  const selectedDateInputValue = formatDateToInputValue(selectedDate);

  function handleCreateEventForDate() {
    onClose();
    onCreateEventForDate(selectedDateInputValue);
  }

  function handleCreateReminder(event: LifeHubEvent) {
    onClose();
    onCreateReminder(event);
  }

  function handleEditEvent(event: LifeHubEvent) {
    onClose();
    onEditEvent(event);
  }

  function handleDeleteEvent(event: LifeHubEvent) {
    onClose();
    onDeleteEvent(event);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Calendário
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Eventos do dia
            </h2>

            <p className="mt-2 text-sm capitalize leading-6 text-slate-500">
              {selectedDateLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
            Nenhum evento cadastrado para este dia.
          </div>
        ) : (
          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {events.map((event) => {
              const reminderCount = eventReminderCounts[event.id] ?? 0;
              const isPast = isPastEvent(event);

              return (
                <div
                  key={event.id}
                  className={`rounded-2xl border p-4 ${
                    isPast
                      ? "border-slate-200 bg-slate-50 opacity-80"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">
                          {event.title}
                        </h3>

                        {isPast && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                            <CheckCircle2 size={13} />
                            Finalizado
                          </span>
                        )}
                      </div>

                      <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Clock size={15} />
                        {formatEventTime(event)}
                      </p>

                      {event.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {event.description}
                        </p>
                      )}

                      {!isPast && reminderCount > 0 && (
                        <span className="mt-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                          {reminderCount}{" "}
                          {reminderCount === 1 ? "lembrete" : "lembretes"}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!isPast && (
                        <button
                          type="button"
                          onClick={() => handleCreateReminder(event)}
                          className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100"
                        >
                          Lembretes
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleEditEvent(event)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Edit3 size={13} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(event)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={13} />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={handleCreateEventForDate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
          >
            <CalendarPlus size={18} />
            Criar evento neste dia
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function formatDateToInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatEventTime(event: LifeHubEvent) {
  const startTime = formatTime(event.start_time);

  if (!event.end_time) {
    return `Às ${startTime}`;
  }

  return `${startTime} - ${formatTime(event.end_time)}`;
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function isPastEvent(event: LifeHubEvent) {
  const eventEndDateTime = new Date(
    `${event.event_date}T${formatTime(event.end_time ?? event.start_time)}`
  );

  return eventEndDateTime.getTime() < new Date().getTime();
}

export default DayEventsModal;