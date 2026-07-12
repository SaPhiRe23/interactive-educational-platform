"use client"

import { useTransition } from "react"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { toggleParticipantCompleted } from "@/app/actions/admin"
import { cn } from "@/lib/utils"

export function ToggleCompletedButton({ id, completed }: { id: number; completed: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const res = await toggleParticipantCompleted(id, !completed)
          if (res?.ok === false) {
            toast.error("No se pudo actualizar.")
          } else {
            toast.success(!completed ? "Marcado como completado. Ya puede descargar su certificado." : "Marcado como pendiente.")
          }
        })
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        completed
          ? "border-accent/40 bg-accent/10 text-accent-foreground hover:bg-accent/20"
          : "border-border bg-secondary text-muted-foreground hover:bg-secondary/70",
      )}
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : completed ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <Circle className="h-3.5 w-3.5" />
      )}
      {completed ? "Completado" : "Pendiente"}
    </button>
  )
}
