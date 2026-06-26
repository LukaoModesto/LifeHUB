import {
  BarChart3,
  CalendarDays,
  CalendarPlus,
  CheckSquare,
  Clock3,
  Home,
  Settings,
  Target,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

type ActiveMenuItem = "dashboard" | "calendar" | "reminders";

type SidebarProps = {
  isSidebarOpen: boolean;
  activeMenuItem: ActiveMenuItem;
  onCloseSidebar: () => void;
  onGoToDashboard: () => void;
  onGoToCalendar: () => void;
  onGoToReminders: () => void;
  onCreateEvent: () => void;
};

function Sidebar({
  isSidebarOpen,
  activeMenuItem,
  onCloseSidebar,
  onGoToDashboard,
  onGoToCalendar,
  onGoToReminders,
  onCreateEvent,
}: SidebarProps) {
  return (
    <>
      {isSidebarOpen && (
        <button
          type="button"
          onClick={onCloseSidebar}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm xl:hidden"
          aria-label="Fechar menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-2xl shadow-slate-900/10 transition-transform duration-300 xl:sticky xl:top-0 xl:z-20 xl:h-screen xl:translate-x-0 xl:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-600/25">
              LH
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                LifeHUB
              </h1>

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Calendar MVP
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseSidebar}
            className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 xl:hidden"
            aria-label="Fechar menu"
          >
            <X size={21} />
          </button>
        </div>

        <button
          type="button"
          onClick={onCreateEvent}
          className="mb-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          <CalendarPlus size={18} />
          Novo evento
        </button>

        <nav className="space-y-2">
          <SidebarItem
            icon={<Home size={19} />}
            label="Dashboard"
            active={activeMenuItem === "dashboard"}
            onClick={onGoToDashboard}
          />

          <SidebarItem
            icon={<CalendarDays size={19} />}
            label="Calendário"
            active={activeMenuItem === "calendar"}
            onClick={onGoToCalendar}
          />

          <SidebarItem
            icon={<Clock3 size={19} />}
            label="Lembretes"
            active={activeMenuItem === "reminders"}
            onClick={onGoToReminders}
          />

          <SidebarItem
            icon={<CheckSquare size={19} />}
            label="Tarefas"
            disabled
          />

          <SidebarItem icon={<Target size={19} />} label="Metas" disabled />

          <SidebarItem
            icon={<BarChart3 size={19} />}
            label="Progresso"
            disabled
          />
        </nav>

        <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
            <Settings size={17} />
            Próximas features
          </div>

          <p className="text-sm leading-6 text-slate-500">
            Semana, dia, tarefas, metas e progresso serão liberados nas próximas
            versões do LifeHUB.
          </p>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : disabled
            ? "cursor-not-allowed text-slate-300"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default Sidebar;