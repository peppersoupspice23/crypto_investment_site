# Level Inspired Backend

Express + MongoDB API for the Level Inspired crypto trading simulator.

## Features

- JWT signup/login.
- Demo wallet with `$10,000` starting balance.
- Deposit and withdraw demo USD.
- Live CoinGecko price service with short caching.
- Simulated buy/sell trading using live prices.
- Holdings, transactions, trade history, portfolio performance, and market chart endpoints.

## Local Setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Scripts

- `npm start`: run the API.
- `npm run dev`: run with nodemon.
- `npm test`: run Node test suite.

## Environment

- `PORT`: default `5050`.
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: long random signing secret.
- `CLIENT_URL`: frontend origin.

## Deployment

See `DEPLOYMENT.md`.
