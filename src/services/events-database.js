import { getDatabase } from './database';
import { validateEvent } from '../utils/event-utils';

export async function listEvents() {
  const db = await getDatabase();
  return db.getAllAsync('SELECT * FROM events ORDER BY startAt ASC, id ASC');
}

export async function saveEventRecord(input, id) {
  validateEvent(input);
  const db = await getDatabase();
  const values = [input.name.trim(), input.startAt, input.endAt, input.reminderMinutes];
  if (id !== undefined) {
    const result = await db.runAsync(
      'UPDATE events SET name = ?, startAt = ?, endAt = ?, reminderMinutes = ? WHERE id = ?',
      ...values, id
    );
    if (!result.changes) throw new Error('This event no longer exists.');
    return id;
  }
  const result = await db.runAsync(
    'INSERT INTO events (name, startAt, endAt, reminderMinutes) VALUES (?, ?, ?, ?)',
    ...values
  );
  return result.lastInsertRowId;
}

export async function deleteEventRecord(id) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM events WHERE id = ?', id);
}

export async function setEventNotificationId(id, notificationId) {
  const db = await getDatabase();
  await db.runAsync('UPDATE events SET notificationId = ? WHERE id = ?', notificationId, id);
}
