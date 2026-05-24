"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ReservationPage() {
  const params = useParams()
  const router = useRouter()

  const [reservation, setReservation] =
    useState<any>(null)

  const [loading, setLoading] = useState(true)

  const [message, setMessage] = useState("")

  const [timeLeft, setTimeLeft] =
    useState("")

  useEffect(() => {
    if (params?.id) {
      fetchReservation()
    }
  }, [params])

  useEffect(() => {
    if (!reservation) return

    const interval = setInterval(() => {
      const now = new Date().getTime()

      const expiry = new Date(
        reservation.expiresAt
      ).getTime()

      const difference = expiry - now

      if (difference <= 0) {
        setTimeLeft("Expired")
        clearInterval(interval)
        return
      }

      const minutes = Math.floor(
        difference / (1000 * 60)
      )

      const seconds = Math.floor(
        (difference % (1000 * 60)) / 1000
      )

      setTimeLeft(
        `${minutes}m ${seconds}s`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [reservation])

  async function fetchReservation() {
    try {
      const res = await fetch(
        `/api/reservations/${params.id}`
      )

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.message)
        return
      }

      setReservation(data)
    } catch (error) {
      setMessage("Failed to load reservation")
    } finally {
      setLoading(false)
    }
  }

  async function confirmReservation() {
    try {
      const res = await fetch(
        `/api/reservations/${params.id}/confirm`,
        {
          method: "POST"
        }
      )

      const data = await res.json()

      setMessage(data.message)

      if (res.ok) {
        fetchReservation()
      }
    } catch (error) {
      setMessage("Something went wrong")
    }
  }

  async function cancelReservation() {
    try {
      const res = await fetch(
        `/api/reservations/${params.id}/release`,
        {
          method: "POST"
        }
      )

      const data = await res.json()

      setMessage(data.message)

      if (res.ok) {
        fetchReservation()
      }
    } catch (error) {
      setMessage("Something went wrong")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-700">
        Loading...
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-red-600">
        {message}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => router.push("/")}
          className="mb-6 border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-100 transition"
        >
          Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">
            Reservation Details
          </h1>

          {message && (
            <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-lg mb-5 font-medium">
              {message}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Product
              </p>

              <p className="text-lg font-semibold text-gray-900">
                {reservation.product.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Warehouse
              </p>

              <p className="text-lg font-semibold text-gray-900">
                {reservation.warehouse.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Quantity
              </p>

              <p className="text-lg font-semibold text-gray-900">
                {reservation.quantity}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Status
              </p>

              <p className="text-lg font-semibold capitalize text-green-700">
                {reservation.status}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Expires In
              </p>

              <p className="text-xl font-bold text-red-700">
                {timeLeft}
              </p>
            </div>
          </div>

          {reservation.status === "pending" && (
            <div className="flex gap-4 mt-8">
              <button
                onClick={confirmReservation}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition"
              >
                Confirm Purchase
              </button>

              <button
                onClick={cancelReservation}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-red-700 transition"
              >
                Cancel Reservation
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}