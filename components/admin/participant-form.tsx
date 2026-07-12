"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { updateParticipant } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Participant } from "@/lib/db/schema"

const initialState = { ok: false, message: "" }

const categoryOptions = [
  { value: "competidor", label: "Competidor" },
  { value: "recreativo", label: "Recreativo" },
  { value: "espectador", label: "Espectador" },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Guardar cambios
    </Button>
  )
}

export function ParticipantForm({ participant, onDone }: { participant: Participant; onDone: () => void }) {
  const [state, formAction] = useActionState(updateParticipant, initialState)
  const [category, setCategory] = useState(participant.category)

  useEffect(() => {
    if (!state?.message) return
    if (state.ok) {
      toast.success(state.message)
      onDone()
    } else {
      toast.error(state.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="id" value={participant.id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input id="fullName" name="fullName" required defaultValue={participant.fullName} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Correo</Label>
          <Input id="email" name="email" type="email" required defaultValue={participant.email} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" defaultValue={participant.phone ?? ""} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" name="city" defaultValue={participant.city ?? ""} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Categoría</Label>
          <input type="hidden" name="category" value={category} />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2 sm:w-56">
        <Label htmlFor="code">Código de inscripción</Label>
        <Input id="code" name="code" required defaultValue={participant.code} className="font-mono uppercase" />
        <p className="text-xs text-muted-foreground">Este código se usa para el certificado y las insignias.</p>
      </div>
      <div className="flex gap-2">
        <SubmitButton />
        <Button type="button" variant="outline" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
