"use client"

import { deleteBadge } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteButton } from "@/components/admin/delete-button"
import type { Badge } from "@/lib/db/schema"

export function BadgesManager({ badges }: { badges: Badge[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{badges.length} insignias creadas</CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aún no has creado insignias.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Descripción</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {badges.map((badge) => (
                <TableRow key={badge.id}>
                  <TableCell className="font-medium">{badge.name}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{badge.description ?? "—"}</TableCell>
                  <TableCell>{badge.points}</TableCell>
                  <TableCell className="text-right">
                    <DeleteButton
                      action={deleteBadge.bind(null, badge.id)}
                      confirmText={`¿Eliminar la insignia "${badge.name}"? También se quitará de quienes la tengan.`}
                      successMessage="Insignia eliminada."
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
