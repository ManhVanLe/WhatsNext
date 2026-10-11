import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton, Choice, FormField, Screen, ui } from '@/components/app-ui';
import { useTasks } from '@/context/tasks-context';
import { isValidDeadline, isValidDuration } from '@/utils/task-validation';

const importanceOptions = ['Low', 'Normal', 'High'];

export default function CreateTaskScreen() {
  const { addTask } = useTasks();
  // Inputs stay in this screen's state until a valid task is submitted.
  const [name, setName] = useState('');
  const [importance, setImportance] = useState('Normal');
  const [deadline, setDeadline] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const submitted = useRef(false);

  function createTask() {
    // A ref blocks rapid repeat taps before navigation removes this form.
    if (submitted.current) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedDeadline = deadline.trim();
    const trimmedDuration = durationMinutes.trim();
    const trimmedNotes = notes.trim();

    if (!trimmedName) {
      setError('Please enter a task name.');
      return;
    }
    if (trimmedDeadline && !isValidDeadline(trimmedDeadline)) {
      setError('Enter a valid deadline as YYYY-MM-DD, or leave it empty.');
      return;
    }
    if (trimmedDuration && !isValidDuration(trimmedDuration)) {
      setError('Estimated duration must be a positive whole number of minutes, or empty.');
      return;
    }
    // Empty optional fields become undefined; duration input becomes a number of minutes.
    submitted.current = true;
    addTask({
      name: trimmedName,
      importance,
      deadline: trimmedDeadline || undefined,
      estimatedDuration: trimmedDuration ? Number(trimmedDuration) : undefined,
      notes: trimmedNotes || undefined,
    });
    // Close the form and return to the list, so Back does not reopen a submitted form.
    router.dismissTo('/tasks');
  }

  return (
    <Screen hasHeader>
      <FormField
        label="Task Name (required)"
        placeholder="e.g. Review lecture notes"
        value={name}
        onChangeText={setName}
        autoCapitalize="sentences"
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
            />
          ))}
        </View>
      </View>
      <FormField
        label="Deadline (optional, YYYY-MM-DD)"
        placeholder="YYYY-MM-DD"
        value={deadline}
        onChangeText={setDeadline}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <FormField
        label="Estimated Duration (optional, minutes)"
        placeholder="e.g. 30"
        value={durationMinutes}
        onChangeText={setDurationMinutes}
        keyboardType="number-pad"
      />
      <FormField
        label="Notes (optional)"
        placeholder="Anything you want to remember"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      {error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={ui.body}>
          {error}
        </Text>
      ) : null}
      <AppButton label="CREATE TASK" onPress={createTask} />
    </Screen>
  );
}
