"use client"

import { useTransition } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { toggleSurveyQuestionActive } from "@/app/actions/admin"
import { cn } from "@/lib/utils"

export function ToggleQuestionActiveButton({ id, active }: { id: number; active: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const res = await toggleSurveyQuestionActive(id, !active)
          if (res?.ok === false) toast.error("No se pudo actualizar.")
          else toast.success(!active ? "Pregunta activada." : "Pregunta desactivada.")
        })
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-accent/40 bg-accent/10 text-accent-foreground hover:bg-accent/20"
          : "border-border bg-secondary text-muted-foreground hover:bg-secondary/70",
      )}
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : active ? (
        <Eye className="h-3.5 w-3.5" />
      ) : (
        <EyeOff className="h-3.5 w-3.5" />
      )}
      {active ? "Activa" : "Oculta"}
    </button>
  )
}
