import { combineLocalDateAndTime, toLocalDateString } from './event-utils';
import { isValidDeadline } from './task-validation';

// Preserve date-only values. Timed deadlines include a timezone and are stored in UTC.
export function normalizeTaskDeadline(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'string' && isValidDeadline(value)) return value;
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();
  if (typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d(:[0-5]\d(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.test(value) &&
      isValidDeadline(value.slice(0, 10)) && Number.isFinite(Date.parse(value))) {
    return new Date(value).toISOString();
  }
  throw new Error('Please choose a valid deadline date and time.');
}

export function taskDeadlineToDate(value) {
  const deadline = normalizeTaskDeadline(value);
  if (!deadline) return null;
  if (isValidDeadline(deadline)) {
    const [year, month, day] = deadline.split('-').map(Number);
    const date = new Date();
    date.setFullYear(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  return new Date(deadline);
}

export function taskDeadlineFromPicker(date, time) {
  if (!date) return undefined;
  if (!time) return toLocalDateString(date);
  return new Date(combineLocalDateAndTime(date, time)).toISOString();
}

export function formatTaskDeadline(value) {
  if (!value) return 'No deadline';
  if (isValidDeadline(value)) return value;
  return taskDeadlineToDate(value).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
