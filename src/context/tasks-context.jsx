import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { addTaskRecord, deleteTaskRecord, listTasks, updateTaskRecord } from '../services/tasks-database';

const TasksContext = createContext(undefined);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loaded = useRef(false);
  const pending = useRef(Promise.resolve());

  // Keep startup reads, refreshes and writes in order so a stale read cannot replace new data.
  const enqueue = useCallback((operation) => {
    const result = pending.current.then(operation);
    pending.current = result.catch(() => {});
    return result;
  }, []);

  const reload = useCallback(() => enqueue(async () => {
    try {
      const savedTasks = await listTasks();
      setTasks(savedTasks);
      loaded.current = true;
      setError('');
    } catch {
      setError('Could not load saved tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }), [enqueue]);

  useEffect(() => {
    reload();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') reload();
    });
    return () => subscription.remove();
  }, [reload]);

  function requireLoadedTasks() {
    if (!loaded.current) throw new Error('Tasks are still loading. Please try again.');
  }

  function addTask(input) {
    return enqueue(async () => {
      requireLoadedTasks();
      const task = await addTaskRecord(input);
      // Update shared state only after SQLite confirms the write.
      setTasks((currentTasks) => [...currentTasks, task]);
      return task;
    });
  }

  function updateTask(id, changes) {
    return enqueue(async () => {
      requireLoadedTasks();
      const task = await updateTaskRecord(id, changes);
      setTasks((currentTasks) => currentTasks.map((current) => current.id === task.id ? task : current));
      return task;
    });
  }

  function setTaskCompleted(id, completed) {
    return updateTask(id, { completed });
  }

  function deleteTask(id) {
    return enqueue(async () => {
      requireLoadedTasks();
      await deleteTaskRecord(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== String(id)));
    });
  }

  return (
    <TasksContext.Provider value={{ tasks, loading, error, reload, addTask, updateTask, setTaskCompleted, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used inside TasksProvider');
  return context;
}
