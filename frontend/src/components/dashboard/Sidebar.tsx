import type { ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  FileText,
  Grid2X2,
  Home,
  Plus,
  Settings,
} from "lucide-react";

type SidebarProps = {
  onCreateEvent: () => void;
};

function Sidebar({ onCreateEvent }: SidebarProps) {
  return (
    <aside className="hidden w-72 border-r border-slate-200 bg-white px-5 py-6 xl:block">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <CalendarDays size={22} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">LifeHUB</h1>
          <p className="text-xs font-medium text-slate-400">
            Agenda inteligente
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        <SidebarItem icon={<Home size={18} />} label="Início" />
        <SidebarItem icon={<Grid2X2 size={18} />} label="Dashboard" />
        <SidebarItem
          icon={<CalendarDays size={18} />}
          label="Calendário"
          active
        />
        <SidebarItem icon={<CheckCircle2 size={18} />} label="Tarefas" />
        <SidebarItem icon={<Bell size={18} />} label="Notificações" />
        <SidebarItem icon={<FileText size={18} />} label="Documentos" />
        <SidebarItem icon={<Settings size={18} />} label="Configurações" />
      </nav>

      <div className="mt-12 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <CalendarDays size={24} />
        </div>

        <p className="text-center text-sm leading-6 text-slate-500">
          Organize seu dia e mantenha sua rotina sob controle.
        </p>

        <button
          type="button"
          onClick={onCreateEvent}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          <Plus size={17} />
          Novo evento
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default Sidebar;