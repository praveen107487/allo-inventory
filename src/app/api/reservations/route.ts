import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()

    const productId = body.productId
    const warehouseId = body.warehouseId
    const quantity = body.quantity

    const inventory =
      await prisma.inventory.findFirst({
        where: {
          productId,
          warehouseId
        }
      })

    if (!inventory) {
      return NextResponse.json(
        {
          message: "Inventory not found"
        },
        {
          status: 404
        }
      )
    }

    const availableStock =
      inventory.totalStock -
      inventory.reservedStock

    if (availableStock < quantity) {
      return NextResponse.json(
        {
          message: "Not enough stock"
        },
        {
          status: 409
        }
      )
    }

    await prisma.inventory.update({
      where: {
        id: inventory.id
      },
      data: {
        reservedStock: {
          increment: quantity
        }
      }
    })

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    )

    const reservation =
      await prisma.reservation.create({
        data: {
          productId,
          warehouseId,
          quantity,
          status: "pending",
          expiresAt
        }
      })

    return NextResponse.json(
      reservation
    )
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        message:
          "Failed to create reservation"
      },
      {
        status: 500
      }
    )
  }
}