import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, SectionList, Text, View } from 'react-native';

import { AppButton, ui } from '@/components/app-ui';
import EventsStatus from '@/components/events-status';
import { useEvents } from '@/context/events-context';
import { formatEventDate, formatEventTime, formatReminder } from '@/utils/event-utils';

export default function EventsScreen() {
  const { events, loading, error, warning, reload } = useEvents();
  const [now, setNow] = useState(() => Date.now());

  useFocusEffect(useCallback(() => {
    reload();
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, [reload]));

  if (loading || error) return <EventsStatus />;
  // Include events still happening; retain past events so they can also be edited/deleted.
  const upcoming = events.filter((event) => event.endAt > now);
  const past = events.filter((event) => event.endAt <= now).reverse();
  const sections = [
    ...(upcoming.length ? [{ title: 'Upcoming events', data: upcoming }] : []),
    ...(past.length ? [{ title: 'Past events', data: past }] : []),
  ];

  return (
    <SectionList
      style={ui.screen}
      contentContainerStyle={ui.content}
      contentInsetAdjustmentBehavior="automatic"
      stickySectionHeadersEnabled={false}
      sections={sections}
      keyExtractor={(event) => String(event.id)}
      ListHeaderComponent={
        <View style={ui.section}>
          <AppButton label="+ Add Event" onPress={() => router.push('/events/create')} />
          {!upcoming.length && <Text style={ui.muted}>{events.length ? 'No upcoming events' : 'No events yet. Add an appointment, meeting, or class.'}</Text>}
          {warning ? <Text style={ui.muted} accessibilityLiveRegion="polite">{warning}</Text> : null}
        </View>
      }
      renderSectionHeader={({ section }) => <Text style={ui.heading}>{section.title}</Text>}
      renderItem={({ item }) => (
        <Pressable accessibilityRole="button" accessibilityLabel={`View event: ${item.name}`}
          onPress={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}
          style={({ pressed }) => [ui.card, pressed && ui.pressed]}>
          <Text style={ui.heading}>{item.name}</Text>
          <Text style={ui.muted}>{formatEventDate(item.startAt)}</Text>
          <Text style={ui.body}>{formatEventTime(item.startAt)} to {formatEventTime(item.endAt)}</Text>
          <Text style={ui.muted}>{formatReminder(item.reminderMinutes)}</Text>
          {item.reminderMinutes !== null && !item.notificationId && item.startAt > now
            ? <Text style={ui.muted}>No reminder scheduled</Text> : null}
        </Pressable>
      )}
    />
  );
}
