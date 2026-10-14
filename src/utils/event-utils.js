export const reminderOptions = [null, 5, 10, 15, 30, 60];

export function formatEventDate(timestamp) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatEventTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatReminder(minutes) {
  return minutes === null ? 'No reminder' : `${minutes} minutes before`;
}

// Tasks store a date only; avoid toISOString(), which can change the day in local time.
export function toLocalDateString(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')].join('-');
}

export function combineLocalDateAndTime(date, time) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
    time.getHours(), time.getMinutes(), 0, 0);
  // Reject a clock time skipped by a daylight-saving change instead of silently moving it.
  if (result.getHours() !== time.getHours() || result.getMinutes() !== time.getMinutes() ||
      result.getDate() !== date.getDate()) {
    throw new Error('That time does not exist on this date due to a clock change. Choose another time.');
  }
  return result.getTime();
}

export function parseCustomReminder(value) {
  const text = value.trim();
  const minutes = Number(text);
  if (!/^\d+$/.test(text) || !Number.isSafeInteger(minutes) || minutes < 1 ||
      !Number.isSafeInteger(minutes * 60000)) {
    throw new Error('Enter reminder minutes as a positive whole number.');
  }
  return minutes;
}

export function validateEvent(event) {
  if (!event.name.trim()) {
    throw new Error('Please enter an event name.');
  }
  if (!Number.isFinite(event.startAt) || !Number.isFinite(event.endAt) ||
      !Number.isFinite(new Date(event.startAt).getTime()) ||
      !Number.isFinite(new Date(event.endAt).getTime())) {
    throw new Error('Please choose a valid date and times.');
  }
  if (event.endAt <= event.startAt) {
    throw new Error('End time must be later than start time.');
  }
  if (toLocalDateString(new Date(event.startAt)) !== toLocalDateString(new Date(event.endAt))) {
    throw new Error('Start and end time must be on the same date.');
  }
  if (event.reminderMinutes !== null) {
    parseCustomReminder(String(event.reminderMinutes));
  }
}

export function reminderTimestamp(event) {
  return event.reminderMinutes === null ? null : event.startAt - event.reminderMinutes * 60000;
}
