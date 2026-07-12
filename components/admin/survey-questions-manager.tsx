"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { deleteSurveyQuestion } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteButton } from "@/components/admin/delete-button"
import { SurveyQuestionForm } from "@/components/admin/survey-question-form"
import { ToggleQuestionActiveButton } from "@/components/admin/toggle-question-active-button"
import { QUESTION_TYPES } from "@/lib/survey-options"
import type { SurveyQuestion } from "@/lib/db/schema"

const typeLabels = Object.fromEntries(QUESTION_TYPES.map((t) => [t.value, t.label]))

export function SurveyQuestionsManager({ questions }: { questions: SurveyQuestion[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{questions.length} preguntas configuradas</CardTitle>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aún no has creado ninguna pregunta.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pregunta</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q) =>
                editingId === q.id ? (
                  <TableRow key={q.id}>
                    <TableCell colSpan={4} className="bg-secondary/40 py-4">
                      <SurveyQuestionForm question={q} onDone={() => setEditingId(null)} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={q.id}>
                    <TableCell className="max-w-md font-medium">{q.label}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{typeLabels[q.type] ?? q.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <ToggleQuestionActiveButton id={q.id} active={q.active} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="icon-sm" onClick={() => setEditingId(q.id)}>
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <DeleteButton
                          action={deleteSurveyQuestion.bind(null, q.id)}
                          confirmText={`¿Eliminar la pregunta "${q.label}"? También se borrarán las respuestas ya dadas a esta pregunta.`}
                          successMessage="Pregunta eliminada."
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
