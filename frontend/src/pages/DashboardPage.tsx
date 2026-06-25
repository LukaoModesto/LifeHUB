import type { FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  FileText,
  Grid2X2,
  Home,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";

import { api } from "../services/api";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
  type CreateEventData,
  type LifeHubEvent,
  type UpdateEventData,
} from "../services/eventService";
import { createEventReminder } from "../services/reminderService";
import {
  getDueReminders,
  markReminderAsSent,
  type DueReminder,
} from "../services/dueReminderService";
import { playNotificationSound } from "../services/notificationSoundService";

type User = {
  id: number;
  name: string;
  email: string;
};

type CalendarDotColor = "primary" | "success" | "danger";

type CalendarDayItem = {
  day: number;
  muted?: boolean;
  selected?: boolean;
  dot?: CalendarDotColor;
};

type EventCardColor = "primary" | "success" | "danger";

const calendarDays: CalendarDayItem[] = [
  { day: 26, muted: true },
  { day: 27, muted: true },
  { day: 28, muted: true },
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 31, muted: true },
  { day: 1 },
  { day: 2 },
  { day: 3 },
  { day: 4 },
  { day: 5 },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 9 },
  { day: 10 },
  { day: 11 },
  { day: 12, selected: true },
  { day: 13 },
  { day: 14 },
  { day: 15 },
  { day: 16 },
  { day: 17 },
  { day: 18 },
  { day: 19 },
  { day: 20, dot: "primary" },
  { day: 21 },
  { day: 22 },
  { day: 23, dot: "danger" },
  { day: 24 },
  { day: 25, dot: "success" },
  { day: 26 },
  { day: 27 },
  { day: 28 },
  { day: 29 },
  { day: 30 },
  { day: 1, muted: true },
  { day: 2, muted: true },
  { day: 3, muted: true },
  { day: 4, muted: true },
  { day: 5, muted: true },
  { day: 6, muted: true },
];

