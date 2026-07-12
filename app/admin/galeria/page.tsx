import { getMedia } from "@/lib/data"
import { MediaManager } from "@/components/admin/media-manager"

export default async function AdminGalleryPage() {
  const media = await getMedia()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Galería de fotos y videos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Agrega el material que se mostrará públicamente en la página de Galería.
        </p>
      </div>
      <MediaManager media={media} />
    </div>
  )
}
