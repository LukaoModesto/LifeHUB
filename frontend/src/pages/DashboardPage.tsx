import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import EventFormModal from "../components/dashboard/EventFormModal";
import DeleteEventModal from "../components/dashboard/DeleteEventModal";
import CreateReminderModal from "../components/dashboard/CreateReminderModal";
import NotificationPanel from "../components/dashboard/NotificationPanel";
import SummaryPanel from "../components/dashboard/SummaryPanel";
import CalendarSection from "../components/dashboard/CalendarSection";

import {
  formatTime,
  isPastEvent,
  sortEventsAscending,
  sortEventsDescending,
} from "../utils/eventDateUtils";

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
import {
  createEventReminder,
  getEventReminders,
} from "../services/reminderService";
import {
  getDueReminders,
  markReminderAsSent,
  type DueReminder,
} from "../services/dueReminderService";
import {
  playNotificationSound,
  unlockNotificationSound,
} from "../services/notificationSoundService";

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
  const [eventReminderCounts, setEventReminderCounts] = useState<
    Record<number, number>
  >({});

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
  const [selectedReminderValues, setSelectedReminderValues] = useState<
    number[]
  >([]);
  const [customReminderMinutesBefore, setCustomReminderMinutesBefore] =
    useState("");
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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadDueReminders();
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    function handleFirstUserInteraction() {
      unlockNotificationSound().catch(() => {
        console.warn("Não foi possível liberar o som das notificações.");
      });

      window.removeEventListener("pointerdown", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
    }

    window.addEventListener("pointerdown", handleFirstUserInteraction);
    window.addEventListener("keydown", handleFirstUserInteraction);

    return () => {
      window.removeEventListener("pointerdown", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
    };
  }, []);

  async function loadEvents() {
    setIsEventsLoading(true);
    setEventsErrorMessage("");

    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
      await loadEventReminderCounts(eventsData);
    } catch {
      setEventsErrorMessage("Não foi possível carregar seus eventos.");
    } finally {
      setIsEventsLoading(false);
    }
  }

  async function loadEventReminderCounts(eventsData: LifeHubEvent[]) {
    const futureEvents = eventsData.filter((event) => !isPastEvent(event));

    if (futureEvents.length === 0) {
      setEventReminderCounts({});
      return;
    }

    const results = await Promise.allSettled(
      futureEvents.map(async (event) => {
        const reminders = await getEventReminders(event.id);

        return {
          eventId: event.id,
          reminderCount: reminders.length,
        };
      })
    );

    const reminderCounts: Record<number, number> = {};

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        reminderCounts[result.value.eventId] = result.value.reminderCount;
      }
    });

    setEventReminderCounts(reminderCounts);
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
        try {
          playNotificationSound(reminder.sound_type);
          playedReminderIdsRef.current.add(reminder.reminder_id);
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

      await loadEventReminderCounts([...events, createdEvent]);
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

    const reminderValues = buildReminderValues();

    if (reminderValues.length === 0) {
      setCreateReminderErrorMessage(
        "Selecione pelo menos um lembrete ou informe um valor personalizado."
      );
      return;
    }

    setIsCreatingReminder(true);

    try {
      const results = await Promise.allSettled(
        reminderValues.map((minutesBefore) =>
          createEventReminder(selectedEventForReminder.id, {
            minutes_before: minutesBefore,
          })
        )
      );

      const createdCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;

      const failedCount = results.length - createdCount;

      if (createdCount === 0) {
        setCreateReminderErrorMessage(
          "Não foi possível criar os lembretes. Verifique se eles já existem para este evento."
        );
        return;
      }

      if (failedCount > 0) {
        setCreateReminderSuccessMessage(
          `${createdCount} lembrete(s) criado(s). ${failedCount} já existia(m) ou não pôde/puderam ser criado(s).`
        );
      } else {
        setCreateReminderSuccessMessage(
          `${createdCount} lembrete(s) criado(s) com sucesso.`
        );
      }

      setSelectedReminderValues([]);
      setCustomReminderMinutesBefore("");

      await loadEventReminderCounts(events);

      setTimeout(() => {
        setSelectedEventForReminder(null);
        setCreateReminderSuccessMessage("");
        loadDueReminders();
      }, 900);
    } catch {
      setCreateReminderErrorMessage("Não foi possível criar os lembretes.");
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

      const updatedEvents = events.map((currentEvent) =>
        currentEvent.id === updatedEvent.id ? updatedEvent : currentEvent
      );

      setEvents(updatedEvents);

      closeEditEventModal();
      loadDueReminders();
      await loadEventReminderCounts(updatedEvents);
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

      const updatedEvents = events.filter(
        (currentEvent) => currentEvent.id !== selectedEventForDelete.id
      );

      setEvents(updatedEvents);

      setDueReminders((currentReminders) =>
        currentReminders.filter(
          (reminder) => reminder.event_id !== selectedEventForDelete.id
        )
      );

      setSelectedEventForDelete(null);
      await loadEventReminderCounts(updatedEvents);
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
    setSelectedReminderValues([1440, 720, 360, 60, 15]);
    setCustomReminderMinutesBefore("");
    setCreateReminderErrorMessage("");
    setCreateReminderSuccessMessage("");
  }

  function closeReminderModal() {
    setSelectedEventForReminder(null);
    setSelectedReminderValues([]);
    setCustomReminderMinutesBefore("");
    setCreateReminderErrorMessage("");
    setCreateReminderSuccessMessage("");
  }

  function handleToggleReminderPreset(value: number) {
    setSelectedReminderValues((currentValues) => {
      if (currentValues.includes(value)) {
        return currentValues.filter((currentValue) => currentValue !== value);
      }

      return [...currentValues, value].sort((firstValue, secondValue) => {
        return secondValue - firstValue;
      });
    });
  }

  function buildReminderValues() {
    const reminderValues = [...selectedReminderValues];

    if (customReminderMinutesBefore) {
      const customValue = Number(customReminderMinutesBefore);

      if (!Number.isInteger(customValue) || customValue <= 0) {
        setCreateReminderErrorMessage(
          "Informe uma quantidade personalizada válida de minutos."
        );
        return [];
      }

      if (customValue > 43200) {
        setCreateReminderErrorMessage(
          "O lembrete personalizado não pode ultrapassar 30 dias antes do evento."
        );
        return [];
      }

      reminderValues.push(customValue);
    }

    return Array.from(new Set(reminderValues)).sort(
      (firstValue, secondValue) => secondValue - firstValue
    );
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
        <Sidebar onCreateEvent={() => setIsCreateEventModalOpen(true)} />

        <section className="flex-1">
          <Topbar
            userName={userName}
            userEmail={userEmail}
            userInitials={userInitials}
            isUserLoading={isUserLoading}
            dueRemindersCount={dueReminders.length}
            onCreateEvent={() => setIsCreateEventModalOpen(true)}
            onLogout={handleLogout}
          />

          <div className="grid gap-6 p-5 lg:p-8 2xl:grid-cols-[1fr_420px]">
            <CalendarSection
              calendarDays={calendarDays}
              upcomingEvents={upcomingEvents}
              pastEvents={pastEvents}
              eventReminderCounts={eventReminderCounts}
              isEventsLoading={isEventsLoading}
              eventsErrorMessage={eventsErrorMessage}
              onCreateReminder={openReminderModal}
              onEditEvent={openEditEventModal}
              onDeleteEvent={openDeleteEventModal}
            />

            <aside className="space-y-6">
              <NotificationPanel
                reminders={dueReminders}
                isLoading={isDueRemindersLoading}
                errorMessage={dueRemindersErrorMessage}
                onRefresh={loadDueReminders}
                onMarkAsSeen={handleMarkReminderAsSent}
              />

              <SummaryPanel
                upcomingEventsCount={upcomingEvents.length}
                pastEventsCount={pastEvents.length}
                alertRemindersCount={alertRemindersCount}
              />
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
          selectedReminderValues={selectedReminderValues}
          customMinutesBefore={customReminderMinutesBefore}
          errorMessage={createReminderErrorMessage}
          successMessage={createReminderSuccessMessage}
          isLoading={isCreatingReminder}
          onTogglePreset={handleToggleReminderPreset}
          onCustomMinutesBeforeChange={setCustomReminderMinutesBefore}
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

function getUserInitials(name: string) {
  const nameParts = name.trim().split(" ");

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
}

export default DashboardPage;