"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"

type StatsPayload = {
  participantsTotal: number
  completedTotal: number
  surveyTotal: number
  avgRating: number
  recommendCount: number
  badgesAwarded: number
  byCategory: { name: string; value: number }[]
  byCity: { name: string; value: number }[]
  registrationsByDay: { day: string; value: number }[]
  ratingDistribution: { rating: number; value: number }[]
}

const pieColors = ["#ea580c", "#f59e0b", "#0ea5e9", "#22c55e", "#a855f7", "#ef4444"]

function EmptyChart() {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
      Sin datos disponibles todavía.
    </div>
  )
}

export function PublicStatsDashboard({ stats }: { stats: StatsPayload }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Inscritos totales</p>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">{stats.participantsTotal}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Participantes completados</p>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">{stats.completedTotal}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Insignias otorgadas</p>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">{stats.badgesAwarded}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Encuestas recibidas</p>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">{stats.surveyTotal}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Calificación promedio</p>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">{stats.avgRating.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Recomendarían el evento</p>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">{stats.recommendCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardContent className="p-5">
            <h3 className="font-heading text-lg font-semibold text-foreground">Inscritos por categoría</h3>
            {stats.byCategory.length === 0 ? (
              <EmptyChart />
            ) : (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.byCategory} dataKey="value" nameKey="name" innerRadius={52} outerRadius={92}>
                      {stats.byCategory.map((entry, index) => (
                        <Cell key={`${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="p-5">
            <h3 className="font-heading text-lg font-semibold text-foreground">Registros por día</h3>
            {stats.registrationsByDay.length === 0 ? (
              <EmptyChart />
            ) : (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.registrationsByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ea580c" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="p-5">
            <h3 className="font-heading text-lg font-semibold text-foreground">Participantes por ciudad</h3>
            {stats.byCity.length === 0 ? (
              <EmptyChart />
            ) : (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.byCity.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="p-5">
            <h3 className="font-heading text-lg font-semibold text-foreground">Distribución de calificaciones</h3>
            {stats.ratingDistribution.length === 0 ? (
              <EmptyChart />
            ) : (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.ratingDistribution.map((item) => ({ ...item, label: `${item.rating}★` }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
