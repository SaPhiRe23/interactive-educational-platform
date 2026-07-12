"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { updateSettings } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState = { ok: false, message: "" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Guardar configuración
    </Button>
  )
}

export function SettingsForm({
  settings,
}: {
  settings: {
    eventName: string
    eventTagline: string
    eventDates: string
    eventLocation: string
    registrationOpen: boolean
  }
}) {
  const [state, formAction] = useActionState(updateSettings, initialState)

  useEffect(() => {
    if (!state?.message) return
    if (state.ok) toast.success(state.message)
    else toast.error(state.message)
  }, [state])

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="eventName">Nombre del evento</Label>
        <Input id="eventName" name="eventName" required defaultValue={settings.eventName} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="eventTagline">Frase / lema</Label>
        <Input id="eventTagline" name="eventTagline" defaultValue={settings.eventTagline} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="eventDates">Fechas</Label>
          <Input id="eventDates" name="eventDates" defaultValue={settings.eventDates} placeholder="Ej. 15 y 16 de agosto de 2026" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="eventLocation">Lugar</Label>
          <Input id="eventLocation" name="eventLocation" defaultValue={settings.eventLocation} />
        </div>
      </div>
      <label className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm text-foreground">
        <input
          type="checkbox"
          name="registrationOpen"
          defaultChecked={settings.registrationOpen}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        Las inscripciones están abiertas
      </label>
      <div>
        <SubmitButton />
      </div>
    </form>
  )
}
