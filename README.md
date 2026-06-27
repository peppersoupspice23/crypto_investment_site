# Level Inspired Crypto Investment Site

Full-stack live-price crypto trading simulator.

This repository now contains both sides of the project:

- Backend/API at the repository root.
- Frontend/Next.js app in `frontend/`.

## What Is Built

- JWT signup/login.
- Demo wallet with `$10,000` starting balance.
- Deposit and withdraw demo USD.
- Live CoinGecko market prices.
- Simulated buy/sell trading using live prices.
- Portfolio holdings, transaction history, trade history, performance metrics, and chart data.
- Frontend dashboard with live prices, allocation, performance, recent activity, and green/emerald styling.
- Trade screen with live quotes, chart, holdings, and trade history.
- Starter pages for exchange comparison, community, achievements, and admin.
- Backend tests and frontend smoke tests.
- Deployment docs and env examples.

## Local Setup

Backend:

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

By default:

- Backend runs on `http://localhost:5050`.
- Frontend runs on `http://localhost:3000`.

## Scripts

Backend:

```bash
npm start
npm run dev
npm test
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm start
npm run lint
npm test
```

## Environment

Backend:

- `PORT`: default `5050`.
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: long random signing secret.
- `CLIENT_URL`: frontend origin.

Frontend:

- `NEXT_PUBLIC_API_URL`: backend URL, usually `http://localhost:5050`.

## Project Notes

- See `CODEBASE_NOTEPAD.md` for the current project handoff notes and next work list.
- See `PROJECT_STATUS_REPORT.md` for the status report.
- See `DEPLOYMENT.md` for backend deployment notes.
- See `frontend/DEPLOYMENT.md` for frontend deployment notes.

## Safety

The backend `.env` file is ignored and should not be committed. Use `.env.example` for safe documentation.

