import Link from "next/link"
import { Zap, MapPin, Calendar } from "lucide-react"
import { navItems } from "@/lib/nav"

export function SiteFooter({
  eventName,
  eventDates,
  eventLocation,
}: {
  eventName: string
  eventDates: string
  eventLocation: string
}) {
  return (
    <footer className="mt-20 border-t border-border/60 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-bold">{eventName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-sidebar-foreground/70 leading-relaxed">
            Plataforma oficial del evento: inscríbete, sigue el cronograma, explora el recinto y descarga tu
            certificado.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-sidebar-foreground/60">
            Navegación
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sidebar-foreground/80 transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-sidebar-foreground/60">
            Información
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/80">
            <li className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {eventDates}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {eventLocation}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sidebar-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-sidebar-foreground/60 sm:flex-row">
          <p>© 2026 {eventName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
