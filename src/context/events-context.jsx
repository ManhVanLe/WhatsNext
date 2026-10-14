import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { deleteEventRecord, listEvents, saveEventRecord, setEventNotificationId } from '../services/events-database';
import { syncEventReminders } from '../services/event-reminders';
import { reminderTimestamp } from '../utils/event-utils';

const EventsContext = createContext(undefined);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const busy = useRef(false);

  const refresh = useCallback(async (requestPermission = false) => {
    const records = await listEvents();
    let reminderWarning = '';
    try {
      const result = await syncEventReminders(records, requestPermission);
      reminderWarning = result.warning;
      for (const event of records) {
        const identifier = result.notificationIds.get(event.id) ?? null;
        if (event.notificationId !== identifier) {
          await setEventNotificationId(event.id, identifier);
          event.notificationId = identifier;
        }
      }
    } catch {
      reminderWarning = 'Reminder updates could not be confirmed. A previous reminder may still arrive. Reopen Events to retry.';
    }
    setEvents(records);
    setWarning(reminderWarning);
    setError('');
    return reminderWarning;
  }, []);

  const reload = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      await refresh();
    } catch {
      setError('Could not load saved events. Please try again.');
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, [refresh]);

  useEffect(() => {
    // State updates follow asynchronous SQLite reads, not a synchronous render calculation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') reload();
    });
    return () => subscription.remove();
  }, [reload]);

  async function saveEvent(input, id) {
    if (busy.current) throw new Error('Events are updating. Please try again in a moment.');
    busy.current = true;
    try {
      const savedId = await saveEventRecord(input, id);
      // Saving is complete even if a permission prompt or notification operation fails.
      let reminderWarning;
      try {
        reminderWarning = await refresh(reminderTimestamp(input) > Date.now());
      } catch {
        setError('Your event was saved, but the list could not refresh. Please try again.');
        reminderWarning = 'Your event was saved, but reminders could not be checked. Reopen Events to retry.';
      }
      if (input.reminderMinutes !== null && reminderTimestamp(input) <= Date.now()) {
        reminderWarning = ['The reminder time has already passed. This event was saved without a new reminder.', reminderWarning].filter(Boolean).join('\n\n');
      }
      return { id: savedId, warning: reminderWarning };
    } finally {
      busy.current = false;
    }
  }

  async function deleteEvent(id) {
    if (busy.current) throw new Error('Events are updating. Please try again in a moment.');
    busy.current = true;
    try {
      await deleteEventRecord(id);
      // Reconciliation cancels notifications whose event record no longer exists.
      setEvents((current) => current.filter((event) => event.id !== id));
      try {
        return await refresh();
      } catch {
        setError('The event was deleted, but the list could not refresh. Please try again.');
        return 'The event was deleted, but its reminder could not be checked and may still arrive. Reopen Events to retry.';
      }
    } finally {
      busy.current = false;
    }
  }

  return (
    <EventsContext.Provider value={{ events, loading, error, warning, reload, saveEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) throw new Error('useEvents must be used inside EventsProvider');
  return context;
}
