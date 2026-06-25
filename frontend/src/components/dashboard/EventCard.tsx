import { motion } from "framer-motion";
import { CalendarDays, Edit3, Trash2 } from "lucide-react";

type EventCardColor = "primary" | "success" | "danger";

type EventCardProps = {
  title: string;
  time: string;
  color: EventCardColor;
  isPast: boolean;
  onCreateReminder: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function EventCard({
  title,
  time,
  color,
  isPast,
  onCreateReminder,
  onEdit,
  onDelete,
}: EventCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`flex flex-col gap-4 rounded-2xl border p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center ${
        isPast
          ? "border-slate-200 bg-slate-50 opacity-80"
          : "border-slate-200 bg-white"
      }`}
    >
      <IconBadge color={isPast ? "neutral" : color} />

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-bold text-slate-900">{title}</h4>

          {isPast && (
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
              Finalizado
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-slate-500">{time}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!isPast && (
          <button
            type="button"
            onClick={onCreateReminder}
            className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
          >
            Adicionar lembrete
          </button>
        )}

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Edit3 size={15} />
          Editar
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <Trash2 size={15} />
          Excluir
        </button>

        {!isPast && (
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              color === "primary"
                ? "bg-indigo-600"
                : color === "success"
                  ? "bg-emerald-500"
                  : "bg-red-500"
            }`}
          />
        )}
      </div>
    </motion.div>
  );
}

function IconBadge({
  color,
}: {
  color: "primary" | "success" | "danger" | "neutral";
}) {
  const colorClasses: Record<
    "primary" | "success" | "danger" | "neutral",
    string
  > = {
    primary: "bg-indigo-100 text-indigo-600",
    success: "bg-emerald-100 text-emerald-600",
    danger: "bg-red-100 text-red-600",
    neutral: "bg-slate-100 text-slate-500",
  };

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClasses[color]}`}
    >
      <CalendarDays size={22} />
    </div>
  );
}

export default EventCard;