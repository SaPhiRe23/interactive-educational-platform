"use client"

import { useState, Fragment } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { deleteSurveyResponse } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DeleteButton } from "@/components/admin/delete-button"

type ResponseWithAnswers = {
  id: number
  createdAt: Date
  answers: { question: string; type: string; value: string }[]
}

function formatDate(date: Date) {
  return new Date(date).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatAnswerValue(type: string, value: string) {
  return type === "stars" ? "★".repeat(Number(value) || 0) + ` (${value}/5)` : value
}

export function SurveysManager({ responses }: { responses: ResponseWithAnswers[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

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
                <TableHead>Respuestas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((r) => (
                <Fragment key={r.id}>
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 px-2"
                        onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      >
                        {expandedId === r.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        {r.answers.length} respuesta{r.answers.length === 1 ? "" : "s"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DeleteButton
                        action={deleteSurveyResponse.bind(null, r.id)}
                        confirmText="¿Eliminar esta respuesta de encuesta?"
                        successMessage="Respuesta eliminada."
                      />
                    </TableCell>
                  </TableRow>
                  {expandedId === r.id && (
                    <TableRow>
                      <TableCell colSpan={3} className="bg-secondary/30">
                        {r.answers.length === 0 ? (
                          <p className="py-2 text-sm text-muted-foreground">Sin respuestas registradas.</p>
                        ) : (
                          <dl className="grid gap-3 py-2 sm:grid-cols-2">
                            {r.answers.map((a, i) => (
                              <div key={i}>
                                <dt className="text-xs font-medium text-muted-foreground">{a.question}</dt>
                                <dd className="text-sm font-medium text-foreground">{formatAnswerValue(a.type, a.value)}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
