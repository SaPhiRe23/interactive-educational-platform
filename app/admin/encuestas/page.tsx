import { getSurveyResponses } from "@/lib/data"
import { SurveysManager } from "@/components/admin/surveys-manager"

export default async function AdminSurveysPage() {
  const responses = await getSurveyResponses()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Encuestas de satisfacción</h1>
        <p className="mt-1 text-sm text-muted-foreground">Respuestas enviadas por los visitantes al finalizar el evento.</p>
      </div>
      <SurveysManager responses={responses} />
    </div>
  )
}
