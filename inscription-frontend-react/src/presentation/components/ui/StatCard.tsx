import type { LucideIcon } from "lucide-react"

interface Props {
  label: string
  value: number | string
  icon: LucideIcon
  color?: "primary" | "success" | "warning" | "danger" | "neutral"
}

const colors = {
  primary: "text-primary-500",
  success: "text-success-500",
  warning: "text-warning-500",
  danger:  "text-danger-500",
  neutral: "text-neutral-500",
}

export default function StatCard({ label, value, icon: Icon, color = "primary" }: Props) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between">
      <div>
        <p className="text-neutral-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
      </div>
      <Icon size={24} className={colors[color]} />
    </div>
  )
}
