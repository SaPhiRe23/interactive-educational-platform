"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createActivity, updateActivity } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Activity } from "@/lib/db/schema"

const initialState = { ok: false, message: "" }

function toLocalInputValue(date: Date | null) {
  if (!date) return ""
  const d = new Date(date)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  )
}

export function ActivityForm({ activity, onDone }: { activity?: Activity; onDone?: () => void }) {
  const isEdit = Boolean(activity)
  const action = isEdit ? updateActivity : createActivity
  const [state, formAction] = useActionState(action, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state?.message) return
    if (state.ok) {
      toast.success(state.message)
      if (!isEdit) formRef.current?.reset()
      onDone?.()
    } else {
      toast.error(state.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      {isEdit && <input type="hidden" name="id" value={activity!.id} />}
      <div className="grid gap-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" required defaultValue={activity?.title} placeholder="Ej. Carrera de velocidad" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" defaultValue={activity?.description ?? ""} placeholder="Detalles de la actividad" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="dayLabel">Día</Label>
          <Input id="dayLabel" name="dayLabel" defaultValue={activity?.dayLabel ?? ""} placeholder="Ej. Sábado" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Lugar</Label>
          <Input id="location" name="location" defaultValue={activity?.location ?? ""} placeholder="Ej. Pista principal" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="startsAt">Inicio</Label>
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            required
            defaultValue={toLocalInputValue(activity?.startsAt ?? null)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endsAt">Fin (opcional)</Label>
          <Input id="endsAt" name="endsAt" type="datetime-local" defaultValue={toLocalInputValue(activity?.endsAt ?? null)} />
        </div>
      </div>
      <div className="grid gap-2 sm:w-40">
        <Label htmlFor="sortOrder">Orden</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={activity?.sortOrder ?? 0} />
      </div>
      <div className="flex gap-2">
        <SubmitButton label={isEdit ? "Guardar cambios" : "Agregar actividad"} />
        {isEdit && onDone && (
          <Button type="button" variant="outline" onClick={onDone}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