function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<LifeHubEvent[]>([]);
  const [dueReminders, setDueReminders] = useState<DueReminder[]>([]);

  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isDueRemindersLoading, setIsDueRemindersLoading] = useState(true);

  const [eventsErrorMessage, setEventsErrorMessage] = useState("");
  const [dueRemindersErrorMessage, setDueRemindersErrorMessage] = useState("");

  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventStartTime, setNewEventStartTime] = useState("");
  const [newEventEndTime, setNewEventEndTime] = useState("");
  const [createEventErrorMessage, setCreateEventErrorMessage] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const [selectedEventForReminder, setSelectedEventForReminder] =
    useState<LifeHubEvent | null>(null);
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState("15");
  const [createReminderErrorMessage, setCreateReminderErrorMessage] =
    useState("");
  const [createReminderSuccessMessage, setCreateReminderSuccessMessage] =
    useState("");
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);

  const [selectedEventForEdit, setSelectedEventForEdit] =
    useState<LifeHubEvent | null>(null);
  const [editEventTitle, setEditEventTitle] = useState("");
  const [editEventDescription, setEditEventDescription] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editEventStartTime, setEditEventStartTime] = useState("");
  const [editEventEndTime, setEditEventEndTime] = useState("");
  const [editEventErrorMessage, setEditEventErrorMessage] = useState("");
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  const [selectedEventForDelete, setSelectedEventForDelete] =
    useState<LifeHubEvent | null>(null);
  const [deleteEventErrorMessage, setDeleteEventErrorMessage] = useState("");
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

  const playedReminderIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const userResponse = await api.get<User>("/users/me");
        setUser(userResponse.data);
      } catch {
        localStorage.removeItem("lifehub_token");
        navigate("/login");
        return;
      } finally {
        setIsUserLoading(false);
      }

      await Promise.all([loadEvents(), loadDueReminders()]);
    }

    loadDashboardData();
  }, [navigate]);

  async function loadEvents() {
    setIsEventsLoading(true);
    setEventsErrorMessage("");

    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch {
      setEventsErrorMessage("Não foi possível carregar seus eventos.");
    } finally {
      setIsEventsLoading(false);
    }
  }

  async function loadDueReminders() {
    setIsDueRemindersLoading(true);
    setDueRemindersErrorMessage("");

    try {
      const remindersData = await getDueReminders();

      setDueReminders(remindersData);

      const newReminders = remindersData.filter(
        (reminder) => !playedReminderIdsRef.current.has(reminder.reminder_id)
      );

      newReminders.forEach((reminder) => {
        playedReminderIdsRef.current.add(reminder.reminder_id);

        try {
          playNotificationSound(reminder.sound_type);
        } catch {
          console.warn("O navegador bloqueou o som da notificação.");
        }
      });
    } catch {
      setDueRemindersErrorMessage("Não foi possível carregar os lembretes.");
    } finally {
      setIsDueRemindersLoading(false);
    }
  }

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCreateEventErrorMessage("");

    if (!newEventTitle.trim()) {
      setCreateEventErrorMessage("O título do evento é obrigatório.");
      return;
    }

    if (!newEventDate) {
      setCreateEventErrorMessage("A data do evento é obrigatória.");
      return;
    }

    if (!newEventStartTime) {
      setCreateEventErrorMessage("O horário de início é obrigatório.");
      return;
    }

    if (newEventEndTime && newEventEndTime <= newEventStartTime) {
      setCreateEventErrorMessage(
        "O horário de término deve ser maior que o horário de início."
      );
      return;
    }

    const eventData: CreateEventData = {
      title: newEventTitle.trim(),
      description: newEventDescription.trim() || null,
      event_date: newEventDate,
      start_time: newEventStartTime,
      end_time: newEventEndTime || null,
    };

    setIsCreatingEvent(true);

    try {
      const createdEvent = await createEvent(eventData);

      setEvents((currentEvents) => [...currentEvents, createdEvent]);

      setNewEventTitle("");
      setNewEventDescription("");
      setNewEventDate("");
      setNewEventStartTime("");
      setNewEventEndTime("");
      setIsCreateEventModalOpen(false);
    } catch {
      setCreateEventErrorMessage("Não foi possível criar o evento.");
    } finally {
      setIsCreatingEvent(false);
    }
  }

  async function handleCreateReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCreateReminderErrorMessage("");
    setCreateReminderSuccessMessage("");

    if (!selectedEventForReminder) {
      setCreateReminderErrorMessage("Nenhum evento selecionado.");
      return;
    }

    const minutesBefore = Number(reminderMinutesBefore);

    if (!Number.isInteger(minutesBefore) || minutesBefore <= 0) {
      setCreateReminderErrorMessage(
        "Informe uma quantidade válida de minutos."
      );
      return;
    }

    if (minutesBefore > 43200) {
      setCreateReminderErrorMessage(
        "O lembrete não pode ultrapassar 30 dias antes do evento."
      );
      return;
    }

    setIsCreatingReminder(true);

    try {
      await createEventReminder(selectedEventForReminder.id, {
        minutes_before: minutesBefore,
      });

      setCreateReminderSuccessMessage("Lembrete criado com sucesso.");
      setReminderMinutesBefore("15");

      setTimeout(() => {
        setSelectedEventForReminder(null);
        setCreateReminderSuccessMessage("");
        loadDueReminders();
      }, 700);
    } catch {
      setCreateReminderErrorMessage(
        "Não foi possível criar o lembrete. Verifique se ele já existe para este evento."
      );
    } finally {
      setIsCreatingReminder(false);
    }
  }

  async function handleUpdateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEditEventErrorMessage("");

    if (!selectedEventForEdit) {
      setEditEventErrorMessage("Nenhum evento selecionado.");
      return;
    }

    if (!editEventTitle.trim()) {
      setEditEventErrorMessage("O título do evento é obrigatório.");
      return;
    }

    if (!editEventDate) {
      setEditEventErrorMessage("A data do evento é obrigatória.");
      return;
    }

    if (!editEventStartTime) {
      setEditEventErrorMessage("O horário de início é obrigatório.");
      return;
    }

    if (editEventEndTime && editEventEndTime <= editEventStartTime) {
      setEditEventErrorMessage(
        "O horário de término deve ser maior que o horário de início."
      );
      return;
    }

    const eventData: UpdateEventData = {
      title: editEventTitle.trim(),
      description: editEventDescription.trim() || null,
      event_date: editEventDate,
      start_time: editEventStartTime,
      end_time: editEventEndTime || null,
    };

    setIsEditingEvent(true);

    try {
      const updatedEvent = await updateEvent(selectedEventForEdit.id, eventData);

      setEvents((currentEvents) =>
        currentEvents.map((currentEvent) =>
          currentEvent.id === updatedEvent.id ? updatedEvent : currentEvent
        )
      );

      closeEditEventModal();
      loadDueReminders();
    } catch {
      setEditEventErrorMessage("Não foi possível atualizar o evento.");
    } finally {
      setIsEditingEvent(false);
    }
  }

  async function handleDeleteEvent() {
    if (!selectedEventForDelete) {
      return;
    }

    setDeleteEventErrorMessage("");
    setIsDeletingEvent(true);

    try {
      await deleteEvent(selectedEventForDelete.id);

      setEvents((currentEvents) =>
        currentEvents.filter(
          (currentEvent) => currentEvent.id !== selectedEventForDelete.id
        )
      );

      setDueReminders((currentReminders) =>
        currentReminders.filter(
          (reminder) => reminder.event_id !== selectedEventForDelete.id
        )
      );

      setSelectedEventForDelete(null);
    } catch {
      setDeleteEventErrorMessage("Não foi possível excluir o evento.");
    } finally {
      setIsDeletingEvent(false);
    }
  }

  async function handleMarkReminderAsSent(reminderId: number) {
    try {
      await markReminderAsSent(reminderId);

      setDueReminders((currentReminders) =>
        currentReminders.filter(
          (reminder) => reminder.reminder_id !== reminderId
        )
      );
    } catch {
      setDueRemindersErrorMessage(
        "Não foi possível marcar o lembrete como visto."
      );
    }
  }

  function openReminderModal(event: LifeHubEvent) {
    setSelectedEventForReminder(event);
    setReminderMinutesBefore("15");
    setCreateReminderErrorMessage("");
    setCreateReminderSuccessMessage("");
  }

  function closeReminderModal() {
    setSelectedEventForReminder(null);
    setReminderMinutesBefore("15");
    setCreateReminderErrorMessage("");
    setCreateReminderSuccessMessage("");
  }

  function openEditEventModal(event: LifeHubEvent) {
    setSelectedEventForEdit(event);
    setEditEventTitle(event.title);
    setEditEventDescription(event.description ?? "");
    setEditEventDate(event.event_date);
    setEditEventStartTime(formatTime(event.start_time));
    setEditEventEndTime(event.end_time ? formatTime(event.end_time) : "");
    setEditEventErrorMessage("");
  }

  function closeEditEventModal() {
    setSelectedEventForEdit(null);
    setEditEventTitle("");
    setEditEventDescription("");
    setEditEventDate("");
    setEditEventStartTime("");
    setEditEventEndTime("");
    setEditEventErrorMessage("");
  }

  function openDeleteEventModal(event: LifeHubEvent) {
    setSelectedEventForDelete(event);
    setDeleteEventErrorMessage("");
  }

  function closeDeleteEventModal() {
    setSelectedEventForDelete(null);
    setDeleteEventErrorMessage("");
  }

  function handleLogout() {
    localStorage.removeItem("lifehub_token");
    navigate("/login");
  }

  const userName = user?.name ?? "Usuário";
  const userEmail = user?.email ?? "Conta LifeHUB";
  const userInitials = getUserInitials(userName);

  const upcomingEvents = events
    .filter((event) => !isPastEvent(event))
    .sort(sortEventsAscending);

  const pastEvents = events
    .filter((event) => isPastEvent(event))
    .sort(sortEventsDescending);

  const alertRemindersCount = dueReminders.filter(
    (reminder) => reminder.notification_level === "alert"
  ).length;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="flex min-h-screen">
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
              onClick={() => setIsCreateEventModalOpen(true)}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              <Plus size={17} />
              Novo evento
            </button>
          </div>
        </aside>

        <section className="flex-1">
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
                  {dueReminders.length > 0 && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreateEventModalOpen(true)}
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
                    onClick={handleLogout}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    title="Sair"
                  >
                    <LogOut size={17} />
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-6 p-5 lg:p-8 2xl:grid-cols-[1fr_420px]">
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:p-6"
            >
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100">
                    <ChevronLeft size={20} />
                  </button>

                  <h2 className="text-2xl font-bold tracking-tight">
                    Agenda
                  </h2>

                  <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100">
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="flex w-fit rounded-2xl border border-slate-200 bg-slate-50 p-1">
                  <ViewButton label="Hoje" />
                  <ViewButton label="Mês" active />
                  <ViewButton label="Semana" />
                  <ViewButton label="Dia" />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
                  (weekDay) => (
                    <div
                      key={weekDay}
                      className="pb-3 text-xs font-bold tracking-wide text-slate-400"
                    >
                      {weekDay}
                    </div>
                  )
                )}

                {calendarDays.map((item, index) => (
                  <CalendarDay
                    key={`${item.day}-${index}`}
                    day={item.day}
                    muted={item.muted}
                    selected={item.selected}
                    dot={item.dot}
                  />
                ))}
              </div>

              <div className="mt-9">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Próximos eventos</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Eventos que ainda vão acontecer.
                    </p>
                  </div>

                  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                    Ver todos
                  </button>
                </div>

                {isEventsLoading && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
                    Carregando eventos...
                  </div>
                )}

                {!isEventsLoading && eventsErrorMessage && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-600">
                    {eventsErrorMessage}
                  </div>
                )}

                {!isEventsLoading &&
                  !eventsErrorMessage &&
                  upcomingEvents.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
                      Nenhum próximo evento cadastrado.
                    </div>
                  )}

                {!isEventsLoading &&
                  !eventsErrorMessage &&
                  upcomingEvents.length > 0 && (
                    <div className="space-y-3">
                      {upcomingEvents.map((event, index) => (
                        <EventCard
                          key={event.id}
                          title={event.title}
                          time={formatEventTime(event)}
                          color={getEventCardColor(index)}
                          isPast={false}
                          onCreateReminder={() => openReminderModal(event)}
                          onEdit={() => openEditEventModal(event)}
                          onDelete={() => openDeleteEventModal(event)}
                        />
                      ))}
                    </div>
                  )}
              </div>

              <div className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Histórico</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Eventos que já passaram.
                    </p>
                  </div>
                </div>

                {!isEventsLoading &&
                  !eventsErrorMessage &&
                  pastEvents.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
                      Nenhum evento antigo por enquanto.
                    </div>
                  )}

                {!isEventsLoading &&
                  !eventsErrorMessage &&
                  pastEvents.length > 0 && (
                    <div className="space-y-3">
                      {pastEvents.map((event, index) => (
                        <EventCard
                          key={event.id}
                          title={event.title}
                          time={formatEventTime(event)}
                          color={getEventCardColor(index)}
                          isPast
                          onCreateReminder={() => openReminderModal(event)}
                          onEdit={() => openEditEventModal(event)}
                          onDelete={() => openDeleteEventModal(event)}
                        />
                      ))}
                    </div>
                  )}
              </div>
            </motion.section>

            <aside className="space-y-6">
              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.35 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:p-6"
              >
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Central
                    </p>
                    <h3 className="text-xl font-bold">Notificações</h3>
                  </div>

                  <button
                    type="button"
                    onClick={loadDueReminders}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    title="Atualizar lembretes"
                  >
                    <Settings size={18} />
                  </button>
                </div>

                {isDueRemindersLoading && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
                    Carregando lembretes...
                  </div>
                )}

                {!isDueRemindersLoading && dueRemindersErrorMessage && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-600">
                    {dueRemindersErrorMessage}
                  </div>
                )}

                {!isDueRemindersLoading &&
                  !dueRemindersErrorMessage &&
                  dueReminders.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
                      Nenhum lembrete pendente no momento.
                    </div>
                  )}

                {!isDueRemindersLoading &&
                  !dueRemindersErrorMessage &&
                  dueReminders.length > 0 && (
                    <NotificationGroup title="Agora">
                      {dueReminders.map((reminder) => (
                        <DueReminderCard
                          key={reminder.reminder_id}
                          reminder={reminder}
                          onMarkAsSeen={() =>
                            handleMarkReminderAsSent(reminder.reminder_id)
                          }
                        />
                      ))}
                    </NotificationGroup>
                  )}
              </motion.section>

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
                  <SummaryCard
                    label="Próximos"
                    value={String(upcomingEvents.length)}
                  />
                  <SummaryCard
                    label="Histórico"
                    value={String(pastEvents.length)}
                  />
                  <SummaryCard
                    label="Alertas"
                    value={String(alertRemindersCount)}
                  />
                </div>
              </motion.section>
            </aside>
          </div>
        </section>
      </div>

      {isCreateEventModalOpen && (
        <EventFormModal
          mode="create"
          title={newEventTitle}
          description={newEventDescription}
          eventDate={newEventDate}
          startTime={newEventStartTime}
          endTime={newEventEndTime}
          errorMessage={createEventErrorMessage}
          isLoading={isCreatingEvent}
          onTitleChange={setNewEventTitle}
          onDescriptionChange={setNewEventDescription}
          onEventDateChange={setNewEventDate}
          onStartTimeChange={setNewEventStartTime}
          onEndTimeChange={setNewEventEndTime}
          onClose={() => setIsCreateEventModalOpen(false)}
          onSubmit={handleCreateEvent}
        />
      )}

      {selectedEventForEdit && (
        <EventFormModal
          mode="edit"
          title={editEventTitle}
          description={editEventDescription}
          eventDate={editEventDate}
          startTime={editEventStartTime}
          endTime={editEventEndTime}
          errorMessage={editEventErrorMessage}
          isLoading={isEditingEvent}
          onTitleChange={setEditEventTitle}
          onDescriptionChange={setEditEventDescription}
          onEventDateChange={setEditEventDate}
          onStartTimeChange={setEditEventStartTime}
          onEndTimeChange={setEditEventEndTime}
          onClose={closeEditEventModal}
          onSubmit={handleUpdateEvent}
        />
      )}

      {selectedEventForReminder && (
        <CreateReminderModal
          eventTitle={selectedEventForReminder.title}
          minutesBefore={reminderMinutesBefore}
          errorMessage={createReminderErrorMessage}
          successMessage={createReminderSuccessMessage}
          isLoading={isCreatingReminder}
          onMinutesBeforeChange={setReminderMinutesBefore}
          onClose={closeReminderModal}
          onSubmit={handleCreateReminder}
        />
      )}

      {selectedEventForDelete && (
        <DeleteEventModal
          eventTitle={selectedEventForDelete.title}
          errorMessage={deleteEventErrorMessage}
          isLoading={isDeletingEvent}
          onClose={closeDeleteEventModal}
          onConfirm={handleDeleteEvent}
        />
      )}
    </main>
  );
}

