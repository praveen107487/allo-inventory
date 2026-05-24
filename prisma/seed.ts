import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Chennai Warehouse",
      city: "Chennai"
    }
  })

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
      city: "Bangalore"
    }
  })

  const product1 = await prisma.product.create({
    data: {
      name: "iPhone 15",
      price: 70000
    }
  })

  const product2 = await prisma.product.create({
    data: {
      name: "AirPods",
      price: 15000
    }
  })

  await prisma.inventory.createMany({
    data: [
      {
        productId: product1.id,
        warehouseId: warehouse1.id,
        totalStock: 5
      },
      {
        productId: product1.id,
        warehouseId: warehouse2.id,
        totalStock: 3
      },
      {
        productId: product2.id,
        warehouseId: warehouse1.id,
        totalStock: 10
      }
    ]
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
  })