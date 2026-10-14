import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import { AppButton, Screen, ui } from '@/components/app-ui';
import EventForm from '@/components/event-form';
import EventsStatus from '@/components/events-status';
import { useEvents } from '@/context/events-context';

export default function EditEventScreen() {
  const { id } = useLocalSearchParams();
  const { events, loading, error } = useEvents();
  if (loading || error) return <EventsStatus />;
  const event = events.find((item) => String(item.id) === id);
  if (!event) {
    return (
      <Screen hasHeader>
        <Text style={ui.heading}>Event not found</Text>
        <AppButton label="Back to Events" onPress={() => router.dismissTo('/events')} />
      </Screen>
    );
  }
  return <EventForm key={event.id} event={event} />;
}
