import { useEffect, useRef } from "react"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { useAuthStore } from "@/infrastructure/store/authStore"
import { useNotificationStore } from "@/infrastructure/store/notificationStore"
import type { WsNotification } from "@/domain/models"

export function useWebSocket() {
  const token = useAuthStore((s) => s.token)
  const userId = useAuthStore((s) => s.userId)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    if (!token || !userId) return

    console.log("[WS] Connexion pour userId:", userId)

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("[WS] Connecte!")
        console.log("[WS] Souscription a:", `/user/${userId}/queue/notifications`)
        client.subscribe(`/user/${userId}/queue/notifications`, (msg) => {
          console.log("[WS] Message recu:", msg.body)
          const notification = JSON.parse(msg.body) as WsNotification
          addNotification(notification)
        })
        client.subscribe("/topic/notifications", (msg) => {
          console.log("[WS] Topic message:", msg.body)
          const notification = JSON.parse(msg.body) as WsNotification
          addNotification(notification)
        })
      },
      onStompError: (frame) => {
        console.error("[WS] STOMP error:", frame)
      },
      onDisconnect: () => {
        console.log("[WS] Deconnecte")
      },
      onWebSocketError: (error) => {
        console.error("[WS] WebSocket error:", error)
      },
    })

    client.activate()
    clientRef.current = client

    return () => { client.deactivate() }
  }, [token, userId, addNotification])

  return clientRef
}
