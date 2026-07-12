import { Award, Crown, Medal, Shield, Sparkles, Star, Target, Trophy, Zap } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ParticipantBadgesLookup } from "@/components/participant-badges-lookup"
import { getBadges } from "@/lib/data"

const iconMap = {
  award: Award,
  crown: Crown,
  medal: Medal,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  trophy: Trophy,
  zap: Zap,
} as const

function getBadgeIcon(icon: string | null) {
  if (!icon) return Award
  return iconMap[icon.toLowerCase() as keyof typeof iconMap] ?? Award
}

export const dynamic = "force-dynamic"

export default async function InsigniasPage() {
  const badges = await getBadges()

  return (
    <>
      <PageHeader
        icon={Award}
        title="Insignias"
        description="Explora el catálogo de insignias del evento y consulta cuáles ya ganaste con tu código de inscripción."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-bold text-foreground">Consultar mis insignias</h2>
              <p className="text-sm text-muted-foreground">
                Ingresa tu código para ver las insignias que ya te fueron otorgadas.
              </p>
            </div>
            <ParticipantBadgesLookup />
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Catálogo público</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Estas son las insignias disponibles durante la actividad.
            </p>
          </div>

          {badges.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/70 bg-secondary/20 px-4 py-6 text-center text-sm text-muted-foreground">
              Aún no hay insignias creadas.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge) => {
                const Icon = getBadgeIcon(badge.icon)
                return (
                  <Card key={badge.id} className="border-border/70 shadow-sm">
                    <CardContent className="space-y-3 p-5">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">{badge.name}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {badge.description || "Insignia del evento"}
                        </p>
                      </div>
                      <Badge variant="secondary">{badge.points} puntos</Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
