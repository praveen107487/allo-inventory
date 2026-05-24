# Allo Inventory Reservation System

A simple inventory reservation system built using Next.js, Prisma, Supabase PostgreSQL and Tailwind CSS.

## Features

- Product listing
- Warehouse inventory tracking
- Reserve stock
- Confirm reservation
- Cancel reservation
- Reservation expiry
- Concurrency-safe reservation logic
- Live countdown timer

---

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma
- Supabase PostgreSQL
- Tailwind CSS

---

## Setup Instructions

## 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPO_URL
```

## 2. Install Packages

```bash
npm install
```

## 3. Setup Environment Variables

Create `.env`

```env
DATABASE_URL="YOUR_DATABASE_URL"
```

---

## 4. Push Prisma Schema

```bash
npx prisma db push
```

---

## 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Seed Database

```bash
npx tsx prisma/seed.ts
```

---

## 7. Run Application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Reservation Flow

1. User reserves a product
2. Stock becomes temporarily reserved
3. Reservation expires after 10 minutes
4. User can:
   - confirm purchase
   - cancel reservation
5. Expired reservations are released automatically

---

# Concurrency Handling

The reservation endpoint uses Prisma database transactions.

Inventory checking and reserved stock updates happen inside the same transaction to prevent race conditions when multiple users try reserving the same product simultaneously.

---

# Expiry Handling

Lazy cleanup approach is used.

Whenever products are fetched, expired pending reservations are automatically released and stock becomes available again.

---

# Trade-offs

- Redis locking was not used to keep the implementation simpler
- Lazy cleanup was chosen instead of cron jobs
- UI was kept minimal to focus more on backend correctness

---

# Deployment

Frontend deployed on Vercel.

Database hosted on Supabase PostgreSQL.