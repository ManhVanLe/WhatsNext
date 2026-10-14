import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { AppButton, Screen, ui } from '@/components/app-ui';
import TasksStatus from '@/components/tasks-status';
import { useTasks } from '@/context/tasks-context';
import { formatTaskDeadline } from '@/utils/task-deadline';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { tasks, loading, error, setTaskCompleted, deleteTask } = useTasks();
  const task = tasks.find((item) => item.id === id);
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const actionStarted = useRef(false);

  // Wait for SQLite before deciding whether a task link refers to a missing task.
  if (loading || error) return <TasksStatus />;
  if (!task) {
    return (
      <Screen hasHeader>
        <Text style={ui.heading}>{busy ? 'Deleting task...' : 'Task not found'}</Text>
        {!busy && <Text style={ui.muted}>This task may have been deleted.</Text>}
        <AppButton label="Back to Tasks" onPress={() => router.dismissTo('/tasks')} />
      </Screen>
    );
  }

  async function changeCompletion() {
    if (actionStarted.current) return;
    actionStarted.current = true;
    setBusy(true);
    setActionError('');
    try {
      await setTaskCompleted(task.id, !task.completed);
    } catch {
      setActionError('Could not update this task. Please try again.');
    } finally {
      actionStarted.current = false;
      setBusy(false);
    }
  }

  function confirmDelete() {
    Alert.alert('Delete task?', `Delete "${task.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        if (actionStarted.current) return;
        actionStarted.current = true;
        setBusy(true);
        setActionError('');
        try {
          await deleteTask(task.id);
          router.dismissTo('/tasks');
        } catch {
          setActionError('Could not delete this task. Please try again.');
        } finally {
          actionStarted.current = false;
          setBusy(false);
        }
      } },
    ]);
  }

  return (
    <Screen hasHeader>
      <Text style={ui.title}>{task.name}</Text>
      <View style={ui.card}>
        <Detail label="Importance" value={task.importance} />
        <Detail label="Deadline" value={formatTaskDeadline(task.deadline)} />
        <Detail label="Estimated Duration" value={task.estimatedDuration ? `${task.estimatedDuration} min` : 'Not specified'} />
        <Detail label="Time Invested" value={`${Math.floor(task.timeSpent / 60)}m`} />
        <Detail label="Notes" value={task.notes ?? 'No notes'} />
        <Detail label="Status" value={task.completed ? 'Completed' : 'Active'} />
      </View>
      {/* In progress: the focus timer still shows a placeholder message. */}
      <AppButton label="START FOCUS" disabled={busy}
        onPress={() => setMessage('The focus timer is coming later.')} />
      <AppButton label={task.completed ? 'MARK INCOMPLETE' : 'MARK COMPLETE'} secondary
        disabled={busy} onPress={changeCompletion} />
      <AppButton label="EDIT" secondary disabled={busy}
        onPress={() => router.push({ pathname: '/tasks/edit', params: { id: task.id } })} />
      <AppButton label="DELETE TASK" secondary disabled={busy} onPress={confirmDelete} />
      {actionError ? <Text style={ui.body} accessibilityRole="alert">{actionError}</Text> : null}
      {message ? <Text accessibilityLiveRegion="polite" style={ui.muted}>{message}</Text> : null}
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
