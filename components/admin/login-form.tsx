"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Loader2, Lock } from "lucide-react"
import { loginAdmin } from "@/app/actions/admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState = { ok: false, message: "" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Verificando...
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          Entrar
        </>
      )}
    </Button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAdmin, initialState)

  useEffect(() => {
    if (state?.message && !state.ok) toast.error(state.message)
  }, [state])

  return (
    <Card>
      <CardContent className="py-6">
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required autoFocus placeholder="••••••••" />
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
