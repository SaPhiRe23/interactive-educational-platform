import { getSettings } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "@/components/admin/settings-form"

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Configuración general</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estos datos se muestran en toda la plataforma pública (inicio, encabezado, pie de página).
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Datos del evento</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  )
}
