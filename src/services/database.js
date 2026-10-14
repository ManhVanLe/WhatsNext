import * as SQLite from 'expo-sqlite';

let databasePromise;

async function openDatabase() {
  // Keep the original filename so existing event data remains available.
  const db = await SQLite.openDatabaseAsync('whatsnext-events.db');
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        startAt INTEGER NOT NULL,
        endAt INTEGER NOT NULL CHECK (endAt > startAt),
        reminderMinutes INTEGER,
        notificationId TEXT,
        CHECK (reminderMinutes IS NULL OR reminderMinutes > 0)
      );
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        importance TEXT NOT NULL CHECK (importance IN ('Low', 'Normal', 'High')),
        deadline TEXT,
        notes TEXT,
        estimatedDuration INTEGER CHECK (estimatedDuration IS NULL OR estimatedDuration > 0),
        timeSpent INTEGER NOT NULL DEFAULT 0 CHECK (timeSpent >= 0),
        completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1))
      );
    `);
    return db;
  } catch (error) {
    await db.closeAsync();
    throw error;
  }
}

export function getDatabase() {
  if (!databasePromise) {
    databasePromise = openDatabase().catch((error) => {
      databasePromise = null;
      throw error;
    });
  }
  return databasePromise;
}
