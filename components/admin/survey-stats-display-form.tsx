"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { updateSurveyQuestionsDisplay } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CHART_TYPES, QUESTION_TYPES } from "@/lib/survey-options"
import type { SurveyQuestion } from "@/lib/db/schema"

const initialState = { ok: false, message: "" }

const typeLabels = Object.fromEntries(QUESTION_TYPES.map((t) => [t.value, t.label]))

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Guardar
    </Button>
  )
}

function QuestionRow({ question }: { question: SurveyQuestion }) {
  const [visible, setVisible] = useState(question.showInStats)
  const [chartType, setChartType] = useState(question.chartType)
  const isText = question.type === "text"

  return (
    <div className="grid gap-3 rounded-lg border border-border bg-secondary/30 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{question.label}</p>
        <p className="text-xs text-muted-foreground">{typeLabels[question.type] ?? question.type}</p>
      </div>

      {!isText ? (
        <div className="w-44">
          <input type="hidden" name={`chart_${question.id}`} value={chartType} />
          <Select value={chartType} onValueChange={setChartType} disabled={!visible}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHART_TYPES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground sm:w-44">Se muestra como lista de citas</p>
      )}

      <label className="flex items-center gap-2 self-end text-sm text-foreground sm:self-center">
        <input
          type="checkbox"
          name={`visible_${question.id}`}
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        Mostrar
      </label>
    </div>
  )
}

export function SurveyStatsDisplayForm({ questions }: { questions: SurveyQuestion[] }) {
  const [state, formAction] = useActionState(updateSurveyQuestionsDisplay, initialState)

  useEffect(() => {
    if (!state?.message) return
    if (state.ok) toast.success(state.message)
    else toast.error(state.message)
  }, [state])

  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no has creado preguntas de encuesta. Ve a <code>/admin/encuestas</code> para crearlas primero.
      </p>
    )
  }

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-3">
        {questions.map((q) => (
          <QuestionRow key={q.id} question={q} />
        ))}
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  )
}
