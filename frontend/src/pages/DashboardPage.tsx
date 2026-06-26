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
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  showBrowserNotification,
  type BrowserNotificationPermission,
} from "../services/browserNotificationService";

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
  deleteEventReminder,
  getEventReminders,
  type EventReminder,
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

type ActiveMenuItem = "dashboard" | "calendar" | "reminders";

type EventFormValidationData = {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  preventPastStart: boolean;
};

const defaultReminderValues = [1440, 720, 360, 60, 15];

const MAX_EVENT_TITLE_LENGTH = 80;
const MAX_EVENT_DESCRIPTION_LENGTH = 300;

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
  const [
    existingRemindersForSelectedEvent,
    setExistingRemindersForSelectedEvent,
  ] = useState<EventReminder[]>([]);
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
  const [isLoadingReminderSettings, setIsLoadingReminderSettings] =
    useState(false);

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] =
    useState<ActiveMenuItem>("dashboard");

  const [browserNotificationPermission, setBrowserNotificationPermission] =
    useState<BrowserNotificationPermission>(() =>
      getBrowserNotificationPermission()
    );

  const [searchQuery, setSearchQuery] = useState("");

  const playedReminderIdsRef = useRef<Set<number>>(new Set());

  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const remindersRef = useRef<HTMLDivElement | null>(null);

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
        } catch {
          console.warn("O navegador bloqueou o som da notificação.");
        }

        showBrowserNotification({
          title: "Lembrete do LifeHUB",
          body: `${reminder.event_title} está chegando.`,
          tag: `lifehub-reminder-${reminder.reminder_id}`,
        });

        playedReminderIdsRef.current.add(reminder.reminder_id);
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

    const validationError = validateEventForm({
      title: newEventTitle,
      description: newEventDescription,
      eventDate: newEventDate,
      startTime: newEventStartTime,
      endTime: newEventEndTime,
      preventPastStart: true,
    });

    if (validationError) {
      setCreateEventErrorMessage(validationError);
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
      const updatedEvents = [...events, createdEvent];

      setEvents(updatedEvents);

      setNewEventTitle("");
      setNewEventDescription("");
      setNewEventDate("");
      setNewEventStartTime("");
      setNewEventEndTime("");
      setIsCreateEventModalOpen(false);

      await loadEventReminderCounts(updatedEvents);
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

    if (!reminderValues) {
      return;
    }

    const existingReminderValues = existingRemindersForSelectedEvent.map(
      (reminder) => reminder.minutes_before
    );

    const valuesToCreate = reminderValues.filter(
      (value) => !existingReminderValues.includes(value)
    );

    const remindersToDelete = existingRemindersForSelectedEvent.filter(
      (reminder) => !reminderValues.includes(reminder.minutes_before)
    );

    if (valuesToCreate.length === 0 && remindersToDelete.length === 0) {
      setCreateReminderSuccessMessage("Lembretes já estão atualizados.");
      return;
    }

    setIsCreatingReminder(true);

    try {
      const createOperations = valuesToCreate.map((minutesBefore) =>
        createEventReminder(selectedEventForReminder.id, {
          minutes_before: minutesBefore,
        })
      );

      const deleteOperations = remindersToDelete.map((reminder) =>
        deleteEventReminder(selectedEventForReminder.id, reminder.id)
      );

      const results = await Promise.allSettled([
        ...createOperations,
        ...deleteOperations,
      ]);

      const successfulOperationsCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;

      if (successfulOperationsCount === 0) {
        setCreateReminderErrorMessage(
          "Não foi possível atualizar os lembretes."
        );
        return;
      }

      const updatedReminders = await getEventReminders(
        selectedEventForReminder.id
      );

      setExistingRemindersForSelectedEvent(updatedReminders);
      setSelectedReminderValues(
        updatedReminders
          .map((reminder) => reminder.minutes_before)
          .sort((firstValue, secondValue) => secondValue - firstValue)
      );
      setCustomReminderMinutesBefore("");

      await loadEventReminderCounts(events);

      setCreateReminderSuccessMessage("Lembretes atualizados com sucesso.");

      setTimeout(() => {
        setSelectedEventForReminder(null);
        setCreateReminderSuccessMessage("");
        loadDueReminders();
      }, 900);
    } catch {
      setCreateReminderErrorMessage("Não foi possível atualizar os lembretes.");
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

    const validationError = validateEventForm({
      title: editEventTitle,
      description: editEventDescription,
      eventDate: editEventDate,
      startTime: editEventStartTime,
      endTime: editEventEndTime,
      preventPastStart: !isPastEvent(selectedEventForEdit),
    });

    if (validationError) {
      setEditEventErrorMessage(validationError);
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

  async function openReminderModal(event: LifeHubEvent) {
    const disabledReminderValues = getDisabledReminderValuesForEvent(event);

    setSelectedEventForReminder(event);
    setSelectedReminderValues([]);
    setCustomReminderMinutesBefore("");
    setCreateReminderErrorMessage("");
    setCreateReminderSuccessMessage("");
    setExistingRemindersForSelectedEvent([]);
    setIsLoadingReminderSettings(true);

    try {
      const reminders = await getEventReminders(event.id);

      setExistingRemindersForSelectedEvent(reminders);

      if (reminders.length > 0) {
        setSelectedReminderValues(
          reminders
            .map((reminder) => reminder.minutes_before)
            .filter(
              (minutesBefore) => !disabledReminderValues.includes(minutesBefore)
            )
            .sort((firstValue, secondValue) => secondValue - firstValue)
        );
      } else {
        setSelectedReminderValues(getValidDefaultReminderValuesForEvent(event));
      }
    } catch {
      setCreateReminderErrorMessage(
        "Não foi possível carregar os lembretes deste evento."
      );
    } finally {
      setIsLoadingReminderSettings(false);
    }
  }

  function closeReminderModal() {
    setSelectedEventForReminder(null);
    setExistingRemindersForSelectedEvent([]);
    setSelectedReminderValues([]);
    setCustomReminderMinutesBefore("");
    setCreateReminderErrorMessage("");
    setCreateReminderSuccessMessage("");
    setIsLoadingReminderSettings(false);
  }

  function handleToggleReminderPreset(value: number) {
    if (!selectedEventForReminder) {
      return;
    }

    const disabledReminderValues =
      getDisabledReminderValuesForEvent(selectedEventForReminder);

    if (disabledReminderValues.includes(value)) {
      return;
    }

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
        return null;
      }

      if (customValue > 43200) {
        setCreateReminderErrorMessage(
          "O lembrete personalizado não pode ultrapassar 30 dias antes do evento."
        );
        return null;
      }

      reminderValues.push(customValue);
    }

    const uniqueReminderValues = Array.from(new Set(reminderValues)).sort(
      (firstValue, secondValue) => secondValue - firstValue
    );

    if (uniqueReminderValues.length === 0) {
      setCreateReminderErrorMessage(
        "Selecione pelo menos um lembrete ou informe um valor personalizado."
      );
      return null;
    }

    if (!selectedEventForReminder) {
      return uniqueReminderValues;
    }

    const reminderValidationError = validateReminderTimes(
      selectedEventForReminder,
      uniqueReminderValues
    );

    if (reminderValidationError) {
      setCreateReminderErrorMessage(reminderValidationError);
      return null;
    }

    return uniqueReminderValues;
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

  function openCreateEventModal(eventDate = "") {
    setNewEventTitle("");
    setNewEventDescription("");
    setNewEventDate(eventDate);
    setNewEventStartTime("");
    setNewEventEndTime("");
    setCreateEventErrorMessage("");
    setIsCreateEventModalOpen(true);
  }

  function closeCreateEventModal() {
    setIsCreateEventModalOpen(false);
    setNewEventTitle("");
    setNewEventDescription("");
    setNewEventDate("");
    setNewEventStartTime("");
    setNewEventEndTime("");
    setCreateEventErrorMessage("");
  }

  function openSidebar() {
    setIsSidebarOpen(true);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  function scrollToDashboard() {
    setActiveMenuItem("dashboard");
    closeSidebar();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function scrollToCalendar() {
    setActiveMenuItem("calendar");
    closeSidebar();

    calendarRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function scrollToReminders() {
    setActiveMenuItem("reminders");
    closeSidebar();

    remindersRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleRequestBrowserNotificationPermission() {
    const permission = await requestBrowserNotificationPermission();

    setBrowserNotificationPermission(permission);
  }

  const userName = user?.name ?? "Usuário";
  const userEmail = user?.email ?? "Conta LifeHUB";
  const userInitials = getUserInitials(userName);

  const searchedEvents = filterEventsBySearch(events, searchQuery);

  const upcomingEvents = searchedEvents
    .filter((event) => !isPastEvent(event))
    .sort(sortEventsAscending);

  const pastEvents = searchedEvents
    .filter((event) => isPastEvent(event))
    .sort(sortEventsDescending);

  const alertRemindersCount = dueReminders.filter(
    (reminder) => reminder.notification_level === "alert"
  ).length;

  return (
    <main
      ref={dashboardRef}
      className="min-h-screen bg-[#f8fafc] text-slate-900"
    >
      <div className="flex min-h-screen">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          activeMenuItem={activeMenuItem}
          onCloseSidebar={closeSidebar}
          onGoToDashboard={scrollToDashboard}
          onGoToCalendar={scrollToCalendar}
          onGoToReminders={scrollToReminders}
          onCreateEvent={() => {
            closeSidebar();
            openCreateEventModal();
          }}
        />

        <section className="flex-1">
          <Topbar
            userName={userName}
            userEmail={userEmail}
            userInitials={userInitials}
            isUserLoading={isUserLoading}
            dueRemindersCount={dueReminders.length}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onOpenSidebar={openSidebar}
            onOpenNotifications={scrollToReminders}
            onCreateEvent={() => openCreateEventModal()}
            onLogout={handleLogout}
          />

          <div className="grid gap-6 p-5 lg:p-8 2xl:grid-cols-[1fr_420px]">
            <div ref={calendarRef} className="scroll-mt-24">
              <CalendarSection
                upcomingEvents={upcomingEvents}
                pastEvents={pastEvents}
                eventReminderCounts={eventReminderCounts}
                isEventsLoading={isEventsLoading}
                eventsErrorMessage={eventsErrorMessage}
                onCreateEventForDate={openCreateEventModal}
                onCreateReminder={openReminderModal}
                onEditEvent={openEditEventModal}
                onDeleteEvent={openDeleteEventModal}
              />
            </div>

            <aside className="space-y-6">
              <div ref={remindersRef} className="scroll-mt-24">
                <NotificationPanel
                  reminders={dueReminders}
                  isLoading={isDueRemindersLoading}
                  errorMessage={dueRemindersErrorMessage}
                  browserNotificationPermission={browserNotificationPermission}
                  onRequestBrowserNotificationPermission={
                    handleRequestBrowserNotificationPermission
                  }
                  onRefresh={loadDueReminders}
                  onMarkAsSeen={handleMarkReminderAsSent}
                />
              </div>

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
          onClose={closeCreateEventModal}
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
          disabledReminderValues={getDisabledReminderValuesForEvent(
            selectedEventForReminder
          )}
          customMinutesBefore={customReminderMinutesBefore}
          errorMessage={createReminderErrorMessage}
          successMessage={createReminderSuccessMessage}
          isLoading={isCreatingReminder || isLoadingReminderSettings}
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

  return `${nameParts[0][0]}${nameParts[
    nameParts.length - 1
  ][0]}`.toUpperCase();
}

function filterEventsBySearch(events: LifeHubEvent[], searchQuery: string) {
  const normalizedSearchQuery = normalizeSearchText(searchQuery);

  if (!normalizedSearchQuery) {
    return events;
  }

  return events.filter((event) => {
    const searchableText = normalizeSearchText(
      [
        event.title,
        event.description,
        event.event_date,
        formatDateForSearch(event.event_date),
        event.start_time,
        event.end_time,
      ]
        .filter(Boolean)
        .join(" ")
    );

    return searchableText.includes(normalizedSearchQuery);
  });
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatDateForSearch(date: string) {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

function validateEventForm({
  title,
  description,
  eventDate,
  startTime,
  endTime,
  preventPastStart,
}: EventFormValidationData) {
  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (!trimmedTitle) {
    return "O título do evento é obrigatório.";
  }

  if (trimmedTitle.length > MAX_EVENT_TITLE_LENGTH) {
    return `O título não pode passar de ${MAX_EVENT_TITLE_LENGTH} caracteres.`;
  }

  if (trimmedDescription.length > MAX_EVENT_DESCRIPTION_LENGTH) {
    return `A descrição não pode passar de ${MAX_EVENT_DESCRIPTION_LENGTH} caracteres.`;
  }

  if (!eventDate) {
    return "A data do evento é obrigatória.";
  }

  if (!isValidDateInput(eventDate)) {
    return "Informe uma data válida para o evento.";
  }

  if (!startTime) {
    return "O horário de início é obrigatório.";
  }

  if (!isValidTimeInput(startTime)) {
    return "Informe um horário de início válido.";
  }

  if (endTime && !isValidTimeInput(endTime)) {
    return "Informe um horário de término válido.";
  }

  if (endTime && endTime <= startTime) {
    return "O horário de término deve ser maior que o horário de início.";
  }

  if (preventPastStart) {
    const eventStartDateTime = buildEventDateTime(eventDate, startTime);
    const oneMinuteAgo = Date.now() - 60000;

    if (eventStartDateTime.getTime() < oneMinuteAgo) {
      return "Não é possível criar ou mover um evento para um horário que já passou.";
    }
  }

  return "";
}

function validateReminderTimes(
  event: LifeHubEvent,
  reminderValues: number[]
) {
  const eventStartDateTime = buildEventDateTime(
    event.event_date,
    formatTime(event.start_time)
  );

  if (eventStartDateTime.getTime() <= Date.now()) {
    return "Não é possível criar lembretes para um evento que já começou.";
  }

  const minutesUntilEvent = Math.floor(
    (eventStartDateTime.getTime() - Date.now()) / 60000
  );

  const invalidReminderValue = reminderValues.find((reminderValue) => {
    return reminderValue >= minutesUntilEvent;
  });

  if (invalidReminderValue) {
    return `O lembrete de ${formatReminderValue(
      invalidReminderValue
    )} já passou para este evento. Escolha um intervalo menor.`;
  }

  return "";
}

function getDisabledReminderValuesForEvent(event: LifeHubEvent) {
  const eventStartDateTime = buildEventDateTime(
    event.event_date,
    formatTime(event.start_time)
  );

  const minutesUntilEvent = Math.floor(
    (eventStartDateTime.getTime() - Date.now()) / 60000
  );

  return defaultReminderValues.filter((reminderValue) => {
    return reminderValue >= minutesUntilEvent;
  });
}

function getValidDefaultReminderValuesForEvent(event: LifeHubEvent) {
  const disabledReminderValues = getDisabledReminderValuesForEvent(event);

  return defaultReminderValues.filter((reminderValue) => {
    return !disabledReminderValues.includes(reminderValue);
  });
}

function isValidDateInput(date: string) {
  const parsedDate = new Date(`${date}T00:00`);

  return !Number.isNaN(parsedDate.getTime());
}

function isValidTimeInput(time: string) {
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

  return timeRegex.test(time);
}

function buildEventDateTime(date: string, time: string) {
  return new Date(`${date}T${formatTime(time)}`);
}

function formatReminderValue(minutesBefore: number) {
  if (minutesBefore % 1440 === 0) {
    const days = minutesBefore / 1440;

    return `${days} ${days === 1 ? "dia" : "dias"} antes`;
  }

  if (minutesBefore % 60 === 0) {
    const hours = minutesBefore / 60;

    return `${hours} ${hours === 1 ? "hora" : "horas"} antes`;
  }

  return `${minutesBefore} minutos antes`;
}

export default DashboardPage;