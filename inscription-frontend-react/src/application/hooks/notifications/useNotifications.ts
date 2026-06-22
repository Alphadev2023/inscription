import { useNotificationStore } from "@/infrastructure/store/notificationStore"

export function useNotifications() {
  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const clear = useNotificationStore((s) => s.clear)

  return { notifications, unreadCount, markAllRead, clear }
}
