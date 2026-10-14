import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { formatEventTime, reminderTimestamp } from '../utils/event-utils';

const channelId = 'whatsnext-event-reminders';
const identifierPrefix = 'whatsnext-event-';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function permissionAllowsReminders(permission) {
  return permission.granted ||
    permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

async function getPermission(requestPermission) {
  // Android needs a channel before it can display the notification permission prompt.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(channelId, {
      name: 'Event reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
  let permission = await Notifications.getPermissionsAsync();
  if (requestPermission && !permissionAllowsReminders(permission) && permission.canAskAgain) {
    permission = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: false, allowSound: true },
    });
  }
  return permissionAllowsReminders(permission);
}

// SQLite is the source of truth. Reconcile on launch/resume and after each change
// so an interruption between saving a record and scheduling cannot leave orphan reminders.
export async function syncEventReminders(events, requestPermission = false) {
  const notificationIds = new Map(events.map((event) => [event.id, null]));
  const warnings = new Set();
  const blockedIds = new Set();
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const owned = scheduled.filter((item) => item.identifier.startsWith(identifierPrefix));
  const hasFutureReminder = events.some((event) => reminderTimestamp(event) > Date.now());
  let allowed = false;
  let permissionCheckFailed = false;
  if (hasFutureReminder) {
    try {
      allowed = await getPermission(requestPermission);
    } catch {
      permissionCheckFailed = true;
      warnings.add('Notification permission could not be checked. Events are saved; reopen Events to retry reminders.');
    }
  }
  const expected = new Map(events.map((event) => [identifierPrefix + event.id, event]));

  for (const notification of owned) {
    const event = expected.get(notification.identifier);
    const reminderAt = event ? reminderTimestamp(event) : null;
    const matches = event && (allowed || permissionCheckFailed) && reminderAt > Date.now() &&
      notification.content.data?.reminderAt === reminderAt &&
      notification.content.data?.startAt === event.startAt &&
      notification.content.data?.endAt === event.endAt &&
      notification.content.data?.name === event.name;
    if (matches) {
      notificationIds.set(event.id, notification.identifier);
    } else {
      try {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      } catch {
        blockedIds.add(notification.identifier);
        warnings.add('An old reminder could not be cancelled and may still arrive. Reopen Events to retry.');
      }
    }
  }

  if (hasFutureReminder && !allowed && !permissionCheckFailed) {
    warnings.add('Notifications are not allowed. Events are saved, but reminders will not be delivered. Enable notifications for Expo Go in device settings to receive reminders.');
  }
  for (const event of events) {
    const reminderAt = reminderTimestamp(event);
    if (!allowed || reminderAt === null || reminderAt <= Date.now() ||
        notificationIds.get(event.id) || blockedIds.has(identifierPrefix + event.id)) continue;
    try {
      // Stable IDs prevent duplicates if the app closes before SQLite records the result.
      const identifier = await Notifications.scheduleNotificationAsync({
        identifier: identifierPrefix + event.id,
        content: {
          title: event.name,
          body: `Starts at ${formatEventTime(event.startAt)}.`,
          sound: 'default',
          data: { eventId: event.id, name: event.name, startAt: event.startAt,
            endAt: event.endAt, reminderAt },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(reminderAt),
          ...(Platform.OS === 'android' ? { channelId } : {}),
        },
      });
      notificationIds.set(event.id, identifier);
    } catch {
      warnings.add('A reminder could not be scheduled. Your event is saved. Reopen Events to retry.');
    }
  }
  return { notificationIds, warning: [...warnings].join('\n\n') };
}
