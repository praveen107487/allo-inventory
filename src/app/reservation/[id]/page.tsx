"use client"

import { Reservation } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ReservationPage() {
  const params = useParams()
  const router = useRouter()

  const [reservation, setReservation] =
    useState<Reservation | null>(null)

  const [timeLeft, setTimeLeft] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservation()
  }, [])

  useEffect(() => {
    if (!reservation) return

    const timer = setInterval(() => {
      const now = new Date().getTime()

      const expiry = new Date(
        reservation.expiresAt
      ).getTime()

      const distance = expiry - now

      if (distance <= 0) {
        setTimeLeft("Expired")
        clearInterval(timer)
        return
      }

      const minutes = Math.floor(
        distance / (1000 * 60)
      )

      const seconds = Math.floor(
        (distance % (1000 * 60)) / 1000
      )

      setTimeLeft(
        `${minutes}m ${seconds}s`
      )
    }, 1000)

    return () => clearInterval(timer)
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      setMessage("Something went wrong")
    }
  }

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="p-10">
        {message}
      </div>
    )
  }

  return (
    <div className="p-10">
      <button
        onClick={() => router.push("/")}
        className="mb-5 border px-4 py-2 rounded"
      >
        Back
      </button>

      <div className="border p-6 rounded max-w-xl">
        <h1 className="text-3xl font-bold mb-5">
          Reservation
        </h1>

        {message && (
          <div className="bg-blue-200 p-3 rounded mb-4">
            {message}
          </div>
        )}

        <p>
          Product:{" "}
          {reservation.product.name}
        </p>

        <p className="mt-2">
          Warehouse:{" "}
          {reservation.warehouse.name}
        </p>

        <p className="mt-2">
          Quantity: {reservation.quantity}
        </p>

        <p className="mt-2">
          Status: {reservation.status}
        </p>

        <p className="mt-2 text-red-600 font-semibold">
          Expires In: {timeLeft}
        </p>

        {reservation.status === "pending" && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={confirmReservation}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Confirm Purchase
            </button>

            <button
              onClick={cancelReservation}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}