"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createSurveyQuestion, updateSurveyQuestion } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QUESTION_TYPES } from "@/lib/survey-options"
import type { SurveyQuestion } from "@/lib/db/schema"

const initialState = { ok: false, message: "" }

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  )
}

export function SurveyQuestionForm({ question, onDone }: { question?: SurveyQuestion; onDone?: () => void }) {
  const isEdit = Boolean(question)
  const action = isEdit ? updateSurveyQuestion : createSurveyQuestion
  const [state, formAction] = useActionState(action, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const [type, setType] = useState(question?.type ?? "text")

  const needsOptions = type === "single_choice" || type === "multi_choice"
  const isStars = type === "stars"

  useEffect(() => {
    if (!state?.message) return
    if (state.ok) {
      toast.success(state.message)
      if (!isEdit) {
        formRef.current?.reset()
        setType("text")
      }
      onDone?.()
    } else {
      toast.error(state.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      {isEdit && <input type="hidden" name="id" value={question!.id} />}

      <div className="grid gap-2">
        <Label htmlFor="label">Pregunta</Label>
        <Textarea id="label" name="label" required defaultValue={question?.label} rows={2} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="type">Tipo de respuesta</Label>
          <input type="hidden" name="type" value={type} />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sortOrder">Orden</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={question?.sortOrder ?? 0} />
        </div>
      </div>

      {needsOptions && (
        <div className="grid gap-2">
          <Label htmlFor="options">Opciones (separadas por coma)</Label>
          <Textarea
            id="options"
            name="options"
            rows={2}
            defaultValue={question?.options ?? ""}
            placeholder="Sí, No, Parcialmente"
          />
        </div>
      )}

      {isStars && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="helperMin">Etiqueta para 1 estrella</Label>
            <Input id="helperMin" name="helperMin" defaultValue={question?.helperMin ?? "Nada"} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="helperMax">Etiqueta para 5 estrellas</Label>
            <Input id="helperMax" name="helperMax" defaultValue={question?.helperMax ?? "Muchísimo"} />
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="required"
          defaultChecked={question?.required ?? true}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        Obligatoria
      </label>

      <div className="flex gap-2">
        <SubmitButton label={isEdit ? "Guardar cambios" : "Agregar pregunta"} />
        {isEdit && onDone && (
          <Button type="button" variant="outline" onClick={onDone}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
