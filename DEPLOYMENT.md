# Level Inspired Backend Deployment

## Local Development

```bash
cp .env.example .env
npm install
npm run dev
```

## Production

Recommended targets: Render, Railway, Fly.io, or a VPS.

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Required environment variables:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`

## Verification

```bash
curl https://YOUR_BACKEND_URL/
curl https://YOUR_BACKEND_URL/api/market/prices
```

## Notes

- CoinGecko is the current live market-data source.
- Price responses are cached for one minute.
- Chart history falls back to generated price history if CoinGecko rate-limits historical data.
- Trading is still simulated. Real exchange execution needs account linking, exchange-specific auth, compliance checks, and explicit user confirmation before live orders.
