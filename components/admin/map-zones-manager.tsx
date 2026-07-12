"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { deleteMapZone } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DeleteButton } from "@/components/admin/delete-button"
import { MapZoneForm } from "@/components/admin/map-zone-form"
import type { MapZone } from "@/lib/db/schema"

export function MapZonesManager({ zones }: { zones: MapZone[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva zona</CardTitle>
        </CardHeader>
        <CardContent>
          <MapZoneForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{zones.length} zonas del patinódromo</CardTitle>
        </CardHeader>
        <CardContent>
          {zones.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Aún no has agregado zonas al mapa.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zona</TableHead>
                  <TableHead className="hidden md:table-cell">Ícono</TableHead>
                  <TableHead className="hidden sm:table-cell">Posición</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((zone) =>
                  editingId === zone.id ? (
                    <TableRow key={zone.id}>
                      <TableCell colSpan={4} className="bg-secondary/40 py-4">
                        <MapZoneForm zone={zone} onDone={() => setEditingId(null)} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">{zone.icon}</TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {zone.posX.toFixed(0)}%, {zone.posY.toFixed(0)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" size="icon-sm" onClick={() => setEditingId(zone.id)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <DeleteButton
                            action={deleteMapZone.bind(null, zone.id)}
                            confirmText={`¿Eliminar la zona "${zone.name}"?`}
                            successMessage="Zona eliminada."
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
