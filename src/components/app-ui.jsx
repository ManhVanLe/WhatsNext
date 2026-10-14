import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const palette = {
  background: '#111318',
  surface: '#1D2129',
  border: '#383E49',
  text: '#F4F5F7',
  muted: '#B9C0CC',
  accent: '#9DAEFF',
  onAccent: '#141A32',
};

export function Screen({ children, hasHeader = false }) {
  const insets = useSafeAreaInsets();
  // Native tabs handle the bottom inset; Android needs its top inset on headerless screens.
  const androidInsets = Platform.OS === 'android'
    ? {
        paddingTop: 24 + (hasHeader ? 0 : insets.top),
        paddingLeft: 24 + insets.left,
        paddingRight: 24 + insets.right,
      }
    : undefined;

  return (
    <ScrollView
      style={ui.screen}
      contentContainerStyle={[ui.content, androidInsets]}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

export function AppButton({ label, onPress, secondary = false, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [ui.button, secondary && ui.secondary, (pressed || disabled) && ui.pressed]}
    >
      <Text style={[ui.buttonText, secondary && { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

export function Choice({ label, selected, onPress, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [ui.choice, selected && ui.selected, pressed && ui.pressed]}
    >
      <Text style={[ui.body, selected && { color: palette.onAccent, fontWeight: '600' }]}>{label}</Text>
    </Pressable>
  );
}

export function FormField({ label, ...props }) {
  return (
    <View style={ui.section}>
      <Text style={ui.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={palette.muted}
        selectionColor={palette.accent}
        keyboardAppearance="dark"
        style={[ui.input, props.multiline && ui.notes, props.style]}
      />
    </View>
  );
}

export const ui = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 20,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  title: {
    color: palette.text,
    fontSize: 32,
    fontWeight: '700',
  },
  heading: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '600',
  },
  body: {
    color: palette.text,
    fontSize: 16,
    lineHeight: 24,
  },
  muted: {
    color: palette.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    gap: 10,
  },
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  choice: {
    minHeight: 48,
    minWidth: 88,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    backgroundColor: palette.surface,
  },
  selected: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  button: {
    minHeight: 52,
    padding: 16,
    borderRadius: 12,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: palette.onAccent,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondary: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pressed: {
    opacity: 0.7,
  },
  card: {
    padding: 20,
    gap: 8,
    backgroundColor: palette.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
  },
  input: {
    minHeight: 50,
    padding: 14,
    fontSize: 16,
    color: palette.text,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
  },
  notes: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
});
