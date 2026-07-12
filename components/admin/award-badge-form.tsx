"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { awardBadge } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Badge as BadgeRow } from "@/lib/db/schema"

const initialState = { ok: false, message: "" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Otorgar insignia
    </Button>
  )
}

export function AwardBadgeForm({ badges }: { badges: BadgeRow[] }) {
  const [state, formAction] = useActionState(awardBadge, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const [badgeId, setBadgeId] = useState(badges[0] ? String(badges[0].id) : "")

  useEffect(() => {
    if (!state?.message) return
    if (state.ok) {
      toast.success(state.message)
      formRef.current?.reset()
    } else {
      toast.error(state.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  if (badges.length === 0) {
    return <p className="text-sm text-muted-foreground">Primero crea una insignia para poder otorgarla.</p>
  }

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <div className="grid gap-2">
        <Label htmlFor="code">Código del participante</Label>
        <Input id="code" name="code" required placeholder="PAT-XXXXXX" className="font-mono uppercase" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="badgeId">Insignia</Label>
        <input type="hidden" name="badgeId" value={badgeId} />
        <Select value={badgeId} onValueChange={setBadgeId}>
          <SelectTrigger id="badgeId">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {badges.map((b) => (
              <SelectItem key={b.id} value={String(b.id)}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SubmitButton />
    </form>
  )
}
