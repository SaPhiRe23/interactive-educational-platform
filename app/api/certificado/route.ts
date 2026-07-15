import { NextRequest } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fs from "node:fs/promises"
import path from "node:path"
import { getParticipantByEmail } from "@/lib/data"

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

  // The diploma template's exact pixel size — the PDF page is created at this
  // same size so the pixel coordinates below map 1:1 onto it.
  const TEMPLATE_WIDTH = 1426
  const TEMPLATE_HEIGHT = 1103

  // Measured from the template: the blank line sits at y=553 (from the top),
  // spanning roughly x=320 to x=1108.
  const LINE_TOP_Y = 553
  const LINE_CENTER_X = (320 + 1108) / 2

  const templatePath = path.join(process.cwd(), "public", "certificates", "diploma-template.jpg")
  const templateBytes = await fs.readFile(templatePath)

  const pdf = await PDFDocument.create()
  const page = pdf.addPage([TEMPLATE_WIDTH, TEMPLATE_HEIGHT])

  const templateImage = await pdf.embedJpg(templateBytes)
  page.drawImage(templateImage, { x: 0, y: 0, width: TEMPLATE_WIDTH, height: TEMPLATE_HEIGHT })

  const nameFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const navy = rgb(0.078, 0.145, 0.271)

  const fullName = participant.fullName.trim()
  const maxWidth = 1108 - 320 - 24 // line width, minus a little breathing room
  let fontSize = 34
  while (fontSize > 16 && nameFont.widthOfTextAtSize(fullName, fontSize) > maxWidth) {
    fontSize -= 1
  }

  const nameWidth = nameFont.widthOfTextAtSize(fullName, fontSize)

  page.drawText(fullName, {
    x: LINE_CENTER_X - nameWidth / 2,
    // PDF's y-axis starts at the bottom, the template's measurement starts at the
    // top, so we flip it — and nudge the baseline up a few points so the name
    // sits just above the line instead of sitting on top of it.
    y: TEMPLATE_HEIGHT - LINE_TOP_Y + 10,
    size: fontSize,
    font: nameFont,
    color: navy,
  })

  // Fecha: ____ / ____ / 2026 — measured blank positions on the template.
  const DATE_BASELINE_Y = 805
  const DAY_BLANK_CENTER_X = (693 + 734) / 2
  const MONTH_BLANK_CENTER_X = (750 + 791) / 2
  const DATE_MAX_WIDTH = 34

  function drawDatePart(text: string, centerX: number) {
    let size = 22
    while (size > 10 && nameFont.widthOfTextAtSize(text, size) > DATE_MAX_WIDTH) {
      size -= 1
    }
    const w = nameFont.widthOfTextAtSize(text, size)
    page.drawText(text, {
      x: centerX - w / 2,
      y: TEMPLATE_HEIGHT - DATE_BASELINE_Y,
      size,
      font: nameFont,
      color: navy,
    })
  }

  drawDatePart("26", DAY_BLANK_CENTER_X)
  drawDatePart("06", MONTH_BLANK_CENTER_X)

  const bytes = await pdf.save()
  return new Response(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificado-${participant.code}.pdf"`,
      "Cache-Control": "no-store",
    },
  })
}
