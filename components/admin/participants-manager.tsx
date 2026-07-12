"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { deleteParticipant } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleCompletedButton } from "@/components/admin/toggle-completed-button"
import { DeleteButton } from "@/components/admin/delete-button"
import { ParticipantForm } from "@/components/admin/participant-form"
import type { Participant } from "@/lib/db/schema"

const categoryLabels: Record<string, string> = {
  competidor: "Competidor",
  recreativo: "Recreativo",
  espectador: "Espectador",
}

export function ParticipantsManager({ participants }: { participants: Participant[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
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
              {participants.map((p) =>
                editingId === p.id ? (
                  <TableRow key={p.id}>
                    <TableCell colSpan={7} className="bg-secondary/40 py-4">
                      <ParticipantForm participant={p} onDone={() => setEditingId(null)} />
                    </TableCell>
                  </TableRow>
                ) : (
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
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="icon-sm" onClick={() => setEditingId(p.id)}>
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <DeleteButton
                          action={deleteParticipant.bind(null, p.id)}
                          confirmText={`¿Eliminar la inscripción de ${p.fullName}? Esta acción no se puede deshacer.`}
                          successMessage="Participante eliminado."
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
