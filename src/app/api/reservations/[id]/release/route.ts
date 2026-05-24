import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
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

    if (reservation.status !== "pending") {
      return NextResponse.json(
        {
          message:
            "Reservation already processed"
        },
        {
          status: 400
        }
      )
    }

    await prisma.$transaction(async (tx) => {
      await tx.inventory.updateMany({
        where: {
          productId:
            reservation.productId,
          warehouseId:
            reservation.warehouseId
        },
        data: {
          reservedStock: {
            decrement:
              reservation.quantity
          }
        }
      })

      await tx.reservation.update({
        where: {
          id: reservation.id
        },
        data: {
          status: "released"
        }
      })
    })

    return NextResponse.json({
      message: "Reservation released"
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        message:
          "Failed to release reservation"
      },
      {
        status: 500
      }
    )
  }
}