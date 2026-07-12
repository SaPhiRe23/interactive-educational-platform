import { getParticipants } from "@/lib/data"
import { deleteParticipant } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleCompletedButton } from "@/components/admin/toggle-completed-button"
import { DeleteButton } from "@/components/admin/delete-button"

const categoryLabels: Record<string, string> = {
  competidor: "Competidor",
  recreativo: "Recreativo",
  espectador: "Espectador",
}

export default async function AdminParticipantsPage() {
  const participants = await getParticipants()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Participantes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Marca como "Completado" a quienes terminen sus actividades para habilitar su certificado digital.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{participants.length} inscritos</CardTitle>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Todavía no hay inscripciones.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Correo</TableHead>
                  <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                  <TableHead className="hidden lg:table-cell">Ciudad</TableHead>
                  <TableHead>Certificado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs font-semibold">{p.code}</TableCell>
                    <TableCell className="font-medium">{p.fullName}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{p.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{categoryLabels[p.category] ?? p.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">{p.city ?? "—"}</TableCell>
                    <TableCell>
                      <ToggleCompletedButton id={p.id} completed={p.completed} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DeleteButton
                        action={deleteParticipant.bind(null, p.id)}
                        confirmText={`¿Eliminar la inscripción de ${p.fullName}? Esta acción no se puede deshacer.`}
                        successMessage="Participante eliminado."
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
