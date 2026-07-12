"use client"

import { deleteSurveyResponse } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DeleteButton } from "@/components/admin/delete-button"
import type { SurveyResponse } from "@/lib/db/schema"

function formatDate(date: Date) {
  return new Date(date).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function SurveysManager({ responses }: { responses: SurveyResponse[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{responses.length} respuestas recibidas</CardTitle>
      </CardHeader>
      <CardContent>
        {responses.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aún no se han recibido encuestas.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>General</TableHead>
                <TableHead className="hidden sm:table-cell">Organización</TableHead>
                <TableHead className="hidden sm:table-cell">Recinto</TableHead>
                <TableHead className="hidden md:table-cell">Recomienda</TableHead>
                <TableHead className="hidden lg:table-cell">Comentario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                  <TableCell className="font-semibold">{r.overallRating}/5</TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {r.organizationRating ? `${r.organizationRating}/5` : "—"}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {r.venueRating ? `${r.venueRating}/5` : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {r.wouldRecommend === null ? (
                      "—"
                    ) : (
                      <Badge variant={r.wouldRecommend ? "default" : "outline"}>{r.wouldRecommend ? "Sí" : "No"}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden max-w-xs truncate text-muted-foreground lg:table-cell">
                    {r.comment || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteButton
                      action={deleteSurveyResponse.bind(null, r.id)}
                      confirmText="¿Eliminar esta respuesta de encuesta?"
                      successMessage="Respuesta eliminada."
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
