import { UserPlus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { RegistrationForm } from "@/components/registration-form"
import { getSettings } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function InscripcionPage() {
  const settings = await getSettings()
  return (
    <>
      <PageHeader
        icon={UserPlus}
        title="Inscripción de participantes"
        description="Regístrate para el evento. Recibirás un código único con el que podrás consultar tus insignias y descargar tu certificado."
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <RegistrationForm open={settings.registrationOpen} />
      </div>
    </>
  )
}
