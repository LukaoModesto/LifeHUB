import { Bell, CalendarPlus, LogOut, Menu, Search, X } from "lucide-react";

type TopbarProps = {
  userName: string;
  userEmail: string;
  userInitials: string;
  isUserLoading: boolean;
  dueRemindersCount: number;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onOpenSidebar: () => void;
  onCreateEvent: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
};

function Topbar({
  userName,
  userEmail,
  userInitials,
  isUserLoading,
  dueRemindersCount,
  searchQuery,
  onSearchQueryChange,
  onOpenSidebar,
  onOpenNotifications,
  onCreateEvent,
  onLogout,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 px-5 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 xl:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          <div className="hidden min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-indigo-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 md:flex md:w-[360px] md:items-center md:gap-3">
            <Search size={18} className="shrink-0 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Buscar eventos..."
              className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchQueryChange("")}
                className="rounded-xl p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Limpar busca"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="min-w-0 md:hidden">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              LifeHUB
            </p>

            <h1 className="truncate text-lg font-bold text-slate-900">
              Dashboard
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onCreateEvent}
            className="hidden items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 sm:inline-flex"
          >
            <CalendarPlus size={18} />
            Novo evento
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Abrir Notificações"
          >
            <Bell size={20} />

            {dueRemindersCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                {dueRemindersCount}
              </span>
            )}
          </button>

          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-600">
              {isUserLoading ? "..." : userInitials}
            </div>

            <div className="max-w-[170px]">
              <p className="truncate text-sm font-bold text-slate-900">
                {isUserLoading ? "Carregando..." : userName}
              </p>

              <p className="truncate text-xs font-medium text-slate-400">
                {isUserLoading ? "Conta LifeHUB" : userEmail}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label="Sair"
          >
            <LogOut size={19} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-indigo-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 md:hidden">
        <Search size={18} className="mr-3 shrink-0 text-slate-400" />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Buscar eventos..."
          className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            className="ml-2 rounded-xl p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Limpar busca"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </header>
  );
}

export default Topbar;