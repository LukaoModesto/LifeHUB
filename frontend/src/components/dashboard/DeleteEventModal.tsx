import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

type DeleteEventModalProps = {
  eventTitle: string;
  errorMessage: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteEventModal({
  eventTitle,
  errorMessage,
  isLoading,
  onClose,
  onConfirm,
}: DeleteEventModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md rounded-[2rem] border border-red-100 bg-white p-6 shadow-2xl shadow-slate-900/20"
      >
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <Trash2 size={22} />
          </div>

          <div>
            <p className="text-sm font-semibold text-red-600">
              Excluir evento
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Tem certeza?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              O evento <strong>{eventTitle}</strong> será removido da sua
              agenda.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {errorMessage}
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
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Excluindo..." : "Excluir evento"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteEventModal;