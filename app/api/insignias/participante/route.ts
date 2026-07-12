import { NextRequest } from "next/server"
import { getBadgesForParticipant, getParticipantByCode } from "@/lib/data"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")?.trim().toUpperCase() ?? ""

  if (!code) {
    return Response.json(
      { ok: false, message: "Ingresa tu código de inscripción." },
      { status: 400 },
    )
  }

  const participant = await getParticipantByCode(code)
  if (!participant) {
    return Response.json(
      { ok: false, message: "No encontramos un participante con ese código." },
      { status: 404 },
    )
  }

  const badges = await getBadgesForParticipant(participant.id)

  return Response.json({
    ok: true,
    participant: {
      fullName: participant.fullName,
      code: participant.code,
    },
    badges,
  })
}
