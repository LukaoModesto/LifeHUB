import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export type ReminderPresetOption = {
  label: string;
  value: number;
  description: string;
};

type CreateReminderModalProps = {
  eventTitle: string;
  selectedReminderValues: number[];
  disabledReminderValues: number[];
  customMinutesBefore: string;
  maxCustomMinutesBefore: number;
  errorMessage: string;
  successMessage: string;
  isLoading: boolean;
  onTogglePreset: (value: number) => void;
  onCustomMinutesBeforeChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const reminderPresetOptions: ReminderPresetOption[] = [
  {
    label: "1 dia antes",
    value: 1440,
    description: "Aviso no dia anterior ao evento.",
  },
  {
    label: "12 horas antes",
    value: 720,
    description: "Bom para compromissos importantes.",
  },
  {
    label: "6 horas antes",
    value: 360,
    description: "Lembrete intermediário no mesmo dia.",
  },
  {
    label: "1 hora antes",
    value: 60,
    description: "Aviso próximo do horário.",
  },
  {
    label: "15 minutos antes",
    value: 15,
    description: "Último aviso antes do evento.",
  },
];

function CreateReminderModal({
  eventTitle,
  selectedReminderValues,
  disabledReminderValues,
  customMinutesBefore,
  maxCustomMinutesBefore,
  errorMessage,
  successMessage,
  isLoading,
  onTogglePreset,
  onCustomMinutesBeforeChange,
  onClose,
  onSubmit,
}: CreateReminderModalProps) {
  const hasSelectedPreset = selectedReminderValues.length > 0;
  const isCustomReminderDisabled = isLoading || maxCustomMinutesBefore <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Configuração
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Lembretes do evento
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Escolha quando o LifeHUB deve te avisar antes de{" "}
              <strong>{eventTitle}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Quando quer ser avisado?
            </label>

            <div className="space-y-2">
              {reminderPresetOptions.map((preset) => {
                const isSelected = selectedReminderValues.includes(
                  preset.value
                );
                const isDisabled = disabledReminderValues.includes(
                  preset.value
                );

                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => onTogglePreset(preset.value)}
                    disabled={isLoading || isDisabled}
                    className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed ${
                      isDisabled
                        ? "border-slate-200 bg-slate-50 opacity-55"
                        : isSelected
                          ? "border-indigo-200 bg-indigo-50"
                          : "border-slate-200 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border text-xs font-bold ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : isDisabled
                            ? "border-slate-300 bg-slate-100 text-transparent"
                            : "border-slate-300 bg-white text-transparent"
                      }`}
                    >
                      ✓
                    </span>

                    <span>
                      <span
                        className={`block text-sm font-bold ${
                          isDisabled
                            ? "text-slate-400"
                            : isSelected
                              ? "text-indigo-700"
                              : "text-slate-700"
                        }`}
                      >
                        {preset.label}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {isDisabled
                          ? "Esse lembrete já passou para o horário deste evento."
                          : preset.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Lembrete personalizado em minutos
            </label>

            <input
              type="number"
              min="1"
              max={Math.max(maxCustomMinutesBefore, 1)}
              value={customMinutesBefore}
              onChange={(event) =>
                onCustomMinutesBeforeChange(event.target.value)
              }
              placeholder={
                maxCustomMinutesBefore > 0
                  ? `Ex: 30 — máximo ${maxCustomMinutesBefore}`
                  : "Evento muito próximo"
              }
              disabled={isCustomReminderDisabled}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
            />

            <p className="mt-2 text-xs text-slate-400">
              {maxCustomMinutesBefore > 0
                ? `Opcional. Para este evento, o personalizado deve ser entre 1 e ${maxCustomMinutesBefore} minuto(s) antes.`
                : "Não há tempo suficiente para criar um lembrete personalizado para este evento."}
            </p>
          </div>

          {!hasSelectedPreset && !customMinutesBefore && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
              Selecione pelo menos um lembrete disponível ou informe um valor
              personalizado.
            </div>
          )}

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
              disabled={isLoading}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Salvando..." : "Salvar lembretes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateReminderModal;