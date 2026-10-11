import { Stack } from 'expo-router/stack';

import { palette } from '@/components/app-ui';

// Keep the task list as the Back destination when opening a nested task route directly.
export const unstable_settings = { initialRouteName: 'index' };

export default function TasksLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.background },
        headerTintColor: palette.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: palette.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Active Tasks' }} />
      <Stack.Screen name="create" options={{ title: 'Create Task' }} />
      <Stack.Screen name="[id]" options={{ title: 'Task Details' }} />
    </Stack>
  );
}
