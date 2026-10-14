import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton, Choice, FormField, Screen, ui } from './app-ui';
import DateTimeField from './date-time-field';
import { useTasks } from '../context/tasks-context';
import { taskDeadlineFromPicker, taskDeadlineToDate } from '../utils/task-deadline';
import { isValidDuration } from '../utils/task-validation';

const importanceOptions = ['Low', 'Normal', 'High'];

export default function TaskForm({ task }) {
  const { addTask, updateTask } = useTasks();
  // Keep draft values separate from the saved task until SQLite confirms the write.
  const [name, setName] = useState(task?.name ?? '');
  const [importance, setImportance] = useState(task?.importance ?? 'Normal');
  const [deadline, setDeadline] = useState(() => taskDeadlineToDate(task?.deadline));
  const [deadlineTime, setDeadlineTime] = useState(() =>
    task?.deadline?.includes('T') ? taskDeadlineToDate(task.deadline) : null
  );
  const [durationMinutes, setDurationMinutes] = useState(
    task?.estimatedDuration === undefined ? '' : String(task.estimatedDuration)
  );
  const [notes, setNotes] = useState(task?.notes ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const submitted = useRef(false);

  async function saveTask() {
    if (submitted.current) return;
    const trimmedName = name.trim();
    const trimmedDuration = durationMinutes.trim();
    if (!trimmedName) {
      setError('Please enter a task name.');
      return;
    }
    if (trimmedDuration && !isValidDuration(trimmedDuration)) {
      setError('Estimated duration must be a positive whole number of minutes, or empty.');
      return;
    }
    let savedDeadline;
    try {
      savedDeadline = taskDeadlineFromPicker(deadline, deadlineTime);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    submitted.current = true;
    setSaving(true);
    setError('');
    const input = {
      name: trimmedName,
      importance,
      deadline: savedDeadline,
      estimatedDuration: trimmedDuration ? Number(trimmedDuration) : undefined,
      notes: notes.trim() || undefined,
    };
    try {
      if (task) {
        await updateTask(task.id, input);
        router.dismissTo({ pathname: '/tasks/[id]', params: { id: task.id } });
      } else {
        await addTask(input);
        router.dismissTo('/tasks');
      }
    } catch {
      submitted.current = false;
      setError('Could not save the task. Your inputs are still here; please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen hasHeader>
      <FormField
        label="Task Name (required)"
        placeholder="e.g. Review lecture notes"
        value={name}
        onChangeText={setName}
        autoCapitalize="sentences"
        editable={!saving}
      />
      <View style={ui.section}>
        <Text style={ui.label}>Importance</Text>
        <View style={ui.choices}>
          {importanceOptions.map((option) => (
            <Choice
              key={option}
              label={option}
              selected={importance === option}
              onPress={() => setImportance(option)}
              disabled={saving}
            />
          ))}
        </View>
      </View>
      <DateTimeField
        label="Deadline (optional)"
        value={deadline}
        onChange={(date) => {
          setDeadline(date);
          if (!date) setDeadlineTime(null);
        }}
        optional
        disabled={saving}
      />
      {deadline ? (
        <DateTimeField
          label="Deadline time (optional)"
          mode="time"
          value={deadlineTime}
          onChange={setDeadlineTime}
          optional
          disabled={saving}
        />
      ) : null}
      <FormField
        label="Estimated Duration (optional, minutes)"
        placeholder="e.g. 30"
        value={durationMinutes}
        onChangeText={setDurationMinutes}
        keyboardType="number-pad"
        editable={!saving}
      />
      <FormField
        label="Notes (optional)"
        placeholder="Anything you want to remember"
        value={notes}
        onChangeText={setNotes}
        multiline
        editable={!saving}
      />
      {error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={ui.body}>{error}</Text>
      ) : null}
      <AppButton
        label={saving ? 'SAVING...' : task ? 'SAVE CHANGES' : 'CREATE TASK'}
        onPress={saveTask}
        disabled={saving}
      />
    </Screen>
  );
}
