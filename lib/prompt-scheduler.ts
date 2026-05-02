/**
 * Daily Prompt Scheduler
 *
 * Manages when and how often the daily prompt reminder is shown.
 * This module is designed to work with local in-app reminders now,
 * but can be extended to integrate with Expo Notifications later.
 */

/**
 * Get today's date as an ISO string (YYYY-MM-DD).
 */
export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Check if today's prompt has already been delivered/shown.
 */
export function hasPromptBeenDeliveredToday(lastDeliveredDate: string | undefined): boolean {
  if (!lastDeliveredDate) return false;
  return lastDeliveredDate === getTodayDate();
}

/**
 * Mark today's prompt as delivered.
 */
export function markPromptAsDelivered(): string {
  return getTodayDate();
}

/**
 * Parse a reminder time string (HH:MM) and check if it's time to show the reminder.
 * For now, this is a simple check. In production, this would integrate with
 * Expo Notifications for actual push notifications.
 */
export function shouldShowReminder(reminderTime: string | undefined): boolean {
  if (!reminderTime) return false;

  const now = new Date();
  const [hours, minutes] = reminderTime.split(':').map(Number);

  // Check if current time is within a 5-minute window of the reminder time
  // (to avoid showing the reminder multiple times per day)
  const reminderDate = new Date();
  reminderDate.setHours(hours, minutes, 0, 0);

  const timeDiff = Math.abs(now.getTime() - reminderDate.getTime());
  const fiveMinutesInMs = 5 * 60 * 1000;

  return timeDiff <= fiveMinutesInMs;
}

/**
 * Format a time string for display (HH:MM -> "9:00 AM").
 */
export function formatReminderTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Stub for future Expo Notifications integration.
 * This function would schedule a push notification.
 * For now, it's a no-op.
 */
export async function schedulePushNotification(
  promptText: string,
  reminderTime: string,
): Promise<void> {
  // TODO: Integrate with Expo Notifications
  // const { scheduleNotificationAsync } = require('expo-notifications');
  // await scheduleNotificationAsync({
  //   content: {
  //     title: 'Time to Record',
  //     body: promptText,
  //   },
  //   trigger: {
  //     hour: parseInt(reminderTime.split(':')[0]),
  //     minute: parseInt(reminderTime.split(':')[1]),
  //     repeats: true,
  //   },
  // });
  console.log('[PromptScheduler] Push notification stub called for:', promptText);
}
