import { Calendar, Clock, MapPin, Users2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { getActivities, getSettings } from "@/lib/data"

export const dynamic = "force-dynamic"

function formatTimeRange(startsAt: Date, endsAt: Date | null) {
  const timeFormatter = new Intl.DateTimeFormat("es-CO", { hour: "2-digit", minute: "2-digit" })
  const start = timeFormatter.format(new Date(startsAt))
  if (!endsAt) return start
  const end = timeFormatter.format(new Date(endsAt))
  return `${start} – ${end}`
}

function formatDuration(startsAt: Date, endsAt: Date | null) {
  if (!endsAt) return null
  const minutes = Math.round((new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000)
  if (minutes <= 0) return null
  if (minutes < 60) return `${minutes} minutos`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} ${hours === 1 ? "hora" : "horas"}` : `${hours}h ${rest}min`
}

export default async function CronogramaPage() {
  const [activities, settings] = await Promise.all([getActivities(), getSettings()])

  const totalMinutes = activities.reduce((sum, a) => {
    if (!a.endsAt) return sum
    const diff = Math.round((new Date(a.endsAt).getTime() - new Date(a.startsAt).getTime()) / 60000)
    return diff > 0 ? sum + diff : sum
  }, 0)

  const totalDurationLabel =
    totalMinutes > 0
      ? totalMinutes < 60
        ? `${totalMinutes} minutos`
        : `${(totalMinutes / 60).toFixed(totalMinutes % 60 === 0 ? 0 : 1)} horas`
      : "Por definir"

  // Group activities by their day label so multi-day events show separated sections.
  const groups = new Map<string, typeof activities>()
  for (const activity of activities) {
    const key = activity.dayLabel?.trim() || "Programa"
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(activity)
  }

  return (
    <>
      <PageHeader
        icon={Calendar}
        title="Cronograma de actividades"
        description={`Programa de "${settings.eventName}", actualizado en tiempo real desde el panel administrativo.`}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Duración total</p>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">{totalDurationLabel}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Actividades</p>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">{activities.length}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lugar</p>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">{settings.eventLocation}</p>
          </div>
        </div>

        {activities.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/70 bg-secondary/20 px-4 py-10 text-center text-sm text-muted-foreground">
            Todavía no se han publicado actividades. El equipo organizador las está preparando — vuelve pronto.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {Array.from(groups.entries()).map(([day, items]) => (
              <section key={day}>
                {groups.size > 1 && (
                  <h2 className="mb-4 font-heading text-lg font-bold text-foreground">{day}</h2>
                )}
                <div className="relative flex flex-col gap-4 border-l-2 border-border pl-6">
                  {items.map((activity, index) => (
                    <article key={activity.id} className="relative">
                      <span className="absolute -left-[1.9rem] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary shadow-sm">
                        {index + 1}
                      </span>
                      <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="font-heading text-lg font-semibold text-foreground">{activity.title}</h3>
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeRange(activity.startsAt, activity.endsAt)}
                          </Badge>
                        </div>

                        {activity.description && (
                          <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                            {activity.description
                              .split("\n")
                              .map((line) => line.trim())
                              .filter(Boolean)
                              .map((line, lineIndex) => (
                                <p key={lineIndex} className="flex gap-2">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                  <span>{line}</span>
                                </p>
                              ))}
                          </div>
                        )}

                        <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-primary">
                          {activity.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {activity.location}
                            </span>
                          )}
                          {formatDuration(activity.startsAt, activity.endsAt) && (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Users2 className="h-4 w-4" />
                              {formatDuration(activity.startsAt, activity.endsAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
