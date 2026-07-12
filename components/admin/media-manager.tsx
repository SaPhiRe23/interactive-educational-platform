"use client"

import { Film, ImageIcon } from "lucide-react"
import { deleteMediaItem } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeleteButton } from "@/components/admin/delete-button"
import { MediaForm } from "@/components/admin/media-form"
import type { MediaItem } from "@/lib/db/schema"

export function MediaManager({ media }: { media: MediaItem[] }) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Agregar foto o video</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{media.length} elementos en la galería</CardTitle>
        </CardHeader>
        <CardContent>
          {media.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Aún no has agregado fotos o videos.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {media.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg border border-border bg-secondary/40">
                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    {item.type === "video" ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Film className="h-8 w-8 text-muted-foreground" />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.title ?? "Imagen de la galería"}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute right-1.5 top-1.5">
                      <Badge variant="secondary" className="gap-1">
                        {item.type === "video" ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">{item.title || "Sin título"}</p>
                      {item.category && <p className="truncate text-[11px] text-muted-foreground">{item.category}</p>}
                    </div>
                    <DeleteButton
                      action={deleteMediaItem.bind(null, item.id)}
                      confirmText="¿Eliminar este elemento de la galería?"
                      successMessage="Elemento eliminado."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
