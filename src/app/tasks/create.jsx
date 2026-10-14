import TaskForm from '@/components/task-form';
import TasksStatus from '@/components/tasks-status';
import { useTasks } from '@/context/tasks-context';

export default function CreateTaskScreen() {
  const { loading, error } = useTasks();
  return loading || error ? <TasksStatus /> : <TaskForm />;
}
