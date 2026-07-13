import { getAllSurveyQuestions, getPublicStats } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsSettingsForm } from "@/components/admin/stats-settings-form"
import { SurveyStatsDisplayForm } from "@/components/admin/survey-stats-display-form"

export default async function AdminStatsSettingsPage() {
  const [{ metrics }, questions] = await Promise.all([getPublicStats(), getAllSurveyQuestions()])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Estadísticas públicas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Controla todo lo que se muestra en el inicio y en la página de Estadísticas desde aquí.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métricas generales</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsSettingsForm metrics={metrics} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados de la encuesta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Elige qué preguntas de la encuesta (creadas en <code>/admin/encuestas</code>) se muestran públicamente en{" "}
            <code>/estadisticas</code>, y con qué tipo de gráfica.
          </p>
          <SurveyStatsDisplayForm questions={questions} />
        </CardContent>
      </Card>
    </div>
  )
}
