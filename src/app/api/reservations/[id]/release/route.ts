import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function POST(
  req: Request,
  { params }: Params
) {
  const { id } = await params

  const reservation = await prisma.reservation.findUnique({
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
        message: "Reservation already processed"
      },
      {
        status: 400
      }
    )
  }

  await prisma.$transaction(async (tx) => {
    await tx.inventory.updateMany({
      where: {
        productId: reservation.productId,
        warehouseId: reservation.warehouseId
      },
      data: {
        reservedStock: {
          decrement: reservation.quantity
        }
      }
    })

    await tx.reservation.update({
      where: {
        id
      },
      data: {
        status: "released"
      }
    })
  })

  return NextResponse.json({
    message: "Reservation released"
  })
}