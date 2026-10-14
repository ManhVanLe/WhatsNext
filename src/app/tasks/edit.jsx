import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import { AppButton, Screen, ui } from '@/components/app-ui';
import TaskForm from '@/components/task-form';
import TasksStatus from '@/components/tasks-status';
import { useTasks } from '@/context/tasks-context';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams();
  const { tasks, loading, error } = useTasks();
  if (loading || error) return <TasksStatus />;
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return (
      <Screen hasHeader>
        <Text style={ui.heading}>Task not found</Text>
        <AppButton label="Back to Tasks" onPress={() => router.dismissTo('/tasks')} />
      </Screen>
    );
  }
  return <TaskForm key={task.id} task={task} />;
}
