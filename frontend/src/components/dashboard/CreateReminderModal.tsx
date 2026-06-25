import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type CreateReminderModalProps = {
  eventTitle: string;
  minutesBefore: string;
  errorMessage: string;
  successMessage: string;
  isLoading: boolean;
  onMinutesBeforeChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function CreateReminderModal({
  eventTitle,
  minutesBefore,
  errorMessage,
  successMessage,
  isLoading,
  onMinutesBeforeChange,
  onClose,
  onSubmit,
}: CreateReminderModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Novo lembrete
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Adicionar lembrete
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Evento: <strong>{eventTitle}</strong>
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

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Avisar quantos minutos antes?
            </label>

            <input
              type="number"
              min="1"
              max="43200"
              value={minutesBefore}
              onChange={(event) => onMinutesBeforeChange(event.target.value)}
              placeholder="Ex: 15"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

            <p className="mt-2 text-xs text-slate-400">
              Exemplos: 15 minutos, 60 minutos, 120 minutos ou 1440 minutos.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <QuickReminderButton
              label="15m"
              value="15"
              onClick={onMinutesBeforeChange}
            />
            <QuickReminderButton
              label="1h"
              value="60"
              onClick={onMinutesBeforeChange}
            />
            <QuickReminderButton
              label="2h"
              value="120"
              onClick={onMinutesBeforeChange}
            />
            <QuickReminderButton
              label="1d"
              value="1440"
              onClick={onMinutesBeforeChange}
            />
          </div>

          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Criando..." : "Criar lembrete"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function QuickReminderButton({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
    >
      {label}
    </button>
  );
}

export default CreateReminderModal;