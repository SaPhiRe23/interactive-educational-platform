"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { MapZone } from "@/lib/db/schema"
import MuralHuellas from "@/components/admin/mural-huellas" 
import Momento2Historias from "@/components/admin/mapa/momento-2-historias" // 📖 Importada correctamente

type ZoneItem = Pick<MapZone, "id" | "name" | "description" | "posX" | "posY">

export function SiteMapViewer({
  imageUrl,
  zones,
}: {
  imageUrl: string
  zones: ZoneItem[]
}) {
  const sortedZones = useMemo(
    () => [...zones].sort((a, b) => a.id - b.id),
    [zones],
  )

  const [selectedId, setSelectedId] = useState<number | null>(
    sortedZones[0]?.id ?? null,
  )

  // Estado para controlar la visibilidad del modal de Huellas (Punto 1)
  const [showMural, setShowMural] = useState(false)

  // 📖 Estado para controlar la visibilidad del modal de Historias (Punto 2)
  const [showHistorias, setShowHistorias] = useState(false)

  const selectedZone =
    sortedZones.find((zone) => zone.id === selectedId) ?? sortedZones[0] ?? null

  // Identificamos si el punto que el usuario está viendo actualmente es el Punto 1
  const isZoneOneSelected = useMemo(() => {
    if (!selectedZone) return false
    return sortedZones.findIndex((z) => z.id === selectedZone.id) === 0
  }, [selectedZone, sortedZones])

  // 📖 Identificamos si el punto que el usuario está viendo actualmente es el Punto 2
  const isZoneTwoSelected = useMemo(() => {
    if (!selectedZone) return false
    return sortedZones.findIndex((z) => z.id === selectedZone.id) === 1
  }, [selectedZone, sortedZones])

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-border/70 shadow-sm">
        <CardContent className="p-0">
          <div className="relative aspect-[16/10] w-full bg-muted">
            <Image
              src={imageUrl}
              alt="Mapa del Patinódromo"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 70vw"
            />

            {sortedZones.map((zone, index) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => {
                  setSelectedId(zone.id)
                  // 👣 Si presionan el botón "1" (index === 0), abrimos el modal interactivo
                  if (index === 0) {
                    setShowMural(true)
                  }
                  // 📖 Si presionan el botón "2" (index === 1), abrimos el modal de las historias
                  if (index === 1) {
                    setShowHistorias(true)
                  }
                }}
                style={{ left: `${zone.posX}%`, top: `${zone.posY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                aria-label={zone.name}
                title={zone.name}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-md transition-transform ${selectedZone?.id === zone.id ? "scale-110 bg-primary" : "bg-black/70 hover:scale-105"}`}
                >
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedZone ? (
        <Card className="border-border/70 shadow-sm">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-2">
              <Badge className="gap-1">
                <MapPin className="h-3 w-3" />
                Punto importante
              </Badge>
              <span className="text-xs text-muted-foreground">
                Haz clic en los marcadores del mapa para explorar cada zona.
              </span>
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground">
              {selectedZone.name}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {selectedZone.description || "Zona estratégica del Patinódromo."}
            </p>
            
            {/* Botón de acceso rápido al Punto 1 */}
            {isZoneOneSelected && (
              <button
                type="button"
                onClick={() => setShowMural(true)}
                className="mt-2 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition shadow hover:scale-105"
              >
                👣 Jugar: Mi huella en la ciudad
              </button>
            )}

            {/* 📖 Botón de acceso rápido al Punto 2 */}
            {isZoneTwoSelected && (
              <button
                type="button"
                onClick={() => setShowHistorias(true)}
                className="mt-2 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition shadow hover:scale-105"
              >
                📖 Jugar: Descubriendo historias
              </button>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="rounded-xl border border-dashed border-border/70 bg-secondary/20 px-4 py-6 text-center text-sm text-muted-foreground">
          Aún no hay zonas configuradas en el mapa.
        </p>
      )}

  
      {showMural && (
        <MuralHuellas onClose={() => setShowMural(false)} />
      )}

  
      {showHistorias && (
        <Momento2Historias onClose={() => setShowHistorias(false)} />
      )}
    </div>
  )
}