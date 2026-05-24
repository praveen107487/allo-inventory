import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: any
) {
  const id = context.params.id

  const reservation =
    await prisma.reservation.findUnique({
      where: {
        id
      },
      include: {
        product: true,
        warehouse: true
      }
    })

  if (!reservation) {
    return NextResponse.json(
      {
        message: "Reservation not found"
      },
      {
        status: 404
      }
    )
  }

  return NextResponse.json(reservation)
}