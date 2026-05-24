import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { productId, warehouseId, quantity } = body

    const result = await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId
          }
        }
      })

      if (!inventory) {
        throw new Error("Inventory not found")
      }

      const available =
        inventory.totalStock - inventory.reservedStock

      if (available < quantity) {
        return {
          error: true
        }
      }

      await tx.inventory.update({
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

      const reservation = await tx.reservation.create({
        data: {
          productId,
          warehouseId,
          quantity,
          status: "pending",
          expiresAt
        }
      })

      return reservation
    })

    if ("error" in result) {
      return NextResponse.json(
        {
          message: "Not enough stock"
        },
        {
          status: 409
        }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong"
      },
      {
        status: 500
      }
    )
  }
}