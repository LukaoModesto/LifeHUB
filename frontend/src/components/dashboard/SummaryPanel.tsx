import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";

type SummaryPanelProps = {
  upcomingEventsCount: number;
  pastEventsCount: number;
  alertRemindersCount: number;
};

function SummaryPanel({
  upcomingEventsCount,
  pastEventsCount,
  alertRemindersCount,
}: SummaryPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Resumo</p>
          <h3 className="text-xl font-bold">Hoje</h3>
        </div>

        <Clock3 size={20} className="text-indigo-500" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Próximos" value={String(upcomingEventsCount)} />
        <SummaryCard label="Histórico" value={String(pastEventsCount)} />
        <SummaryCard label="Alertas" value={String(alertRemindersCount)} />
      </div>
    </motion.section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default SummaryPanel;