import type { LucideIcon } from "lucide-react"

export function PageHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="border-b border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon className="h-5 w-5" />
          </span>
          <h1 className="font-heading text-3xl font-bold text-foreground text-balance md:text-4xl">{title}</h1>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">{description}</p>
      </div>
    </div>
  )
}
