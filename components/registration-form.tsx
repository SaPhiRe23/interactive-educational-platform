"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { toast } from "sonner"
import { CheckCircle2, Copy, Loader2 } from "lucide-react"
import { registerParticipant } from "@/app/actions/public"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState = { ok: false, message: "" } as {
  ok: boolean
  message: string
  code?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        "Completar inscripción"
      )}
    </Button>
  )
}

export function RegistrationForm({ open }: { open: boolean }) {
  const [state, formAction] = useActionState(registerParticipant, initialState)

  useEffect(() => {
    if (state.message && !state.ok) toast.error(state.message)
  }, [state])

  if (state.ok && state.code) {
    return (
      <Card className="mx-auto max-w-lg border-accent/40">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <CheckCircle2 className="h-14 w-14 text-accent" />
          <h2 className="font-heading text-2xl font-bold text-foreground">¡Inscripción exitosa!</h2>
          <p className="text-muted-foreground text-pretty">
            Guarda tu código de participante. Lo necesitarás para consultar tus insignias y descargar tu
            certificado.
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(state.code!)
              toast.success("Código copiado")
            }}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 font-mono text-xl font-bold tracking-widest text-foreground transition-colors hover:bg-secondary/70"
          >
            {state.code}
            <Copy className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="mt-2 flex gap-3">
            <Button asChild variant="outline">
              <Link href="/cronograma">Ver cronograma</Link>
            </Button>
            <Button asChild>
              <Link href="/certificado">Mi certificado</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!open) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="py-10 text-center">
          <h2 className="font-heading text-xl font-bold text-foreground">Inscripciones cerradas</h2>
          <p className="mt-2 text-muted-foreground">
            Las inscripciones no están disponibles por el momento. Vuelve pronto.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="py-8">
        <form action={formAction} className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" name="fullName" required placeholder="Ej. Ana María Torres" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" name="email" type="email" required placeholder="tucorreo@ejemplo.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" placeholder="300 000 0000" />
            </div>
          </div>
          <SubmitButton />
          <p className="text-center text-xs text-muted-foreground">
            Al inscribirte aceptas participar en las actividades del evento.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
