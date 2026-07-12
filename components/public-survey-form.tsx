"use client"

import { useActionState, useEffect } from "react"
import { Loader2, Send } from "lucide-react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { submitSurvey } from "@/app/actions/public"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StarRatingInput } from "@/components/star-rating-input"
import type { SurveyQuestion } from "@/lib/db/schema"

const initialState = { ok: false, message: "" } as {
  ok: boolean
  message: string
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          Enviar encuesta
        </>
      )}
    </Button>
  )
}

function QuestionField({ question, index }: { question: SurveyQuestion; index: number }) {
  const name = `q_${question.id}`
  const options = (question.options ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)

  return (
    <div className="space-y-2 border-b border-border/60 pb-5 last:border-b-0 last:pb-0">
      <Label className="text-sm font-semibold text-foreground">
        {index + 1}. {question.label}
        {question.required && <span className="ml-1 text-primary">*</span>}
      </Label>

      {question.type === "stars" && (
        <StarRatingInput name={name} helperMin={question.helperMin} helperMax={question.helperMax} />
      )}

      {question.type === "yesno" && (
        <div className="flex gap-6 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name={name} value="Sí" required={question.required} />
            Sí
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name={name} value="No" required={question.required} />
            No
          </label>
        </div>
      )}

      {question.type === "single_choice" && (
        <div className="flex flex-col gap-2 text-sm">
          {options.map((opt) => (
            <label key={opt} className="inline-flex items-center gap-2">
              <input type="radio" name={name} value={opt} required={question.required} />
              {opt}
            </label>
          ))}
        </div>
      )}

      {question.type === "multi_choice" && (
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          {options.map((opt) => (
            <label key={opt} className="inline-flex items-center gap-2">
              <input type="checkbox" name={name} value={opt} />
              {opt}
            </label>
          ))}
        </div>
      )}

      {question.type === "text" && (
        <Textarea name={name} rows={3} required={question.required} placeholder="Escribe tu respuesta..." />
      )}
    </div>
  )
}

export function PublicSurveyForm({ questions }: { questions: SurveyQuestion[] }) {
  const [state, formAction] = useActionState(submitSurvey, initialState)

  useEffect(() => {
    if (!state.message) return
    if (state.ok) toast.success(state.message)
    else toast.error(state.message)
  }, [state])

  if (questions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/70 bg-secondary/20 px-4 py-10 text-center text-sm text-muted-foreground">
        La encuesta no está disponible en este momento.
      </p>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {questions.map((question, index) => (
        <QuestionField key={question.id} question={question} index={index} />
      ))}
      <SubmitButton />
    </form>
  )
}
