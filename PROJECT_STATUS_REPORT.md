# Level Inspired Project Status Report

Date: 2026-06-11

## Current Shape

The project is split into two local repos:

- `crypto-invest-demo`: Express + MongoDB backend for auth, wallets, live market data, demo trading, transactions, and portfolio performance.
- `crypto-trading-frontend`: Next.js frontend for login/signup, dashboard, live charting, deposits/withdrawals, trading, exchange comparison, community, achievements, and admin starter views.

The Notion board items are now represented in the codebase. Auth, demo wallet balance, simulated trading, live pricing, portfolio performance, deposit/withdraw UI, deployment docs, and the expansion screens all have working starter implementations.

## Completed In This Pass

- Rebranded the app to `Level Inspired` until a final name is chosen.
- New users start with `$10,000` demo USD.
- Added a backend market service using CoinGecko live prices with one-minute caching.
- Added backend market endpoints:
  - `GET /api/market/prices`
  - `GET /api/market/history/:symbol`
- Updated wallet holdings and portfolio valuation to use the shared live price service.
- Updated buy/sell trade execution to use live prices instead of fixed demo prices.
- Updated frontend `lib/api.js` so the browser calls the backend market API instead of calling CoinGecko directly.
- Rebuilt the dashboard with live market cards, BTC chart, portfolio value, P/L, allocation, performance metrics, recent trades, recent transactions, and clear empty states.
- Added deposit/withdraw demo cash UI.
- Rebuilt the trading screen with live price cards, selected-asset chart, live previews, holdings, and trade history.
- Added exchange comparison, community feed, achievements, and admin starter pages.
- Added automated tests:
  - Backend market service tests.
  - Frontend route/API smoke tests.
- Added deployment configuration docs and environment examples.

## Verification

- Backend tests pass: `npm test`.
- Frontend tests pass: `npm test`.
- Frontend lint passes: `npm run lint`.
- Backend syntax check passes: `node --check server.js`.
- Frontend production build passes: `npm run build`.
- Live price endpoint verified locally with CoinGecko source.

## Resolved Blocker

MongoDB Atlas DNS originally failed for the configured database host:

`_mongodb._tcp.cluster0.1kvjdkt.mongodb.net`

Observed error was:

`querySrv ENOTFOUND`

After DNS checks and a backend restart, the API connected successfully:

`MongoDB connected`

Authenticated flows now work locally. A browser test created a demo user, loaded the `$10,000` wallet, deposited `$250`, bought `$100` of BTC, and confirmed holdings/trade history updated.

## Runtime Verified

- Backend is running on `http://localhost:5050`.
- Frontend is running on `http://localhost:3000`.
- Live spot prices return from CoinGecko.
- Chart history returns CoinGecko data when available.
- Chart history now falls back to generated price history if CoinGecko rate-limits the historical endpoint.
- Login/signup, dashboard, deposit, trade, holdings, and trade history have been exercised in the browser.

## Next Decisions

- Decide which exchange integration to research first for eventual live accounts.
- Decide whether real-money/live exchange execution should remain behind a separate “live mode” toggle and stricter confirmations.
