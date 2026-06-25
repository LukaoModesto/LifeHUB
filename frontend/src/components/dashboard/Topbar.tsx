import {
  Bell,
  LogOut,
  Menu,
  Plus,
  Search,
} from "lucide-react";

type TopbarProps = {
  userName: string;
  userEmail: string;
  userInitials: string;
  isUserLoading: boolean;
  dueRemindersCount: number;
  onCreateEvent: () => void;
  onLogout: () => void;
};

function Topbar({
  userName,
  userEmail,
  userInitials,
  isUserLoading,
  dueRemindersCount,
  onCreateEvent,
  onLogout,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-5 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 xl:hidden">
          <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600">
            <Menu size={20} />
          </button>

          <div>
            <h1 className="font-bold">LifeHUB</h1>
            <p className="text-xs text-slate-400">Calendário</p>
          </div>
        </div>

        <div className="hidden items-center gap-8 xl:flex">
          <TopNavItem label="Dashboard" />
          <TopNavItem label="Calendário" active />
          <TopNavItem label="Tarefas" />
          <TopNavItem label="Notificações" />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="hidden rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50 sm:block">
            <Search size={20} />
          </button>

          <button className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50">
            <Bell size={20} />

            {dueRemindersCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          <button
            type="button"
            onClick={onCreateEvent}
            className="hidden items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 lg:inline-flex"
          >
            <Plus size={17} />
            Novo evento
          </button>

          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {userInitials}
            </div>

            <div>
              <p className="text-sm font-semibold">
                {isUserLoading ? "Carregando..." : userName}
              </p>
              <p className="text-xs text-slate-400">{userEmail}</p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              title="Sair"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function TopNavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`relative px-2 py-2 text-sm font-semibold transition ${
        active ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
      }`}
    >
      {label}

      {active && (
        <span className="absolute -bottom-[18px] left-0 h-0.5 w-full rounded-full bg-indigo-600" />
      )}
    </button>
  );
}

export default Topbar;