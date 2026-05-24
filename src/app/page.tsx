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
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Inventory Reservation System
          </h1>

          <p className="text-gray-600 mt-2">
            Reserve products from available warehouses
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {products.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center border">
            No products available
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {product.name}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    Price: ₹ {product.price}
                  </p>
                </div>

                <div className="bg-black text-white text-sm px-3 py-1 rounded-full">
                  Product
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {product.inventories.length === 0 && (
                  <div className="border rounded-xl p-4 text-gray-500">
                    No stock available
                  </div>
                )}

                {product.inventories.map((item) => (
                  <div
                    key={item.warehouseId}
                    className="border rounded-xl p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.warehouseName}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Available Stock:{" "}
                          {item.availableStock}
                        </p>
                      </div>

                      <div>
                        {item.availableStock > 0 ? (
                          <span className="text-green-600 text-sm font-medium">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-red-500 text-sm font-medium">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

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
                      className="w-full mt-4 bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
                    >
                      Reserve Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}