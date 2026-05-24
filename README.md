````md
# Allo Inventory Reservation System

A simple inventory reservation system built with Next.js, Prisma, Supabase PostgreSQL, and Tailwind CSS.

## Features

- View products
- Track warehouse stock
- Reserve products
- Confirm or cancel reservations
- Auto-expire reservations after 10 minutes
- Safe concurrent reservations using database transactions

---

## Tech Stack

- Next.js
- TypeScript
- Prisma
- Supabase PostgreSQL
- Tailwind CSS

---

## Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPO_URL
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env`

```env
DATABASE_URL="YOUR_DATABASE_URL"
```

### 4. Setup Database

```bash
npx prisma db push
npx prisma generate
```

### 5. Seed Sample Data

```bash
npx tsx prisma/seed.ts
```

### 6. Start the App

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Reservation Process

1. User reserves a product
2. Stock is temporarily locked
3. Reservation expires after 10 minutes
4. User can confirm or cancel the reservation
5. Expired reservations are automatically released

---

## Deployment

* Frontend deployed on Vercel
* Database hosted on Supabase PostgreSQL

```
