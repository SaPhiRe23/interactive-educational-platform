import Image from "next/image"
import { Images } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"

const galleryItems = [
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.56.jpeg",
    title: "Inicio de la actividad",
    description: "Registro del encuentro y preparación del primer momento.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.56 (1).jpeg",
    title: "Mi huella en la ciudad",
    description: "Participantes compartiendo experiencias y apoyos significativos.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57.jpeg",
    title: "Cabina de Historias",
    description: "Testimonios en video sobre crecimiento y oportunidades.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57 (1).jpeg",
    title: "Descubriendo historias",
    description: "Trabajo colectivo alrededor de las estaciones temáticas.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57 (2).jpeg",
    title: "Dramatización",
    description: "Representación de historias de transformación y apoyo.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57 (3).jpeg",
    title: "Semáforo de decisiones",
    description: "Reflexión sobre riesgos, decisiones y oportunidades.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57 (4).jpeg",
    title: "Muro de las posibilidades",
    description: "Ideas sobre autoestima, convivencia y proyecto de vida.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.57 (5).jpeg",
    title: "Corre a tu respuesta",
    description: "Dinámica de movimiento y argumentación por categorías.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.58.jpeg",
    title: "Mapa de oportunidades",
    description: "Construcción del mapa colectivo con el Patinódromo al centro.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.58 (1).jpeg",
    title: "Reto del futuro",
    description: "Propuestas para tiempo libre, liderazgo e inclusión.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.58 (2).jpeg",
    title: "Trabajo en equipo",
    description: "Discusión grupal para construir soluciones viables.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.58 (3).jpeg",
    title: "Decisión colectiva",
    description: "Votación con pegatinas para elegir la mejor propuesta.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.58 (4).jpeg",
    title: "Cierre de la jornada",
    description: "Socialización final y apropiación del Patinódromo.",
  },
  {
    src: "/gallery/WhatsApp Image 2026-07-11 at 20.06.59.jpeg",
    title: "Evidencia fotográfica",
    description: "Resumen visual de la propuesta Huellas que Construyen Futuro.",
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
                    <Image src={item.src} alt={item.title} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 25vw" />
                  </div>
                  <figcaption className="space-y-1 p-4">
                    <h3 className="font-heading text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}