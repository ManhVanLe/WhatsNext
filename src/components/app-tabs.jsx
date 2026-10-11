import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { palette } from '@/components/app-ui';

export default function AppTabs() {
  // Trigger names match routes in src/app; the Tasks route has its own stack.
  return (
    <NativeTabs
      backgroundColor={palette.surface}
      tintColor={palette.accent}
      iconColor={{ default: palette.muted, selected: palette.accent }}
      labelStyle={{ default: { color: palette.muted }, selected: { color: palette.accent } }}
      indicatorColor={palette.border}
      blurEffect="none"
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tasks">
        <NativeTabs.Trigger.Label>Tasks</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="checklist" md="checklist" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="events">
        <NativeTabs.Trigger.Label>Events</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="event" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
