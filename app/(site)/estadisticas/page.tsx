import { BarChart3 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { getPublicStats, getSurveyQuestionStats } from "@/lib/data"
import { PublicStatsDashboard } from "@/components/public-stats-dashboard"
import { QuestionStatsChart } from "@/components/question-stats-chart"

export const dynamic = "force-dynamic"

export default async function EstadisticasPage() {
  const [stats, questionStats] = await Promise.all([getPublicStats(), getSurveyQuestionStats()])

  return (
    <>
      <PageHeader
        icon={BarChart3}
        title="Estadísticas del evento"
        description="Visualiza en tiempo real la participación, resultados de encuesta e impacto de las insignias."
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <PublicStatsDashboard stats={stats} />

        {questionStats.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-heading text-xl font-bold text-foreground">Resultados de la encuesta</h2>
            <div className="grid gap-5 lg:grid-cols-2">
              {questionStats.map((q) => (
                <QuestionStatsChart key={q.id} result={q} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
