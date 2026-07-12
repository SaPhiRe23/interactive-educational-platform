import { getBadges } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeForm } from "@/components/admin/badge-form"
import { AwardBadgeForm } from "@/components/admin/award-badge-form"
import { BadgesManager } from "@/components/admin/badges-manager"

export default async function AdminBadgesPage() {
  const badges = await getBadges()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Insignias</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crea insignias y otórgalas a los participantes usando su código de inscripción.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Otorgar insignia</CardTitle>
        </CardHeader>
        <CardContent>
          <AwardBadgeForm badges={badges} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nueva insignia</CardTitle>
        </CardHeader>
        <CardContent>
          <BadgeForm />
        </CardContent>
      </Card>

      <BadgesManager badges={badges} />
    </div>
  )
}
