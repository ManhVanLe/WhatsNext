import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { AppButton, Choice, FormField, Screen, ui } from './app-ui';
import DateTimeField from './date-time-field';
import { useEvents } from '../context/events-context';
import { combineLocalDateAndTime, parseCustomReminder, reminderOptions, validateEvent } from '../utils/event-utils';

function initialTimes(event) {
  if (event) return { start: new Date(event.startAt), end: new Date(event.endAt) };
  const start = new Date(Date.now() + 60 * 60000);
  start.setSeconds(0, 0);
  // Keep the initial suggestion within one day, including when opened near midnight.
  if (start.getHours() === 23) {
    start.setDate(start.getDate() + 1);
    start.setHours(9, 0, 0, 0);
  }
  return { start, end: new Date(start.getTime() + 60 * 60000) };
}

export default function EventForm({ event }) {
  const { saveEvent } = useEvents();
  const [initial] = useState(() => initialTimes(event));
  const [name, setName] = useState(event?.name || '');
  const [date, setDate] = useState(initial.start);
  const [startTime, setStartTime] = useState(initial.start);
  const [endTime, setEndTime] = useState(initial.end);
  const initialReminder = event ? event.reminderMinutes : 15;
  const [reminder, setReminder] = useState(
    reminderOptions.includes(initialReminder) ? initialReminder : 'custom'
  );
  const [customMinutes, setCustomMinutes] = useState(
    initialReminder === null ? '' : String(initialReminder)
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const submitted = useRef(false);

  async function submit() {
    if (submitted.current) return;
    let input;
    try {
      input = {
        name: name.trim(),
        startAt: combineLocalDateAndTime(date, startTime),
        endAt: combineLocalDateAndTime(date, endTime),
        reminderMinutes: reminder === 'custom' ? parseCustomReminder(customMinutes) : reminder,
      };
      validateEvent(input);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    submitted.current = true;
    setSaving(true);
    setError('');
    try {
      const result = await saveEvent(input, event?.id);
      router.dismissTo('/events');
      if (result.warning) Alert.alert('Event saved', result.warning);
    } catch {
      submitted.current = false;
      setError('Could not save the event. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen hasHeader>
      <FormField label="Event name (required)" placeholder="e.g. Tutorial"
        value={name} onChangeText={setName} editable={!saving} autoCapitalize="sentences" />
      <DateTimeField label="Date" value={date} onChange={setDate} disabled={saving} />
      <DateTimeField label="Start time" mode="time" value={startTime} onChange={setStartTime} disabled={saving} />
      <DateTimeField label="End time" mode="time" value={endTime} onChange={setEndTime} disabled={saving} />
      <Text style={ui.muted}>Start and end times must be on the same date.</Text>
      <View style={ui.section}>
        <Text style={ui.label}>Reminder before event</Text>
        <View style={ui.choices}>
          {reminderOptions.map((minutes) => (
            <Choice key={String(minutes)} label={minutes === null ? 'No reminder' : `${minutes} min`}
              selected={reminder === minutes} onPress={() => setReminder(minutes)} disabled={saving} />
          ))}
          <Choice label="Custom" selected={reminder === 'custom'}
            onPress={() => setReminder('custom')} disabled={saving} />
        </View>
      </View>
      {reminder === 'custom' ? (
        <FormField label="Custom reminder (minutes)" value={customMinutes}
          onChangeText={setCustomMinutes} keyboardType="number-pad" editable={!saving} />
      ) : null}
      {error ? <Text style={ui.body} accessibilityRole="alert" accessibilityLiveRegion="polite">{error}</Text> : null}
      <AppButton label={saving ? 'SAVING...' : 'SAVE EVENT'} onPress={submit} disabled={saving} />
    </Screen>
  );
}
