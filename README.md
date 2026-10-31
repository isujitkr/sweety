# Sweety – Blood Glucose Tracker

Sweety lets a person with diabetes record up to 4 blood glucose readings a day and view daily, month-to-date and previous-month reports.

**Stack:** Node.js + Express API · PostgreSQL · React (Vite)

## Features

- Sign up / log in (passwords hashed with bcrypt, login via JWT). Each user sees only their own readings.
- Add, edit and delete readings: date, time slot (Morning (fasting), After breakfast, After lunch, After dinner) and value in mg/dl.
- Validation, with clear messages shown in the UI:
  - value required · whole number from 40 to 600 · one reading per slot per day · max 4 per day · date not in the future
- Reports (highest, lowest, average to 1 decimal, count, with a friendly empty state):
  - **Daily** – the selected date, plus each reading with its slot
  - **Month-to-date** – 1st of the month up to the selected date
  - **Previous month** – the whole month before the selected date

## Project structure

```
sweety/
├── server/                 Express API
│   ├── db/schema.sql       Tables: users, readings
│   ├── scripts/            migrate.js, seed.js
│   ├── src/
│   │   ├── lib/            dates.js, stats.js, validation.js (pure, unit-tested)
│   │   ├── middleware/     auth.js (JWT check)
│   │   └── routes/         auth.js, readings.js, reports.js
│   └── tests/              Jest tests
└── client/                 React app (Vite)
    └── src/                pages/, components/, api.js
```

## Prerequisites

- Node.js 18 or newer
- PostgreSQL 13 or newer, running locally

## 1. Install

```bash
git clone https://github.com/isujitkr/sweety.git
cd sweety

cd server && npm install
cd ../client && npm install
```

## 2. Set up the database

Create an empty database (the name `sweety` matches `.env.example`):

```bash
createdb sweety
# or, from psql:  CREATE DATABASE sweety;
```

Create the environment file and edit it so `DATABASE_URL` matches your Postgres user and password:

```bash
cd server
cp .env.example .env
```

| Variable        | Meaning                                                  |
| --------------- | -------------------------------------------------------- |
| `PORT`          | Port for the API (default `8000`)                        |
| `DATABASE_URL`  | `postgres://USER:PASSWORD@HOST:PORT/DATABASE`            |
| `JWT_SECRET`    | Long random string used to sign login tokens             |
| `FRONTEND_URL` | URL of the React app, allowed by CORS (`http://localhost:5173`) |

Create the tables, then load the demo data:

```bash
npm run migrate
npm run seed
```

The seed creates a demo user with about 45 days of sample readings:

- **Email:** `demo@sweety.app`
- **Password:** `demo1234`

You can run `npm run seed` again at any time; it resets the demo user's readings.

## 3. Run the server

```bash
cd server
npm run dev      # auto-restarts on changes
# or: npm start
```

The API runs at http://localhost:8000 (check http://localhost:8000/api/health).

## 4. Run the client

In a second terminal:

```bash
cd client
npm run dev
```

Open http://localhost:5173. In development, Vite forwards `/api` requests to the server on port 4000, so no client configuration is needed. For a deployed build, copy `client/.env.example` to `client/.env` and set `VITE_API_URL`, then run `npm run build`.

## 5. Run the tests

```bash
cd server
npm test
```

The tests cover reading validation (all five rules and their messages), report date ranges (including January and leap-year February), the statistics and rounding, and the sign-up validation and login guard. They need **no database**.

## API overview

All routes except `/auth/*` need the header `Authorization: Bearer <token>`.

| Method | Route                        | Purpose                                      |
| ------ | ---------------------------- | -------------------------------------------- |
| POST   | `/api/auth/signup`           | Create account `{ name, email, password }`   |
| POST   | `/api/auth/login`            | Log in `{ email, password }`                 |
| GET    | `/api/readings?date=`        | My readings (optionally for one date)        |
| POST   | `/api/readings`              | Add `{ date, slot, value }`                  |
| PUT    | `/api/readings/:id`          | Edit a reading                               |
| DELETE | `/api/readings/:id`          | Delete a reading                             |
| GET    | `/api/reports/daily?date=`         | Daily report                           |
| GET    | `/api/reports/month-to-date?date=` | Month-to-date report                   |
| GET    | `/api/reports/monthly?date=`       | Previous month's report                |

`slot` is one of `morning`, `after_breakfast`, `after_lunch`, `after_dinner`. Dates are `YYYY-MM-DD`; `date` defaults to today for reports.

## Design notes

- **Rules enforced twice.** The API checks every rule and returns a clear message. The database also has a `CHECK` on value, a `CHECK` on slot and a `UNIQUE (user_id, reading_date, slot)` constraint, so bad data cannot get in even if two requests arrive at the same time.
- **Dates are plain `YYYY-MM-DD` strings** end to end (the `pg` driver is set to return `DATE` columns as strings), which avoids time zone shifts.
- **"Today" is decided by the server's clock.** If the server and the user are in very different time zones, the last few hours of the day may be rejected as "in the future".
- **`bcryptjs`** is used instead of `bcrypt`. It is the same algorithm, written in pure JavaScript, so it installs on any machine without compiling native code.

