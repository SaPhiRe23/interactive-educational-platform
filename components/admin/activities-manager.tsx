"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { deleteActivity } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DeleteButton } from "@/components/admin/delete-button"
import { ActivityForm } from "@/components/admin/activity-form"
import type { Activity } from "@/lib/db/schema"

function formatDate(date: Date) {
  return new Date(date).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ActivitiesManager({ activities }: { activities: Activity[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{activities.length} actividades programadas</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Aún no has agregado actividades.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Día</TableHead>
                  <TableHead>Actividad</TableHead>
                  <TableHead className="hidden md:table-cell">Lugar</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) =>
                  editingId === activity.id ? (
                    <TableRow key={activity.id}>
                      <TableCell colSpan={5} className="bg-secondary/40 py-4">
                        <ActivityForm activity={activity} onDone={() => setEditingId(null)} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={activity.id}>
                      <TableCell className="text-muted-foreground">{activity.dayLabel ?? "—"}</TableCell>
                      <TableCell className="font-medium">{activity.title}</TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">{activity.location ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(activity.startsAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" size="icon-sm" onClick={() => setEditingId(activity.id)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <DeleteButton
                            action={deleteActivity.bind(null, activity.id)}
                            confirmText={`¿Eliminar la actividad "${activity.title}"?`}
                            successMessage="Actividad eliminada."
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
    </div>
  )
}
