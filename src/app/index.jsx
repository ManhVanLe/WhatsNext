import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton, Choice, Screen, ui } from '@/components/app-ui';

const timeOptions = ['15 mins', '30 mins', '45 mins', '1 hour', '2+ hours'];

export default function HomeScreen() {
  // No time option is selected until the user chooses one.
  const [availableTime, setAvailableTime] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  return (
    <Screen>
      <Text style={ui.title}>WhatsNext</Text>
      <Text style={ui.heading}>What should you focus on?</Text>
      <Text style={ui.muted}>One task at a time. A little progress goes a long way.</Text>
      <View style={ui.section}>
        <Text style={ui.label}>How much time do you have?</Text>
        <View style={ui.choices}>
          {timeOptions.map((time) => (
            <Choice
              key={time}
              label={time}
              selected={availableTime === time}
              onPress={() => setAvailableTime(time)}
            />
          ))}
        </View>
      </View>
      {/* In progress: time selection is saved here, but recommendations are not implemented. */}
      <AppButton label="DECIDE FOR ME" onPress={() => setShowPlaceholder(true)} />
      {showPlaceholder && (
        <Text accessibilityLiveRegion="polite" style={ui.muted}>
          Task recommendations are coming later. For now, choose a task from your list.
        </Text>
      )}
      <AppButton label="View Tasks" secondary onPress={() => router.navigate('/tasks')} />
    </Screen>
  );
}
