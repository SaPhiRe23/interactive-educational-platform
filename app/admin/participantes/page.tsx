import { getParticipants } from "@/lib/data"
import { ParticipantsManager } from "@/components/admin/participants-manager"

export default async function AdminParticipantsPage() {
  const participants = await getParticipants()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Participantes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edita la información de un participante, marca como "Completado" a quienes terminen sus actividades para
          habilitar su certificado digital, o elimínalo si fue un registro por error.
        </p>
      </div>

      <ParticipantsManager participants={participants} />
    </div>
  )
}
