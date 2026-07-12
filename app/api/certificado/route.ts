import { NextRequest } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { getParticipantByEmail, getSettings } from "@/lib/data"

function escapeText(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim()
}

function drawWrappedText(
  page: import("pdf-lib").PDFPage,
  text: string,
  x: number,
  y: number,
  options: {
    size: number
    font: import("pdf-lib").PDFFont
    color?: { red: number; green: number; blue: number }
    maxWidth: number
    lineHeight: number
    align?: "left" | "center"
  },
) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const width = options.font.widthOfTextAtSize(testLine, options.size)
    if (width <= options.maxWidth) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }

  if (currentLine) lines.push(currentLine)

  lines.forEach((line, index) => {
    const width = options.font.widthOfTextAtSize(line, options.size)
    const textX = options.align === "center" ? x + (options.maxWidth - width) / 2 : x
    page.drawText(line, {
      x: textX,
      y: y - index * options.lineHeight,
      size: options.size,
      font: options.font,
      color: options.color ?? rgb(0.12, 0.12, 0.12),
    })
  })

  return y - (lines.length - 1) * options.lineHeight
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase() ?? ""
  if (!email) {
    return Response.json({ ok: false, message: "Ingresa un correo electrónico." }, { status: 400 })
  }

  const participant = await getParticipantByEmail(email)
  if (!participant) {
    return Response.json({ ok: false, message: "No encontramos una inscripción con ese correo." }, { status: 404 })
  }

  if (!participant.completed) {
    return Response.json(
      { ok: false, message: "Tu participación aún no ha sido confirmada por el equipo organizador." },
      { status: 403 },
    )
  }

  const settings = await getSettings()
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([842, 595])

  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica)
  const italicFont = await pdf.embedFont(StandardFonts.HelveticaOblique)

  const margin = 48
  const width = page.getWidth() - margin * 2
  const height = page.getHeight()

  page.drawRectangle({ x: 18, y: 18, width: page.getWidth() - 36, height: page.getHeight() - 36, borderColor: rgb(0.86, 0.38, 0.17), borderWidth: 3, color: rgb(1, 1, 1) })
  page.drawRectangle({ x: 28, y: 28, width: page.getWidth() - 56, height: page.getHeight() - 56, borderColor: rgb(0.95, 0.7, 0.36), borderWidth: 1, color: rgb(1, 1, 1) })

  page.drawText("CERTIFICADO DE PARTICIPACIÓN", {
    x: margin,
    y: height - 86,
    size: 28,
    font: titleFont,
    color: rgb(0.13, 0.13, 0.13),
  })

  page.drawText(settings.eventName, {
    x: margin,
    y: height - 120,
    size: 15,
    font: bodyFont,
    color: rgb(0.55, 0.28, 0.08),
  })

  let y = height - 168
  y = drawWrappedText(page, `Se certifica que ${escapeText(participant.fullName)}, con correo ${escapeText(participant.email)}, participó en la propuesta de actividad de apropiación social.`, margin, y, {
    size: 18,
    font: bodyFont,
    maxWidth: width,
    lineHeight: 24,
    align: "center",
  })

  y -= 20
  y = drawWrappedText(page, "Huellas que Construyen Futuro: El Patinódromo Habla", margin, y, {
    size: 22,
    font: titleFont,
    color: rgb(0.84, 0.35, 0.14),
    maxWidth: width,
    lineHeight: 26,
    align: "center",
  })

  y -= 18
  y = drawWrappedText(page, settings.eventTagline, margin + 18, y, {
    size: 12,
    font: italicFont,
    color: rgb(0.33, 0.33, 0.33),
    maxWidth: width - 36,
    lineHeight: 16,
    align: "center",
  })

  y -= 18
  drawWrappedText(page, `Este documento se expide para los fines pertinentes como reconocimiento a su participación en el Patinódromo Distrital de Barranquilla.`, margin, y, {
    size: 14,
    font: bodyFont,
    maxWidth: width,
    lineHeight: 18,
    align: "center",
  })

  page.drawText(`Código: ${participant.code}`, {
    x: margin,
    y: 112,
    size: 12,
    font: bodyFont,
    color: rgb(0.32, 0.32, 0.32),
  })
  page.drawText(`Barranquilla, ${new Date().toLocaleDateString("es-CO")}`, {
    x: margin,
    y: 92,
    size: 12,
    font: bodyFont,
    color: rgb(0.32, 0.32, 0.32),
  })

  const bytes = await pdf.save()
  return new Response(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificado-${participant.code}.pdf"`,
      "Cache-Control": "no-store",
    },
  })
}