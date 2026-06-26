import {
  Bell,
  BellRing,
  CheckCircle2,
  RefreshCcw,
  ShieldAlert,
} from "lucide-react";

import type { DueReminder } from "../../services/dueReminderService";
import type { BrowserNotificationPermission } from "../../services/browserNotificationService";

type NotificationPanelProps = {
  reminders: DueReminder[];
  isLoading: boolean;
  errorMessage: string;
  browserNotificationPermission: BrowserNotificationPermission;
  onRequestBrowserNotificationPermission: () => void;
  onRefresh: () => void;
  onMarkAsSeen: (reminderId: number) => void;
};

function NotificationPanel({
  reminders,
  isLoading,
  errorMessage,
  browserNotificationPermission,
  onRequestBrowserNotificationPermission,
  onRefresh,
  onMarkAsSeen,
}: NotificationPanelProps) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Central</p>

          <h2 className="mt-1 text-xl font-bold tracking-tight">
            Notificações
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Lembretes que chegaram no horário configurado.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
          aria-label="Atualizar lembretes"
        >
          <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      <BrowserNotificationStatus
        permission={browserNotificationPermission}
        onRequestPermission={onRequestBrowserNotificationPermission}
      />

      {isLoading && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
          Carregando lembretes...
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-600">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && reminders.length === 0 && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
          Nenhum lembrete pendente no momento.
        </div>
      )}

      {!isLoading && !errorMessage && reminders.length > 0 && (
        <div className="mt-4 space-y-3">
          {reminders.map((reminder) => {
            const isAlert = reminder.notification_level === "alert";

            return (
              <div
                key={reminder.reminder_id}
                className={`rounded-2xl border p-4 ${
                  isAlert
                    ? "border-red-200 bg-red-50"
                    : "border-indigo-100 bg-indigo-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      isAlert
                        ? "bg-red-100 text-red-600"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    {isAlert ? <BellRing size={19} /> : <Bell size={19} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`break-words text-sm font-bold ${
                        isAlert ? "text-red-700" : "text-indigo-700"
                      }`}
                    >
                      {reminder.event_title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Evento: {formatDateTime(reminder.event_datetime)}
                    </p>

                    <p className="text-xs font-semibold text-slate-400">
                      Lembrete: {formatDateTime(reminder.reminder_datetime)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onMarkAsSeen(reminder.reminder_id)}
                  className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    isAlert
                      ? "bg-red-600 text-white hover:bg-red-500"
                      : "bg-indigo-600 text-white hover:bg-indigo-500"
                  }`}
                >
                  <CheckCircle2 size={16} />
                  Marcar como visto
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function BrowserNotificationStatus({
  permission,
  onRequestPermission,
}: {
  permission: BrowserNotificationPermission;
  onRequestPermission: () => void;
}) {
  if (permission === "unsupported") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-500">
        Este navegador não suporta notificações nativas.
      </div>
    );
  }

  if (permission === "granted") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
        Notificações do navegador ativadas.
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-700">
        As notificações foram bloqueadas no navegador. Para ativar, libere nas
        permissões do site.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <ShieldAlert size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-indigo-700">
              Ativar notificações
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Permita notificações para receber avisos do LifeHUB no navegador.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestPermission}
          className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Permitir
        </button>
      </div>
    </div>
  );
}

function formatDateTime(dateTime: string) {
  const date = new Date(dateTime);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default NotificationPanel;