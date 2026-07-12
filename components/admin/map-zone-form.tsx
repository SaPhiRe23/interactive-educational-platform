"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createMapZone, updateMapZone } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MapZone } from "@/lib/db/schema"

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

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  )
}

export function MapZoneForm({ zone, onDone }: { zone?: MapZone; onDone?: () => void }) {
  const isEdit = Boolean(zone)
  const action = isEdit ? updateMapZone : createMapZone
  const [state, formAction] = useActionState(action, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const [color, setColor] = useState(zone?.color ?? "primary")

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
      {isEdit && <input type="hidden" name="id" value={zone!.id} />}
      <div className="grid gap-2">
        <Label htmlFor="name">Nombre de la zona</Label>
        <Input id="name" name="name" required defaultValue={zone?.name} placeholder="Ej. Pista principal" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" defaultValue={zone?.description ?? ""} placeholder="Qué encontrarán ahí los visitantes" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="icon">Ícono (lucide)</Label>
          <Input id="icon" name="icon" defaultValue={zone?.icon ?? "map-pin"} placeholder="map-pin" />
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
        <div className="grid gap-2">
          <Label htmlFor="sortOrder">Orden</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={zone?.sortOrder ?? 0} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="posX">Posición horizontal (0-100%)</Label>
          <Input id="posX" name="posX" type="number" min={0} max={100} step="0.1" defaultValue={zone?.posX ?? 50} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="posY">Posición vertical (0-100%)</Label>
          <Input id="posY" name="posY" type="number" min={0} max={100} step="0.1" defaultValue={zone?.posY ?? 50} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        La posición ubica el punto sobre la imagen del mapa: 0% es la esquina superior/izquierda y 100% la esquina inferior/derecha.
      </p>
      <div className="flex gap-2">
        <SubmitButton label={isEdit ? "Guardar cambios" : "Agregar zona"} />
        {isEdit && onDone && (
          <Button type="button" variant="outline" onClick={onDone}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
