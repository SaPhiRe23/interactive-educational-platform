import Link from "next/link"
import { Award, CalendarDays, MessageSquareText, Star, UserCheck, Users } from "lucide-react"
import { getStats } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-bold leading-none text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Resumen del evento</h1>
        <p className="mt-1 text-sm text-muted-foreground">Estado general de inscripciones, participación y satisfacción.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard icon={Users} label="Inscritos" value={stats.participantsTotal} />
        <StatCard icon={UserCheck} label="Actividades completadas" value={stats.completedTotal} />
        <StatCard icon={Award} label="Insignias otorgadas" value={stats.badgesAwarded} />
        <StatCard icon={MessageSquareText} label="Encuestas recibidas" value={stats.surveyTotal} />
        <StatCard icon={Star} label="Calificación promedio" value={stats.avgRating.toFixed(1)} />
        <StatCard icon={CalendarDays} label="Recomendarían el evento" value={stats.recommendCount} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <Link href="/admin/participantes" className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60">
            Gestionar participantes y certificados
          </Link>
          <Link href="/admin/actividades" className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60">
            Editar cronograma de actividades
          </Link>
          <Link href="/admin/mapa" className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60">
            Configurar zonas del mapa
          </Link>
          <Link href="/admin/galeria" className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60">
            Administrar galería de fotos y videos
          </Link>
          <Link href="/admin/insignias" className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60">
            Crear y otorgar insignias
          </Link>
          <Link href="/admin/configuracion" className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60">
            Configuración general del evento
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
