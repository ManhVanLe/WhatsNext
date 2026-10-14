import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { AppButton, Screen, ui } from '@/components/app-ui';
import EventsStatus from '@/components/events-status';
import { useEvents } from '@/context/events-context';
import { formatEventDate, formatEventTime, formatReminder } from '@/utils/event-utils';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { events, loading, error, deleteEvent } = useEvents();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const deleteStarted = useRef(false);
  const event = events.find((item) => String(item.id) === id);

  if (loading || error) return <EventsStatus />;
  if (!event) {
    return (
      <Screen hasHeader>
        <Text style={ui.heading}>{deleting ? 'Deleting event...' : 'Event not found'}</Text>
        <AppButton label="Back to Events" onPress={() => router.dismissTo('/events')} />
      </Screen>
    );
  }

  function confirmDelete() {
    Alert.alert('Delete event?', `Delete "${event.name}" and its reminder?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        if (deleteStarted.current) return;
        deleteStarted.current = true;
        setDeleting(true);
        setDeleteError('');
        try {
          const warning = await deleteEvent(event.id);
          router.dismissTo('/events');
          if (warning) Alert.alert('Event deleted', warning);
        } catch {
          deleteStarted.current = false;
          setDeleteError('Could not delete the event. Please try again.');
        } finally {
          setDeleting(false);
        }
      } },
    ]);
  }

  return (
    <Screen hasHeader>
      <Text style={ui.title}>{event.name}</Text>
      <View style={ui.card}>
        <Text style={ui.body}>{formatEventDate(event.startAt)}</Text>
        <Text style={ui.body}>{formatEventTime(event.startAt)} to {formatEventTime(event.endAt)}</Text>
        <Text style={ui.muted}>Reminder: {formatReminder(event.reminderMinutes)}</Text>
        {event.reminderMinutes !== null && !event.notificationId
          ? <Text style={ui.muted}>No reminder is currently scheduled.</Text> : null}
      </View>
      <AppButton label="EDIT" disabled={deleting}
        onPress={() => router.push({ pathname: '/events/edit', params: { id: event.id } })} />
      <AppButton label={deleting ? 'DELETING...' : 'DELETE EVENT'} secondary
        disabled={deleting} onPress={confirmDelete} />
      {deleteError ? <Text style={ui.body} accessibilityRole="alert">{deleteError}</Text> : null}
    </Screen>
  );
}
