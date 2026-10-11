import { Text } from 'react-native';

import { Screen, ui } from '@/components/app-ui';

export default function EventsScreen() {
  // In progress: event creation will be added later.
  return (
    <Screen>
      <Text style={ui.title}>Events</Text>
      <Text style={ui.muted}>No events yet</Text>
    </Screen>
  );
}
