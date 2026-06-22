import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useWebSocket } from "@/infrastructure/websocket/useWebSocket"

export default function MainLayout() {
  useWebSocket()

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 ml-44 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
