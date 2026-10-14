import { getDatabase } from './database';
import { normalizeTaskDeadline } from '../utils/task-deadline';
import { isValidDuration } from '../utils/task-validation';

function taskFromRow(row) {
  return {
    ...row,
    id: String(row.id),
    completed: row.completed === 1,
    deadline: row.deadline ?? undefined,
    notes: row.notes ?? undefined,
    estimatedDuration: row.estimatedDuration ?? undefined,
  };
}

// Only these known column names can enter SQL. All user values use bound parameters.
function validatedChanges(input) {
  const changes = {};
  for (const field of ['name', 'importance', 'deadline', 'notes', 'estimatedDuration', 'timeSpent', 'completed']) {
    if (!Object.hasOwn(input, field)) continue;
    const value = input[field];
    switch (field) {
      case 'name':
        if (typeof value !== 'string' || !value.trim()) throw new Error('Please enter a task name.');
        changes.name = value.trim();
        break;
      case 'importance':
        if (!['Low', 'Normal', 'High'].includes(value)) throw new Error('Please choose a valid importance.');
        changes.importance = value;
        break;
      case 'deadline':
        changes.deadline = normalizeTaskDeadline(value) ?? null;
        break;
      case 'notes':
        if (value != null && typeof value !== 'string') throw new Error('Notes must be text.');
        changes.notes = value?.trim() || null;
        break;
      case 'estimatedDuration':
        if (value != null && (typeof value !== 'number' || !isValidDuration(String(value)))) {
          throw new Error('Estimated duration must be a positive whole number of minutes.');
        }
        changes.estimatedDuration = value ?? null;
        break;
      case 'timeSpent':
        if (!Number.isSafeInteger(value) || value < 0) throw new Error('Time invested must be non-negative seconds.');
        changes.timeSpent = value;
        break;
      case 'completed':
        if (typeof value !== 'boolean') throw new Error('Completion status must be true or false.');
        changes.completed = value ? 1 : 0;
        break;
    }
  }
  return changes;
}

export async function listTasks() {
  const db = await getDatabase();
  const rows = await db.getAllAsync('SELECT * FROM tasks ORDER BY id ASC');
  return rows.map(taskFromRow);
}

export async function addTaskRecord(input) {
  const task = validatedChanges({ ...input, name: input.name,
    importance: input.importance ?? 'Normal', timeSpent: 0, completed: false });
  const db = await getDatabase();
  // RETURNING gets the saved row in the same statement, avoiding a second read after commit.
  const row = await db.getFirstAsync(
    `INSERT INTO tasks (name, importance, deadline, notes, estimatedDuration, timeSpent, completed)
     VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    task.name, task.importance, task.deadline ?? null, task.notes ?? null,
    task.estimatedDuration ?? null, task.timeSpent, task.completed
  );
  return taskFromRow(row);
}

export async function updateTaskRecord(id, input) {
  const changes = validatedChanges(input);
  const columns = Object.keys(changes);
  const db = await getDatabase();
  const row = columns.length
    ? await db.getFirstAsync(
      `UPDATE tasks SET ${columns.map((column) => `${column} = ?`).join(', ')} WHERE id = ? RETURNING *`,
      ...Object.values(changes), id
    )
    : await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?', id);
  if (!row) throw new Error('This task no longer exists.');
  return taskFromRow(row);
}

export async function deleteTaskRecord(id) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
}
