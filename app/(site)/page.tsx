import Image from "next/image"
import Link from "next/link"
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Images,
  Map,
  MapPin,
  ScrollText,
  Star,
  ThumbsUp,
  UserPlus,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSettings, getPublicStats, type StatMetricKey } from "@/lib/data"

const features = [
  { href: "/inscripcion", icon: UserPlus, title: "Inscripción", desc: "Regístrate y recibe tu código único de participante." },
  { href: "/cronograma", icon: Calendar, title: "Cronograma", desc: "Consulta todas las actividades día por día." },
  { href: "/mapa", icon: Map, title: "Mapa interactivo", desc: "Explora las zonas del patinódromo." },
  { href: "/galeria", icon: Images, title: "Galería", desc: "Fotos y videos del evento." },
  { href: "/insignias", icon: Award, title: "Insignias", desc: "Gana reconocimientos por participar." },
  { href: "/encuesta", icon: ClipboardCheck, title: "Encuesta", desc: "Cuéntanos tu experiencia." },
  { href: "/estadisticas", icon: BarChart3, title: "Estadísticas", desc: "Datos en vivo del evento." },
  { href: "/certificado", icon: ScrollText, title: "Certificado", desc: "Descarga tu certificado en PDF." },
]

const statIcons: Record<StatMetricKey, typeof UserPlus> = {
  participantsTotal: UserPlus,
  activitiesTotal: Calendar,
  completedTotal: CheckCircle2,
  badgesAwarded: Award,
  surveyTotal: ClipboardCheck,
  avgRating: Star,
  recommendCount: ThumbsUp,
}

function formatStatValue(key: StatMetricKey, value: number) {
  return key === "avgRating" ? value.toFixed(1) : String(value)
}

export default async function HomePage() {
  const [settings, stats] = await Promise.all([getSettings(), getPublicStats()])
  const visibleMetrics = stats.metrics.filter((m) => m.visible)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero-skating.png" alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              {settings.eventDates}
            </span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight text-foreground text-balance md:text-6xl">
              {settings.eventName}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty md:text-xl">
              {settings.eventTagline}. Una plataforma completa para vivir el evento de principio a fin.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {settings.eventLocation}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/inscripcion">Inscribirme ahora</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-background/50">
                <Link href="/cronograma">Ver cronograma</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats highlights */}
      {visibleMetrics.length > 0 && (
        <section className="mx-auto -mt-12 max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {visibleMetrics.map((metric) => {
              const Icon = statIcons[metric.key as StatMetricKey]
              return (
                <Card key={metric.key} className="border-border/70 shadow-sm">
                  <CardContent className="flex flex-col items-center gap-1 py-6 text-center">
                    <Icon className="mb-1 h-6 w-6 text-primary" />
                    <span className="font-heading text-3xl font-bold text-foreground">
                      {formatStatValue(metric.key as StatMetricKey, metric.value)}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {metric.label}
                    </span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground text-balance">
            Todo el evento en un solo lugar
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Explora cada sección de la plataforma diseñada para la propuesta "Huellas que Construyen Futuro: El Patinódromo Habla".
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link key={f.href} href={f.href} className="group">
              <Card className="h-full border-border/70 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-3 py-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-4">
        <Card className="overflow-hidden border-none bg-sidebar text-sidebar-foreground">
          <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <h2 className="font-heading text-2xl font-bold text-balance md:text-3xl">
              ¿Listo para rodar con nosotros?
            </h2>
            <p className="max-w-xl text-sidebar-foreground/80 text-pretty">
              Inscríbete gratis para sumarte a las 6 actividades pensadas para jóvenes de 14 a 28 años en el Patinódromo Distrital de Barranquilla.
            </p>
            <Button asChild size="lg">
              <Link href="/inscripcion">Quiero inscribirme</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
