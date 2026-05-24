"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types"
import { useRouter } from "next/navigation"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()

      setProducts(data)
    } catch (err) {
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  async function reserveProduct(
    productId: string,
    warehouseId: string
  ) {
    setError("")

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          warehouseId,
          quantity: 1
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      router.push(`/reservation/${data.id}`)
    } catch (err) {
      setError("Something went wrong")
    }
  }

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    )
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Products
      </h1>

      {error && (
        <div className="bg-red-200 p-3 mb-5 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-5 rounded"
          >
            <h2 className="text-xl font-semibold">
              {product.name}
            </h2>

            <p className="mt-2">
              ₹ {product.price}
            </p>

            <div className="mt-4">
              {product.inventories.map((item) => (
                <div
                  key={item.warehouseId}
                  className="border p-3 rounded mt-3"
                >
                  <p>
                    Warehouse:{" "}
                    {item.warehouseName}
                  </p>

                  <p>
                    Available Stock:{" "}
                    {item.availableStock}
                  </p>

                  <button
                    onClick={() =>
                      reserveProduct(
                        product.id,
                        item.warehouseId
                      )
                    }
                    disabled={
                      item.availableStock <= 0
                    }
                    className="bg-black text-white px-4 py-2 rounded mt-3 disabled:bg-gray-400"
                  >
                    Reserve
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}