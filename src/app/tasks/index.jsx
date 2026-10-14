import { router } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { AppButton, ui } from '@/components/app-ui';
import TasksStatus from '@/components/tasks-status';
import { useTasks } from '@/context/tasks-context';
import { formatTaskDeadline } from '@/utils/task-deadline';

export default function TasksScreen() {
  const { tasks, loading, error } = useTasks();
  const [showCompleted, setShowCompleted] = useState(false);
  if (loading || error) return <TasksStatus />;
  const visibleTasks = tasks.filter((task) => task.completed === showCompleted);

  return (
    <>
      <Stack.Screen options={{ title: showCompleted ? 'Completed Tasks' : 'Active Tasks' }} />
      <FlatList
        style={ui.screen}
        contentContainerStyle={ui.content}
        contentInsetAdjustmentBehavior="automatic"
        data={visibleTasks}
        keyExtractor={(task) => task.id}
        ListHeaderComponent={
          <View style={ui.section}>
            <AppButton label="+ Add Task" onPress={() => router.push('/tasks/create')} />
            <AppButton
              label={showCompleted ? 'View active tasks' : 'View completed tasks'}
              secondary
              onPress={() => setShowCompleted((current) => !current)}
            />
          </View>
        }
        ListEmptyComponent={<Text style={ui.muted}>{showCompleted ? 'No completed tasks yet' : 'No tasks yet'}</Text>}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View task: ${item.name}`}
            onPress={() => router.push({ pathname: '/tasks/[id]', params: { id: item.id } })}
            style={({ pressed }) => [ui.card, pressed && ui.pressed]}
          >
            <Text style={ui.heading}>{item.name}</Text>
            <View style={ui.section}>
              <Text style={ui.body}>Importance: {item.importance}</Text>
              <Text style={ui.muted}>{item.deadline ? `Deadline: ${formatTaskDeadline(item.deadline)}` : 'No deadline'}</Text>
              <Text style={ui.muted}>Time invested: {Math.floor(item.timeSpent / 60)}m</Text>
            </View>
          </Pressable>
        )}
      />
    </>
  );
}
