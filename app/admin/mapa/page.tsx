import { getMapZones } from "@/lib/data"
import { MapZonesManager } from "@/components/admin/map-zones-manager"
import IdeasModeracion from "@/components/admin/ideas-moderacion"

export const dynamic = "force-dynamic";
export default async function AdminMapPage() {
  const zones = await getMapZones()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Mapa interactivo del patinódromo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ubica cada zona sobre la imagen del recinto (public/patinodromo-map.png). Las zonas aparecen en la página pública de Mapa.
        </p>
      </div>
      <MapZonesManager zones={zones} />
      <IdeasModeracion />
    </div>
  )
}
