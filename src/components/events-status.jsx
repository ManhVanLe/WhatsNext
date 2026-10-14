import { Text } from 'react-native';

import { AppButton, Screen, ui } from './app-ui';
import { useEvents } from '../context/events-context';

// Keep loading/storage errors distinct from an empty database or a missing event.
export default function EventsStatus() {
  const { loading, error, reload } = useEvents();
  return (
    <Screen hasHeader>
      <Text style={ui.body} accessibilityLiveRegion="polite">{loading ? 'Loading events...' : error}</Text>
      {!loading && <AppButton label="Try again" onPress={reload} />}
    </Screen>
  );
}
