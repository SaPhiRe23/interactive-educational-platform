import { Map } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { SiteMapViewer } from "@/components/site-map-viewer"
import { getMapZones, getMedia } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function MapaPage() {
  const [zones, media] = await Promise.all([getMapZones(), getMedia()])

  const mapImageFromGallery = media.find(
    (item) =>
      item.type === "photo" &&
      (item.title ?? "").toLowerCase().includes("mapapatinodromo"),
  )

  const mapImage = mapImageFromGallery?.url || "/gallery/MapaPatinodromo.jpeg"

  return (
    <>
      <PageHeader
        icon={Map}
        title="Mapa interactivo"
        description="Explora el Patinódromo y ubica los puntos importantes de la actividad."
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <SiteMapViewer
          imageUrl={mapImage}
          zones={zones.map((zone) => ({
            id: zone.id,
            name: zone.name,
            description: zone.description,
            posX: zone.posX,
            posY: zone.posY,
          }))}
        />
      </div>
    </>
  )
}
