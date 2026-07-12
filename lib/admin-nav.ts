import type { LucideIcon } from "lucide-react"
import {
  Award,
  BarChart3,
  CalendarDays,
  Images,
  LayoutDashboard,
  Map,
  MessageSquareText,
  Settings,
  Users,
} from "lucide-react"

export const adminNavItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/participantes", label: "Participantes", icon: Users },
  { href: "/admin/actividades", label: "Cronograma", icon: CalendarDays },
  { href: "/admin/mapa", label: "Mapa", icon: Map },
  { href: "/admin/galeria", label: "Galería", icon: Images },
  { href: "/admin/insignias", label: "Insignias", icon: Award },
  { href: "/admin/encuestas", label: "Encuestas", icon: MessageSquareText },
  { href: "/admin/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
]
