import { Calendar, CheckCircle2, Clock, MapPin } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"

const cronograma = [
  {
    step: "Momento 1",
    title: "Mi huella en la ciudad",
    duration: "20 minutos",
    objective: "Generar una reflexión inicial sobre los espacios que han influido positivamente en la vida de los jóvenes.",
    location: "Mural colectivo y Cabina de Historias",
    details: [
      "Cada participante recibe una huella de papel y responde qué experiencia o espacio en Barranquilla le ha ayudado a crecer.",
      "Las huellas se pegan en un mural colectivo.",
      "Algunos participantes pasan por la Cabina de Historias y responden preguntas sobre apoyo, crecimiento y oportunidades para la juventud.",
    ],
  },
  {
    step: "Momento 2",
    title: "Descubriendo historias",
    duration: "30 minutos",
    objective: "Reconocer el valor social del Patinódromo a través de experiencias humanas.",
    location: "Estaciones alrededor del Patinódromo",
    details: [
      "Se recorren estaciones con historias de Juan, María y Andrés, relacionadas con amistad, capacidades y disciplina.",
      "Cada grupo representa una historia en una dramatización corta.",
      "Se completa el semáforo de decisiones y el Muro de las Posibilidades para identificar aprendizajes y beneficios.",
    ],
  },
  {
    step: "Momento 3",
    title: "Corre a tu respuesta",
    duration: "Tiempo dentro de la sesión",
    objective: "Generar movimiento, discusión y reflexión sobre las formas en que el Patinódromo aporta al desarrollo humano.",
    location: "Zonas del Patinódromo marcadas por categorías",
    details: [
      "Los participantes corren hacia categorías como Bienestar, Liderazgo, Disciplina, Convivencia, Inclusión, Proyecto de Vida y Salud Mental.",
      "Luego explican por qué eligieron esa opción y cómo se relaciona con la historia escuchada.",
      "Se fortalece la argumentación, la escucha activa y el pensamiento crítico.",
    ],
  },
  {
    step: "Momento 4",
    title: "Construyendo el mapa de oportunidades",
    duration: "20 minutos",
    objective: "Visualizar el aporte del Patinódromo al desarrollo humano y social.",
    location: "Cartulina central con el Patinódromo en el centro",
    details: [
      "Los grupos relacionan las historias trabajadas con las categorías de desarrollo humano.",
      "Se construye un mapa colectivo alrededor de la imagen del Patinódromo.",
      "El resultado evidencia las oportunidades que ofrece el espacio para la juventud.",
    ],
  },
  {
    step: "Momento 5",
    title: "El reto del futuro",
    duration: "20 minutos",
    objective: "Promover la generación de soluciones para fortalecer el activo.",
    location: "Trabajo por grupos",
    details: [
      "Cada grupo recibe una situación relacionada con tiempo libre, nuevas amistades, disciplina, estrés académico, liderazgo o inclusión.",
      "Construyen una propuesta que incluya problema, actividad, beneficios e invitación a otros jóvenes.",
      "Cada equipo socializa su idea y se identifican las más viables para el Patinódromo.",
    ],
  },
  {
    step: "Momento 6",
    title: "Decisión colectiva",
    duration: "15 minutos",
    objective: "Tomar decisiones colectivas sobre el fortalecimiento del activo.",
    location: "Cierre de la sesión",
    details: [
      "Cada grupo presenta su propuesta y todos los participantes votan con una pegatina.",
      "La propuesta más votada se convierte en la decisión colectiva de la actividad.",
      "Al final, los participantes completan la frase: 'El Patinódromo es importante para Barranquilla porque...'.",
    ],
  },
]

export default function CronogramaPage() {
  const totalDuration = "2 horas (120 minutos)"

  return (
    <>
      <PageHeader
        icon={Calendar}
        title="Cronograma de actividades"
        description="Programa de la propuesta 'Huellas que Construyen Futuro: El Patinódromo Habla', organizado en 6 momentos de trabajo colectivo."
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Duración total</p>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">{totalDuration}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Público objetivo</p>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">Jóvenes de 14 a 28 años</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lugar</p>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">Patinódromo Distrital de Barranquilla</p>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 border-l-2 border-border pl-6">
          {cronograma.map((item, index) => (
            <article key={item.step} className="relative">
              <span className="absolute -left-[1.9rem] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-background text-primary shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.step}</p>
                    <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {item.duration}
                  </Badge>
                </div>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.objective}</p>

                <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary">
                  <MapPin className="h-4 w-4" />
                  {item.location}
                </p>

                <ul className="mt-4 space-y-2 text-sm text-foreground">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex gap-2 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                {index < cronograma.length - 1 && <div className="mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">Continúa con el siguiente momento de la propuesta.</div>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
