import { getAllSurveyQuestions, getSurveyResponsesWithAnswers } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SurveysManager } from "@/components/admin/surveys-manager"
import { SurveyQuestionForm } from "@/components/admin/survey-question-form"
import { SurveyQuestionsManager } from "@/components/admin/survey-questions-manager"
import { SeedSurveyQuestionsButton } from "@/components/admin/seed-survey-questions-button"

export default async function AdminSurveysPage() {
  const [questions, responses] = await Promise.all([getAllSurveyQuestions(), getSurveyResponsesWithAnswers()])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Encuesta de satisfacción</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Diseña las preguntas que verán los visitantes en <code>/encuesta</code> y revisa las respuestas recibidas.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle>Preguntas</CardTitle>
          {questions.length === 0 && <SeedSurveyQuestionsButton />}
        </CardHeader>
        <CardContent>
          <SurveyQuestionForm />
        </CardContent>
      </Card>

      <SurveyQuestionsManager questions={questions} />

      <SurveysManager responses={responses} />
    </div>
  )
}
