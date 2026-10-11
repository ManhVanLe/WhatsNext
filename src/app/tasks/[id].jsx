import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton, Screen, ui } from '@/components/app-ui';
import { useTasks } from '@/context/tasks-context';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { tasks } = useTasks();
  // Navigation passes only the ID; the full task stays in shared state.
  const task = tasks.find((item) => item.id === id);
  const [message, setMessage] = useState('');

  // A details route may still be open after a reload has cleared temporary tasks.
  if (!task) {
    return (
      <Screen hasHeader>
        <Text style={ui.heading}>Task not found</Text>
        <Text style={ui.muted}>Tasks are temporary and are cleared when the app reloads.</Text>
        <AppButton label="Back to Tasks" onPress={() => router.dismissTo('/tasks')} />
      </Screen>
    );
  }

  return (
    <Screen hasHeader>
      <Text style={ui.title}>{task.name}</Text>
      <View style={ui.card}>
        <Detail label="Importance" value={task.importance} />
        <Detail label="Deadline" value={task.deadline ?? 'No deadline'} />
        <Detail
          label="Estimated Duration"
          value={task.estimatedDuration ? `${task.estimatedDuration} min` : 'Not specified'}
        />
        <Detail label="Time Invested" value={`${Math.floor(task.timeSpent / 60)}m`} />
        <Detail label="Notes" value={task.notes ?? 'No notes'} />
      </View>
      {/* In progress: these actions show messages and do not change the task yet. */}
      <AppButton
        label="START FOCUS"
        onPress={() => setMessage('The focus timer is coming later.')}
      />
      <AppButton
        label="MARK COMPLETE"
        secondary
        onPress={() => setMessage('Marking tasks complete is coming later.')}
      />
      <AppButton
        label="EDIT"
        secondary
        onPress={() => setMessage('Task editing is coming later.')}
      />
      {message ? (
        <Text accessibilityLiveRegion="polite" style={ui.muted}>
          {message}
        </Text>
      ) : null}
    </Screen>
  );
}

function Detail({ label, value }) {
  return (
    <View style={ui.section}>
      <Text style={ui.label}>{label}</Text>
      <Text style={ui.muted}>{value}</Text>
    </View>
  );
}