function DueReminderCard({
  reminder,
  onMarkAsSeen,
}: {
  reminder: DueReminder;
  onMarkAsSeen: () => void;
}) {
  const isAlert = reminder.notification_level === "alert";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${
        isAlert ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <IconBadge color={isAlert ? "danger" : "primary"} icon="bell" />

        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h4 className="font-bold text-slate-900">
              {reminder.event_title}
            </h4>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isAlert
                  ? "bg-red-100 text-red-600"
                  : "bg-indigo-100 text-indigo-600"
              }`}
            >
              {isAlert ? "Alerta" : "Normal"}
            </span>
          </div>

          <p className="text-sm text-slate-500">
            Evento em {formatDateTime(reminder.event_datetime)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Aviso configurado para {reminder.minutes_before} min antes.
          </p>

          <button
            type="button"
            onClick={onMarkAsSeen}
            className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
          >
            Marcar como visto
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EventFormModal({
  mode,
  title,
  description,
  eventDate,
  startTime,
  endTime,
  errorMessage,
  isLoading,
  onTitleChange,
  onDescriptionChange,
  onEventDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  errorMessage: string;
  isLoading: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onEventDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const isEditMode = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              {isEditMode ? "Editar evento" : "Novo evento"}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              {isEditMode ? "Atualizar compromisso" : "Criar compromisso"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {isEditMode
                ? "Atualize as informações do evento."
                : "Adicione um evento à sua agenda do LifeHUB."}
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
              Título
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Ex: Consulta médica"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Descrição
            </label>

            <textarea
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Detalhes do evento"
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Data
              </label>

              <input
                type="date"
                value={eventDate}
                onChange={(event) => onEventDateChange(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Início
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(event) => onStartTimeChange(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Término
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(event) => onEndTimeChange(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errorMessage}
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
              {isLoading
                ? isEditMode
                  ? "Salvando..."
                  : "Criando..."
                : isEditMode
                  ? "Salvar alterações"
                  : "Criar evento"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function CreateReminderModal({
  eventTitle,
  minutesBefore,
  errorMessage,
  successMessage,
  isLoading,
  onMinutesBeforeChange,
  onClose,
  onSubmit,
}: {
  eventTitle: string;
  minutesBefore: string;
  errorMessage: string;
  successMessage: string;
  isLoading: boolean;
  onMinutesBeforeChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
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

function DeleteEventModal({
  eventTitle,
  errorMessage,
  isLoading,
  onClose,
  onConfirm,
}: {
  eventTitle: string;
  errorMessage: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
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

function ViewButton({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-500 hover:bg-white hover:text-slate-900"
      }`}
    >
      {label}
    </button>
  );
}

