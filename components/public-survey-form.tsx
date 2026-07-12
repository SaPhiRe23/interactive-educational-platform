"use client"

import { useActionState, useEffect } from "react"
import { Loader2, Send } from "lucide-react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { submitSurvey } from "@/app/actions/public"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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

export function PublicSurveyForm() {
  const [state, formAction] = useActionState(submitSurvey, initialState)

  useEffect(() => {
    if (!state.message) return
    if (state.ok) toast.success(state.message)
    else toast.error(state.message)
  }, [state])

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="overallRating">Calificación general (1-5)</Label>
          <Input id="overallRating" name="overallRating" type="number" min={1} max={5} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizationRating">Organización (1-5)</Label>
          <Input id="organizationRating" name="organizationRating" type="number" min={1} max={5} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="venueRating">Recinto (1-5)</Label>
          <Input id="venueRating" name="venueRating" type="number" min={1} max={5} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>¿Recomendarías el evento?</Label>
        <div className="flex gap-6 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="wouldRecommend" value="yes" required />
            Sí
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="wouldRecommend" value="no" required />
            No
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comentario</Label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Cuéntanos qué fue lo que más te gustó y qué mejorarías."
          rows={5}
        />
      </div>

      <SubmitButton />
    </form>
  )
}
