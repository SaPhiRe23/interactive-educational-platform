import Image from "next/image"
import { Images } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"

const galleryItems = [
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.56.jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.56 (1).jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57.jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57 (1).jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57 (2).jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57 (3).jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57 (4).jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57 (5).jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.58.jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.58 (1).jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.58 (2).jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.58 (3).jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.58 (4).jpeg",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.59.jpeg",
  },
].map((item) => ({
  ...item,
  src: encodeURI(item.src),
}))

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        icon={Images}
        title="Galería de la actividad"
        description="Imágenes de la propuesta 'Huellas que Construyen Futuro: El Patinódromo Habla' y sus momentos de participación."
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <Card className="overflow-hidden border-border/70 shadow-sm">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Huellas que Construyen Futuro</p>
              <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">El Patinódromo Habla</h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Registro visual de la actividad en el Patinódromo Distrital de Barranquilla. Cada imagen resume un momento de participación, reflexión y construcción colectiva.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {galleryItems.map((item) => (
                <figure key={item.src} className="overflow-hidden rounded-2xl border border-border/60 bg-secondary/30 shadow-sm transition-transform hover:-translate-y-1">
                  <div className="relative aspect-[4/3] w-full bg-muted">
                    <Image src={item.src} alt="Galería de la actividad" fill className="object-cover" sizes="(max-width: 1280px) 50vw, 25vw" />
                  </div>
                </figure>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}