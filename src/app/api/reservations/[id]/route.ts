import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    const params = await context.params

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: params.id
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
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        message:
          "Failed to fetch reservation"
      },
      {
        status: 500
      }
    )
  }
}