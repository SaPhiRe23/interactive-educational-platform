import { ScrollText, ShieldCheck, FileDown } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { CertificateVerifier } from "@/components/certificate-verifier"

export default function CertificadoPage() {
  return (
    <>
      <PageHeader
        icon={ScrollText}
        title="Certificado digital"
        description="Verifica tu inscripción con el correo registrado y descarga tu certificado en PDF si el correo corresponde a una inscripción válida."
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm font-medium text-foreground">Validación por correo</p>
                <p className="mt-1 text-xs text-muted-foreground">Solo necesitas el email con el que te registraste.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                <FileDown className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm font-medium text-foreground">Descarga PDF</p>
                <p className="mt-1 text-xs text-muted-foreground">Si tu correo coincide con una inscripción, el archivo se descarga al instante.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                <ScrollText className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm font-medium text-foreground">Certificado oficial</p>
                <p className="mt-1 text-xs text-muted-foreground">Documento de participación de la propuesta del Patinódromo.</p>
              </div>
            </div>

            <CertificateVerifier />
          </CardContent>
        </Card>
      </div>
    </>
  )
}