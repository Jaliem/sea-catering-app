# SEA Catering App

A modern full-stack web application for managing catering subscriptions, built with Next.js, Prisma, and Tailwind CSS. The app supports user authentication, subscription management, admin analytics, user profiles, and customer testimonials.

## Features

- User registration, login, and session management
- Secure backend authentication (no localStorage for sensitive data)
- User profile management (phone, address, date of birth, preferences, etc.)
- Subscription management (subscribe, pause, resume, cancel)
- Admin dashboard with analytics (MRR, growth, date range filtering)
- Admin user and subscription management
- Customer testimonials with rating and review system
- Responsive, modern UI with robust loading and error states
- Input validation and XSS sanitization on backend

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/) (or your preferred DB)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- PostgreSQL (or compatible database)

### Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Jaliem/sea-catering-app
   cd sea-catering-app
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database and secret values.

4. **Set up the database:**
   ```sh
    npx prisma migrate deploy
    node prisma/seed-admin.js
    node prisma/seed-meal-plans.js
   ```

5. **Run the develop ment server:**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app/` — Next.js app directory (pages, API routes)
- `components/` — Reusable React components
- `hooks/` — Custom React hooks
- `lib/` — Utility functions and Prisma client
- `prisma/` — Prisma schema, migrations, and seed scripts
- `public/` — Static assets
- `styles/` — Global styles

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm prisma` — Run Prisma CLI

## Security & Validation
- All user input is validated and sanitized on the backend.
- Prisma uses parameterized queries to prevent SQL injection.
- Authentication/session state is managed securely via backend APIs.

**SEA Catering App** — Eat well, live well!
