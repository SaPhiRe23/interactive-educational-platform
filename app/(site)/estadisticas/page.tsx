import { BarChart3 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { getStats } from "@/lib/data"
import { PublicStatsDashboard } from "@/components/public-stats-dashboard"

export const dynamic = "force-dynamic"

export default async function EstadisticasPage() {
  const stats = await getStats()

  return (
    <>
      <PageHeader
        icon={BarChart3}
        title="Estadísticas del evento"
        description="Visualiza en tiempo real la participación, resultados de encuesta e impacto de las insignias."
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <PublicStatsDashboard stats={stats} />
      </div>
    </>
  )
}
