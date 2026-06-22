import { create } from "zustand"
import type { WsNotification } from "@/domain/models"

interface NotificationState {
  notifications: WsNotification[]
  unreadCount: number
  addNotification: (n: WsNotification) => void
  markAllRead: () => void
  clear: () => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    })),
  markAllRead: () => set({ unreadCount: 0 }),
  clear: () => set({ notifications: [], unreadCount: 0 }),
}))
