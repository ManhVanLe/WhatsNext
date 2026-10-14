import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';

import { AppButton, palette, ui } from './app-ui';
import { formatEventDate, formatEventTime } from '../utils/event-utils';

// One native picker shared by event dates/times and optional task deadlines.
export default function DateTimeField({ label, value, onChange, mode = 'date', optional = false, disabled = false }) {
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(new Date());
  const displayValue = value
    ? (mode === 'date' ? formatEventDate(value) : formatEventTime(value))
    : (mode === 'date' ? 'Choose a date' : 'Choose a time');

  function openPicker() {
    const initialValue = value || new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialValue,
        mode,
        onValueChange: (_event, selectedDate) => onChange(selectedDate),
      });
    } else {
      setDraft(initialValue);
      setVisible(true);
    }
  }

  return (
    <View style={ui.section}>
      <Text style={ui.label}>{label}</Text>
      <AppButton label={displayValue} secondary onPress={openPicker} disabled={disabled} />
      {optional && value ? (
        <AppButton label={mode === 'date' ? 'Clear date' : 'Clear time'} secondary onPress={() => onChange(null)} disabled={disabled} />
      ) : null}
      {Platform.OS === 'ios' && (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.dialog}>
              <Text style={ui.label}>{label}</Text>
              <DateTimePicker
                value={draft}
                mode={mode}
                display="spinner"
                themeVariant="dark"
                textColor={palette.text}
                onValueChange={(_event, selectedDate) => setDraft(selectedDate)}
                style={styles.picker}
              />
              <AppButton label="Done" onPress={() => { onChange(draft); setVisible(false); }} />
              <AppButton label="Cancel" secondary onPress={() => setVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#00000099' },
  dialog: { backgroundColor: palette.surface, padding: 20, borderRadius: 14, gap: 12 },
  picker: { alignSelf: 'stretch' },
});
