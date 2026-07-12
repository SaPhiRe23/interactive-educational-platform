"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type BadgeItem = {
  id: number
  name: string
  description: string | null
  points: number
}

type LookupResult = {
  participant: { fullName: string; code: string }
  badges: BadgeItem[]
}

export function ParticipantBadgesLookup() {
  const [code, setCode] = useState("")
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<LookupResult | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanCode = code.trim().toUpperCase()

    if (!cleanCode) {
      toast.error("Ingresa tu código de inscripción.")
      return
    }

    setPending(true)
    try {
      const response = await fetch(
        `/api/insignias/participante?code=${encodeURIComponent(cleanCode)}`,
      )
      const data = await response.json()

      if (!response.ok) {
        setResult(null)
        toast.error(data?.message ?? "No se pudo consultar tus insignias.")
        return
      }

      setResult({ participant: data.participant, badges: data.badges ?? [] })
      if ((data.badges ?? []).length === 0) {
        toast.message("Aún no tienes insignias otorgadas.")
      }
    } catch {
      setResult(null)
      toast.error("Ocurrió un error al consultar tus insignias.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="participantCode">Código de inscripción</Label>
          <Input
            id="participantCode"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Ej. PAT-AB12CD"
            required
          />
        </div>
        <Button type="submit" disabled={pending}>
          <Search className="h-4 w-4" />
          {pending ? "Buscando..." : "Ver mis insignias"}
        </Button>
      </form>

      {result && (
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-sm text-muted-foreground">Participante</p>
              <p className="font-semibold text-foreground">{result.participant.fullName}</p>
              <p className="font-mono text-xs text-muted-foreground">{result.participant.code}</p>
            </div>

            {result.badges.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Todavía no hay insignias registradas para tu código.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {result.badges.map((badge) => (
                  <article key={badge.id} className="rounded-xl border border-border/70 bg-secondary/30 p-4">
                    <p className="font-medium text-foreground">{badge.name}</p>
                    {badge.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
                    )}
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
                      {badge.points} pts
                    </p>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
