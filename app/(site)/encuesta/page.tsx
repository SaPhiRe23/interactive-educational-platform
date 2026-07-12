import { ClipboardCheck } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { PublicSurveyForm } from "@/components/public-survey-form"

export default function EncuestaPage() {
  return (
    <>
      <PageHeader
        icon={ClipboardCheck}
        title="Encuesta de satisfacción"
        description="Tu opinión nos ayuda a mejorar futuras actividades en el Patinódromo."
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">Comparte tu experiencia</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Responde en menos de 2 minutos.
              </p>
            </div>
            <PublicSurveyForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
