"use client"

import { useTransition } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

type ActionResult = { ok: boolean; message?: string }

export function DeleteButton({
  action,
  confirmText,
  successMessage = "Eliminado correctamente.",
}: {
  action: () => Promise<ActionResult>
  confirmText: string
  successMessage?: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="destructive"
      size="icon-sm"
      disabled={pending}
      onClick={() => {
        if (typeof window !== "undefined" && !window.confirm(confirmText)) return
        startTransition(async () => {
          const res = await action()
          if (res && res.ok === false) {
            toast.error(res.message ?? "No se pudo eliminar.")
          } else {
            toast.success(successMessage)
          }
        })
      }}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      <span className="sr-only">Eliminar</span>
    </Button>
  )
}
