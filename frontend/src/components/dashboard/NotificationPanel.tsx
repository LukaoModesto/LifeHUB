import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";

type DueReminder = {
  reminder_id: number;
  event_id: number;
  event_title: string;
  event_datetime: string;
  reminder_datetime: string;
  minutes_before: number;
  notification_level: "normal" | "alert";
  sound_type: "default" | "alert";
};

type NotificationPanelProps = {
  reminders: DueReminder[];
  isLoading: boolean;
  errorMessage: string;
  onRefresh: () => void;
  onMarkAsSeen: (reminderId: number) => void;
};

function NotificationPanel({
  reminders,
  isLoading,
  errorMessage,
  onRefresh,
  onMarkAsSeen,
}: NotificationPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.35 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:p-6"
    >
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Central</p>
          <h3 className="text-xl font-bold">Notificações</h3>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          title="Atualizar lembretes"
        >
          <Settings size={18} />
        </button>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
          Carregando lembretes...
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-600">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && reminders.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
          Nenhum lembrete pendente no momento.
        </div>
      )}

      {!isLoading && !errorMessage && reminders.length > 0 && (
        <NotificationGroup title="Agora">
          {reminders.map((reminder) => (
            <DueReminderCard
              key={reminder.reminder_id}
              reminder={reminder}
              onMarkAsSeen={() => onMarkAsSeen(reminder.reminder_id)}
            />
          ))}
        </NotificationGroup>
      )}
    </motion.section>
  );
}

function DueReminderCard({
  reminder,
  onMarkAsSeen,
}: {
  reminder: DueReminder;
  onMarkAsSeen: () => void;
}) {
  const isAlert = reminder.notification_level === "alert";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${
        isAlert ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <IconBadge color={isAlert ? "danger" : "primary"} />

        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h4 className="font-bold text-slate-900">
              {reminder.event_title}
            </h4>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isAlert
                  ? "bg-red-100 text-red-600"
                  : "bg-indigo-100 text-indigo-600"
              }`}
            >
              {isAlert ? "Alerta" : "Normal"}
            </span>
          </div>

          <p className="text-sm text-slate-500">
            Evento em {formatDateTime(reminder.event_datetime)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Aviso configurado para {reminder.minutes_before} min antes.
          </p>

          <button
            type="button"
            onClick={onMarkAsSeen}
            className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
          >
            Marcar como visto
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NotificationGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-7 last:mb-0">
      <p className="mb-3 text-sm font-bold text-slate-700">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function IconBadge({ color }: { color: "primary" | "danger" }) {
  const colorClasses: Record<"primary" | "danger", string> = {
    primary: "bg-indigo-100 text-indigo-600",
    danger: "bg-red-100 text-red-600",
  };

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClasses[color]}`}
    >
      <Bell size={22} />
    </div>
  );
}

function formatDateTime(dateTime: string) {
  const date = new Date(dateTime);

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default NotificationPanel;