import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const expiredReservations =
    await prisma.reservation.findMany({
      where: {
        status: "pending",
        expiresAt: {
          lt: new Date()
        }
      }
    })

  for (const reservation of expiredReservations) {
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
          id: reservation.id
        },
        data: {
          status: "released"
        }
      })
    })
  }

  const products = await prisma.product.findMany({
    include: {
      inventories: {
        include: {
          warehouse: true
        }
      }
    }
  })

  const data = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      inventories: product.inventories.map((item) => ({
        warehouseId: item.warehouseId,
        warehouseName: item.warehouse.name,
        totalStock: item.totalStock,
        reservedStock: item.reservedStock,
        availableStock:
          item.totalStock - item.reservedStock
      }))
    }
  })

  return NextResponse.json(data)
}