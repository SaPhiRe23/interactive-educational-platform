"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { updateStatSettings } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState = { ok: false, message: "" }

type MetricRow = {
  key: string
  label: string
  rawValue: number
  visible: boolean
  overridden: boolean
  value: number
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Guardar estadísticas
    </Button>
  )
}

export function StatsSettingsForm({ metrics }: { metrics: MetricRow[] }) {
  const [state, formAction] = useActionState(updateStatSettings, initialState)

  useEffect(() => {
    if (!state?.message) return
    if (state.ok) toast.success(state.message)
    else toast.error(state.message)
  }, [state])

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.key}
            className="grid gap-3 rounded-lg border border-border bg-secondary/30 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{metric.label}</p>
              <p className="text-xs text-muted-foreground">
                Valor real actual: <span className="font-mono">{metric.rawValue}</span>
                {metric.overridden && " (mostrando un valor manual en vez de este)"}
              </p>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor={`override_${metric.key}`} className="text-xs text-muted-foreground">
                Valor manual (opcional)
              </Label>
              <Input
                id={`override_${metric.key}`}
                name={`override_${metric.key}`}
                type="text"
                inputMode="decimal"
                placeholder="Dejar vacío = usar el real"
                defaultValue={metric.overridden ? String(metric.value) : ""}
                className="w-40"
              />
            </div>

            <label className="flex items-center gap-2 self-end text-sm text-foreground sm:self-center">
              <input
                type="checkbox"
                name={`visible_${metric.key}`}
                defaultChecked={metric.visible}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              Mostrar
            </label>
          </div>
        ))}
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  )
}
