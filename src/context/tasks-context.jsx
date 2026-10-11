import { createContext, useContext, useRef, useState } from 'react';

const TasksContext = createContext(undefined);

export function TasksProvider({ children }) {
  // Temporary task state for the prototype; reloading clears it until local storage is added.
  const [tasks, setTasks] = useState([]);
  // The counter survives renders, but IDs are unique only within this app session.
  const nextId = useRef(1);

  function addTask(input) {
    // Optional deadline is YYYY-MM-DD; estimatedDuration is minutes; timeSpent is seconds.
    const task = {
      ...input,
      id: String(nextId.current++),
      timeSpent: 0,
      completed: false,
    };
    // Use the latest task array and create a new one so React updates the screens.
    setTasks((currentTasks) => [...currentTasks, task]);
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used inside TasksProvider');
  }
  return context;
}
