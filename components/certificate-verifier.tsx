"use client"

import { useState } from "react"
import { Download, Loader2, MailCheck, ScrollText } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CertificateVerifier() {
  const [email, setEmail] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      toast.error("Ingresa un correo electrónico.")
      return
    }

    setPending(true)
    try {
      const response = await fetch(`/api/certificado?email=${encodeURIComponent(cleanEmail)}`)
      const contentType = response.headers.get("content-type") ?? ""

      if (!response.ok) {
        const data = contentType.includes("application/json") ? await response.json() : null
        toast.error(data?.message ?? "No se pudo generar el certificado.")
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `certificado-${cleanEmail.replace(/[^a-z0-9]+/g, "-") || "participante"}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success("Certificado descargado.")
    } catch {
      toast.error("Ocurrió un error al verificar el correo.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico registrado</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tucorreo@ejemplo.com"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="sm:flex-1" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Verificar y descargar PDF
            </>
          )}
        </Button>
        <Button type="button" variant="outline" className="sm:flex-1 bg-transparent" onClick={() => setEmail("")}>
          <MailCheck className="h-4 w-4" />
          Limpiar correo
        </Button>
      </div>
    </form>
  )
}