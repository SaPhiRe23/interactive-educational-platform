import { getActivities } from "@/lib/data"
import { ActivitiesManager } from "@/components/admin/activities-manager"

export default async function AdminActivitiesPage() {
  const activities = await getActivities()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Cronograma de actividades</h1>
        <p className="mt-1 text-sm text-muted-foreground">Estas actividades se muestran públicamente en la página de Cronograma.</p>
      </div>
      <ActivitiesManager activities={activities} />
    </div>
  )
}
