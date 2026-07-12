import { getPublicStats } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsSettingsForm } from "@/components/admin/stats-settings-form"

export default async function AdminStatsSettingsPage() {
  const { metrics } = await getPublicStats()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Estadísticas públicas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Elige qué métricas se muestran en el inicio y en la página de Estadísticas, y opcionalmente escribe un
          número manual para mostrar en vez del real (por ejemplo, mientras terminan de cargar los datos).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsSettingsForm metrics={metrics} />
        </CardContent>
      </Card>
    </div>
  )
}
