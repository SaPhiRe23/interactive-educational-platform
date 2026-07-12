"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createBadge } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialState = { ok: false, message: "" }

const colorOptions = [
  { value: "primary", label: "Naranja (primario)" },
  { value: "accent", label: "Cian (acento)" },
  { value: "secondary", label: "Gris (secundario)" },
  { value: "chart-1", label: "Color 1" },
  { value: "chart-2", label: "Color 2" },
  { value: "chart-3", label: "Color 3" },
  { value: "chart-4", label: "Color 4" },
  { value: "chart-5", label: "Color 5" },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Crear insignia
    </Button>
  )
}

export function BadgeForm() {
  const [state, formAction] = useActionState(createBadge, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const [color, setColor] = useState("primary")

  useEffect(() => {
    if (!state?.message) return
    if (state.ok) {
      toast.success(state.message)
      formRef.current?.reset()
      setColor("primary")
    } else {
      toast.error(state.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" required placeholder="Ej. Madrugador" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" placeholder="Cómo se gana esta insignia" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="icon">Ícono (lucide)</Label>
          <Input id="icon" name="icon" defaultValue="award" placeholder="award" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="color">Color</Label>
          <input type="hidden" name="color" value={color} />
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger id="color">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="points">Puntos</Label>
          <Input id="points" name="points" type="number" defaultValue={10} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sortOrder">Orden</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
        </div>
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  )
}
