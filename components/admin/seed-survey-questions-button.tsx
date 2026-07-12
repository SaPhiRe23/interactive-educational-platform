"use client"

import { useTransition } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { seedDefaultSurveyQuestions } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"

export function SeedSurveyQuestionsButton() {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const res = await seedDefaultSurveyQuestions()
          if (res?.ok === false) toast.error(res.message ?? "No se pudo crear las preguntas.")
          else toast.success(res?.message ?? "Preguntas creadas.")
        })
      }}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      Crear las 7 preguntas sugeridas
    </Button>
  )
}
