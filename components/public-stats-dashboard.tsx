"use client"

import { Card, CardContent } from "@/components/ui/card"

type StatMetric = {
  key: string
  label: string
  value: number
  visible: boolean
}

type StatsPayload = {
  metrics: StatMetric[]
}

function formatMetricValue(key: string, value: number) {
  return key === "avgRating" ? value.toFixed(1) : String(value)
}

export function PublicStatsDashboard({ stats }: { stats: StatsPayload }) {
  const visibleMetrics = stats.metrics.filter((m) => m.visible)

  if (visibleMetrics.length === 0) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibleMetrics.map((metric) => (
        <Card key={metric.key} className="border-border/70">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">
              {formatMetricValue(metric.key, metric.value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