function CalendarDay({
  day,
  muted,
  selected,
  dot,
}: {
  day: number;
  muted?: boolean;
  selected?: boolean;
  dot?: CalendarDotColor;
}) {
  const dotColor: Record<CalendarDotColor, string> = {
    primary: "bg-indigo-600",
    success: "bg-emerald-500",
    danger: "bg-red-500",
  };

  return (
    <button
      className={`relative flex h-14 items-center justify-center rounded-2xl text-sm font-semibold transition hover:bg-slate-50 ${
        selected
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-600"
          : muted
            ? "text-slate-300"
            : "text-slate-800"
      }`}
    >
      {day}

      {dot && !selected && (
        <span
          className={`absolute bottom-2 h-1.5 w-1.5 rounded-full ${dotColor[dot]}`}
        />
      )}
    </button>
  );
}

function EventCard({
  title,
  time,
  color,
  isPast,
  onCreateReminder,
  onEdit,
  onDelete,
}: {
  title: string;
  time: string;
  color: EventCardColor;
  isPast: boolean;
  onCreateReminder: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`flex flex-col gap-4 rounded-2xl border p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center ${
        isPast
          ? "border-slate-200 bg-slate-50 opacity-80"
          : "border-slate-200 bg-white"
      }`}
    >
      <IconBadge color={isPast ? "neutral" : color} icon="calendar" />

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-bold text-slate-900">{title}</h4>

          {isPast && (
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
              Finalizado
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-slate-500">{time}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!isPast && (
          <button
            type="button"
            onClick={onCreateReminder}
            className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
          >
            Adicionar lembrete
          </button>
        )}

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Edit3 size={15} />
          Editar
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <Trash2 size={15} />
          Excluir
        </button>

        {!isPast && (
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              color === "primary"
                ? "bg-indigo-600"
                : color === "success"
                  ? "bg-emerald-500"
                  : "bg-red-500"
            }`}
          />
        )}
      </div>
    </motion.div>
  );
}

function NotificationGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-7 last:mb-0">
      <p className="mb-3 text-sm font-bold text-slate-700">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function IconBadge({
  color,
  icon,
}: {
  color: "primary" | "success" | "danger" | "neutral";
  icon: "calendar" | "check" | "bell";
}) {
  const colorClasses: Record<
    "primary" | "success" | "danger" | "neutral",
    string
  > = {
    primary: "bg-indigo-100 text-indigo-600",
    success: "bg-emerald-100 text-emerald-600",
    danger: "bg-red-100 text-red-600",
    neutral: "bg-slate-100 text-slate-500",
  };

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClasses[color]}`}
    >
      {icon === "calendar" && <CalendarDays size={22} />}
      {icon === "check" && <CheckCircle2 size={22} />}
      {icon === "bell" && <Bell size={22} />}
    </div>
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

function getUserInitials(name: string) {
  const nameParts = name.trim().split(" ");

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
}

function getEventDateTime(event: LifeHubEvent) {
  return new Date(`${event.event_date}T${formatTime(event.start_time)}`);
}

function isPastEvent(event: LifeHubEvent) {
  const eventEndTime = event.end_time
    ? new Date(`${event.event_date}T${formatTime(event.end_time)}`)
    : getEventDateTime(event);

  return eventEndTime.getTime() < new Date().getTime();
}

function sortEventsAscending(firstEvent: LifeHubEvent, secondEvent: LifeHubEvent) {
  return getEventDateTime(firstEvent).getTime() - getEventDateTime(secondEvent).getTime();
}

function sortEventsDescending(firstEvent: LifeHubEvent, secondEvent: LifeHubEvent) {
  return getEventDateTime(secondEvent).getTime() - getEventDateTime(firstEvent).getTime();
}

function formatEventTime(event: LifeHubEvent) {
  const startTime = formatTime(event.start_time);

  if (!event.end_time) {
    return `${formatDate(event.event_date)} às ${startTime}`;
  }

  return `${formatDate(event.event_date)} • ${startTime} - ${formatTime(
    event.end_time
  )}`;
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

function formatDateTime(dateTime: string) {
  const date = new Date(dateTime);

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getEventCardColor(index: number): EventCardColor {
  const colors: EventCardColor[] = ["primary", "success", "danger"];

  return colors[index % colors.length];
}

export default DashboardPage;