"use client"

import { useRef, useState, useTransition } from "react"
import { upload } from "@vercel/blob/client"
import { toast } from "sonner"
import { Loader2, UploadCloud } from "lucide-react"
import { createMediaItem } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const MAX_SIZE_MB = 300

export function MediaForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [type, setType] = useState("photo")
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()

  function resetForm() {
    formRef.current?.reset()
    setFile(null)
    setType("photo")
    setProgress(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const pastedUrl = String(formData.get("url") ?? "").trim()

    if (!file && !pastedUrl) {
      toast.error("Sube un archivo o pega una URL (por ejemplo, un enlace de YouTube).")
      return
    }

    if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`El archivo supera el límite de ${MAX_SIZE_MB} MB.`)
      return
    }

    startTransition(async () => {
      try {
        let finalUrl = pastedUrl

        if (file) {
          setProgress(0)
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/gallery/upload",
            onUploadProgress: (p) => setProgress(Math.round(p.percentage)),
          })
          finalUrl = blob.url
        }

        formData.set("url", finalUrl)

        const res = await createMediaItem(null, formData)
        if (res?.ok === false) {
          toast.error(res.message ?? "No se pudo guardar el elemento.")
        } else {
          toast.success(res?.message ?? "Elemento agregado a la galería.")
          resetForm()
        }
      } catch (error) {
        toast.error("No se pudo subir el archivo. Verifica la conexión e intenta de nuevo.")
      } finally {
        setProgress(null)
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="type">Tipo</Label>
          <input type="hidden" name="type" value={type} />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photo">Foto</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Categoría</Label>
          <Input id="category" name="category" placeholder="Ej. Carreras, Clínicas, Familia" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" placeholder="Ej. Final de velocidad 2025" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="file">Archivo</Label>
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/30 p-3">
          <UploadCloud className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={fileInputRef}
            id="file"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="flex-1 text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Sube directamente la foto o el video (hasta {MAX_SIZE_MB} MB). Se guarda en Vercel Blob.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="url">O pega una URL (ej. enlace de YouTube)</Label>
        <Input id="url" name="url" placeholder="https://..." disabled={Boolean(file)} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="thumbnailUrl">Miniatura (opcional, útil para enlaces de video)</Label>
        <Input id="thumbnailUrl" name="thumbnailUrl" placeholder="https://..." />
      </div>

      <div className="sm:w-40">
        <Label htmlFor="sortOrder">Orden</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
      </div>

      <div>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {progress !== null ? `Subiendo... ${progress}%` : "Agregar a la galería"}
        </Button>
      </div>
    </form>
  )
}
