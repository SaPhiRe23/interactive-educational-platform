import { Calendar, Clock, MapPin } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { getActivities } from "@/lib/data"
import type { Activity } from "@/lib/db/schema"

export const dynamic = "force-dynamic"

function formatTime(date: Date | null) {
  if (!date) return ""
  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Bogota",
  }).format(new Date(date))
}

export default async function CronogramaPage() {
  const activities = await getActivities()

  const groups = new Map<string, Activity[]>()
  for (const a of activities) {
    const key = a.dayLabel ?? "Actividades"
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(a)
  }

  return (
    <>
      <PageHeader
        icon={Calendar}
        title="Cronograma de actividades"
        description="Consulta el programa completo del evento, organizado por día. Planea tu visita y no te pierdas nada."
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col gap-12">
          {[...groups.entries()].map(([day, items]) => (
            <section key={day}>
              <h2 className="mb-6 flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
                <span className="h-6 w-1.5 rounded-full bg-primary" />
                {day}
              </h2>
              <ol className="relative flex flex-col gap-4 border-l-2 border-border pl-6">
                {items.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[1.9rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
                    <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-heading text-lg font-semibold text-foreground">{a.title}</h3>
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(a.startsAt)}
                          {a.endsAt ? ` - ${formatTime(a.endsAt)}` : ""}
                        </Badge>
                      </div>
                      {a.description && (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.description}</p>
                      )}
                      {a.location && (
                        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary">
                          <MapPin className="h-4 w-4" />
                          {a.location}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
