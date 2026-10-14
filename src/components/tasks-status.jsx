import { Text } from 'react-native';

import { AppButton, Screen, ui } from './app-ui';
import { useTasks } from '../context/tasks-context';

export default function TasksStatus() {
  const { loading, error, reload } = useTasks();
  return (
    <Screen hasHeader>
      <Text style={ui.body} accessibilityLiveRegion="polite">{loading ? 'Loading tasks...' : error}</Text>
      {!loading && <AppButton label="Try again" onPress={reload} />}
    </Screen>
  );
}
