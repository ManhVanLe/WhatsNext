import { Stack } from 'expo-router/stack';

import { palette } from '@/components/app-ui';

export const unstable_settings = { initialRouteName: 'index' };

export default function EventsLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: palette.background },
      headerTintColor: palette.text,
      headerShadowVisible: false,
      contentStyle: { backgroundColor: palette.background },
    }}>
      <Stack.Screen name="index" options={{ title: 'Events' }} />
      <Stack.Screen name="create" options={{ title: 'Create Event' }} />
      <Stack.Screen name="[id]" options={{ title: 'Event Details' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Event' }} />
    </Stack>
  );
}
