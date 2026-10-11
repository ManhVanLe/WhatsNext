import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';

import { AppButton, ui } from '@/components/app-ui';
import { useTasks } from '@/context/tasks-context';

export default function TasksScreen() {
  const { tasks } = useTasks();
  const activeTasks = tasks.filter((task) => !task.completed);

  return (
    <FlatList
      style={ui.screen}
      contentContainerStyle={ui.content}
      contentInsetAdjustmentBehavior="automatic"
      data={activeTasks}
      keyExtractor={(task) => task.id}
      ListHeaderComponent={
        <AppButton label="+ Add Task" onPress={() => router.push('/tasks/create')} />
      }
      ListEmptyComponent={<Text style={ui.muted}>No tasks yet</Text>}
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
            <Text style={ui.muted}>{item.deadline ? `Deadline: ${item.deadline}` : 'No deadline'}</Text>
            <Text style={ui.muted}>Time invested: {Math.floor(item.timeSpent / 60)}m</Text>
          </View>
        </Pressable>
      )}
    />
  );
}
