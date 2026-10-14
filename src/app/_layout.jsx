import { DarkTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import AppTabs from '@/components/app-tabs';
import { palette } from '@/components/app-ui';
import { EventsProvider } from '@/context/events-context';
import { TasksProvider } from '@/context/tasks-context';

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: palette.background,
    card: palette.surface,
    primary: palette.accent,
    text: palette.text,
    border: palette.border,
  },
};

export default function RootLayout() {
  // Keeping the provider above navigation shares tasks between all screens.
  return (
    <TasksProvider>
      <ThemeProvider value={darkTheme}>
        <StatusBar style="light" />
        <EventsProvider>
          <AppTabs />
        </EventsProvider>
      </ThemeProvider>
    </TasksProvider>
  );
}
