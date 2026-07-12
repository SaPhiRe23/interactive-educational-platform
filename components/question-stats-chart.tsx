"use client"

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { QuestionStatResult } from "@/lib/data"

const COLORS = ["#1e3a5f", "#c0392b", "#f5a623", "#0ea5e9", "#22c55e", "#a855f7", "#ea580c", "#64748b"]

function EmptyState() {
  return <p className="py-6 text-center text-sm text-muted-foreground">Sin respuestas todavía.</p>
}

export function QuestionStatsChart({ result }: { result: QuestionStatResult }) {
  if (result.type === "text") {
    return (
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold">{result.label}</CardTitle>
        </CardHeader>
        <CardContent>
          {result.responses.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {result.responses.map((text, i) => (
                <li key={i} className="rounded-md border border-border/60 bg-secondary/30 px-3 py-2 text-sm italic text-foreground">
                  "{text}"
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    )
  }

  const total = result.data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{result.label}</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <EmptyState />
        ) : result.chartType === "table" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opción</TableHead>
                <TableHead className="text-right">Respuestas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.map((d) => (
                <TableRow key={d.name}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell className="text-right font-medium">{d.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : result.chartType === "donut" ? (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ResponsiveContainer width="100%" height={220} className="max-w-xs">
              <PieChart>
                <Pie data={result.data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {result.data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-1 flex-col gap-1.5 text-sm">
              {result.data.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-foreground">{d.name}</span>
                  <span className="ml-auto font-medium text-muted-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(180, result.data.length * 44)}>
            <BarChart data={result.data} layout="vertical" margin={{ left: 8, right: 24 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {result.data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
