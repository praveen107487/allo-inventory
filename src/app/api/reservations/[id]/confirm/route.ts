import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  context: any
) {
  const id = context.params.id

  const reservation =
    await prisma.reservation.findUnique({
      where: {
        id
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

  if (new Date() > reservation.expiresAt) {
    return NextResponse.json(
      {
        message: "Reservation expired"
      },
      {
        status: 410
      }
    )
  }

  await prisma.$transaction(async (tx) => {
    await tx.inventory.updateMany({
      where: {
        productId: reservation.productId,
        warehouseId:
          reservation.warehouseId
      },
      data: {
        totalStock: {
          decrement:
            reservation.quantity
        },
        reservedStock: {
          decrement:
            reservation.quantity
        }
      }
    })

    await tx.reservation.update({
      where: {
        id
      },
      data: {
        status: "confirmed"
      }
    })
  })

  return NextResponse.json({
    message: "Reservation confirmed"
  })
}