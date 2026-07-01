import { useEffect, useState } from "react";
import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createRecurringReminder,
  deleteRecurringReminder,
  formatRecurringReminderTime,
  getRecurringReminders,
  getWeekdayLabel,
  processDueRecurringReminders,
  type CreateRecurringReminderData,
  type RecurringReminder,
  type Weekday,
} from "../../services/recurringReminderService";

const weekdayOptions: { label: string; value: Weekday }[] = [
  { label: "Segunda-feira", value: 0 },
  { label: "Terça-feira", value: 1 },
  { label: "Quarta-feira", value: 2 },
  { label: "Quinta-feira", value: 3 },
  { label: "Sexta-feira", value: 4 },
  { label: "Sábado", value: 5 },
  { label: "Domingo", value: 6 },
];

function RecurringRemindersPanel() {
  const [recurringReminders, setRecurringReminders] = useState<
    RecurringReminder[]
  >([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [weekday, setWeekday] = useState<Weekday>(0);
  const [reminderTime, setReminderTime] = useState("19:00");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadRecurringReminders();
  }, []);

  async function loadRecurringReminders() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const reminders = await getRecurringReminders();

      setRecurringReminders(reminders);
    } catch {
      setErrorMessage("Não foi possível carregar os lembretes recorrentes.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateRecurringReminder() {
    setMessage("");
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Informe o título do lembrete recorrente.");
      return;
    }

    if (!reminderTime) {
      setErrorMessage("Informe o horário do lembrete recorrente.");
      return;
    }

    setIsCreating(true);

    try {
      const newRecurringReminder: CreateRecurringReminderData = {
        title: title.trim(),
        description: description.trim() || null,
        weekday,
        reminder_time: `${reminderTime}:00`,
        is_active: true,
      };

      await createRecurringReminder(newRecurringReminder);

      setTitle("");
      setDescription("");
      setWeekday(0);
      setReminderTime("19:00");

      setMessage("Lembrete recorrente criado com sucesso.");
      await loadRecurringReminders();
    } catch {
      setErrorMessage("Não foi possível criar o lembrete recorrente.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteRecurringReminder(recurringReminderId: number) {
    setMessage("");
    setErrorMessage("");

    try {
      await deleteRecurringReminder(recurringReminderId);

      setMessage("Lembrete recorrente removido com sucesso.");
      await loadRecurringReminders();
    } catch {
      setErrorMessage("Não foi possível remover o lembrete recorrente.");
    }
  }

  async function handleProcessDueRecurringReminders() {
    setMessage("");
    setErrorMessage("");
    setIsProcessing(true);

    try {
      const result = await processDueRecurringReminders();

      setMessage(
        `Processamento finalizado: ${result.sent} enviada(s), ${result.skipped} ignorada(s), ${result.failed} falha(s).`
      );

      await loadRecurringReminders();
    } catch {
      setErrorMessage("Não foi possível processar os lembretes recorrentes.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <CalendarClock size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-indigo-600">Rotina</p>

            <h3 className="mt-1 text-xl font-black leading-tight text-slate-900">
              Lembretes recorrentes
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Crie avisos fixos para compromissos que se repetem toda semana.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleProcessDueRecurringReminders}
          disabled={isProcessing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isProcessing ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <BellRing size={17} />
          )}

          Testar avisos
        </button>
      </div>

      <div className="mb-5 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
            Título
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Aula de guitarra"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
            Descrição
          </label>

          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Praticar exercícios da semana"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
              Dia
            </label>

            <select
              value={weekday}
              onChange={(event) =>
                setWeekday(Number(event.target.value) as Weekday)
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            >
              {weekdayOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
              Horário
            </label>

            <input
              type="time"
              value={reminderTime}
              onChange={(event) => setReminderTime(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreateRecurringReminder}
          disabled={isCreating}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isCreating ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Plus size={17} />
          )}

          Criar lembrete recorrente
        </button>
      </div>

      {message && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <p className="text-sm font-semibold leading-6 text-emerald-700">
            {message}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <X size={18} className="mt-0.5 shrink-0 text-red-600" />

          <p className="text-sm font-semibold leading-6 text-red-600">
            {errorMessage}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : recurringReminders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
          Nenhum lembrete recorrente criado ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {recurringReminders.map((recurringReminder) => (
            <RecurringReminderItem
              key={recurringReminder.id}
              recurringReminder={recurringReminder}
              onDelete={handleDeleteRecurringReminder}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RecurringReminderItem({
  recurringReminder,
  onDelete,
}: {
  recurringReminder: RecurringReminder;
  onDelete: (recurringReminderId: number) => void;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <BellRing size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="break-words font-black text-slate-900">
              {recurringReminder.title}
            </h4>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                recurringReminder.is_active
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {recurringReminder.is_active ? "Ativo" : "Pausado"}
            </span>
          </div>

          {recurringReminder.description && (
            <p className="mt-1 break-words text-sm leading-6 text-slate-500">
              {recurringReminder.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <CalendarClock size={14} />
              {getWeekdayLabel(recurringReminder.weekday)}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <Clock3 size={14} />
              {formatRecurringReminderTime(recurringReminder.reminder_time)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(recurringReminder.id)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-100 active:scale-[0.99]"
      >
        <Trash2 size={17} />
        Remover
      </button>
    </article>
  );
}

export default RecurringRemindersPanel;