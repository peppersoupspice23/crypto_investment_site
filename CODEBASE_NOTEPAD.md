# Level Inspired Codebase Notepad

Date: 2026-06-27

## Current Repo Shape

This is now one GitHub-linked monorepo:

```text
crypto_investment_site/
  backend/API files at repo root
  frontend/ Next.js app
```

GitHub remote:

```text
https://github.com/peppersoupspice23/crypto_investment_site.git
```

Latest pushed commit:

```text
cc4c977 chore: add frontend workspace to main repo
```

## Completed From The Previous List

1. Push committed work to GitHub: done.
2. Decide repo structure: done. We chose monorepo.
3. Draft project questionnaire: started in `PROJECT_QUESTIONNAIRE.md`.

## Important Files

- `PROJECT_QUESTIONNAIRE.md`: questions for product, frontend, backend, live trading, admin, community, achievements, testing, and deployment decisions.
- `PROJECT_STATUS_REPORT.md`: current status report.
- `DEPLOYMENT.md`: backend deployment notes.
- `frontend/DEPLOYMENT.md`: frontend deployment notes.
- `.env.example`: safe backend env template.
- `frontend/.env.example`: safe frontend env template.

## Safety Note

The backend `.env` file is ignored and should not be pushed. Use `.env.example` for documentation.

## What Is Built

- Level Inspired branding.
- Green/emerald interface accent.
- Live CoinGecko price service on the backend.
- Market endpoints:
  - `GET /api/market/prices`
  - `GET /api/market/history/:symbol`
- Wallet valuation using live prices.
- Buy/sell trading using live prices.
- Chart fallback when CoinGecko history is rate-limited.
- Dashboard with market cards, portfolio value, P/L, BTC chart, holdings, performance metrics, and recent activity.
- Deposit/withdraw demo cash UI.
- Trade screen with live quote, chart, holdings, and trade history.
- Starter pages:
  - exchange comparison
  - community feed
  - achievements
  - admin dashboard
- Backend tests.
- Frontend smoke tests.

## Verified Recently

```bash
npm test
node --check server.js

cd frontend
npm test
npm run lint
npm run build
```

Browser testing also confirmed:

- signup works
- `$10,000` starting demo wallet works
- deposit works
- live prices load
- buy BTC works
- holdings update
- trade history updates
- chart renders

## Current Next Work List

1. Fill in `PROJECT_QUESTIONNAIRE.md`.
2. Improve mobile/responsive polish across dashboard and trades.
3. Add real admin data instead of starter admin placeholders.
4. Make achievements dynamic from user trades/holdings.
5. Turn community feed into backend-backed posts/comments.
6. Research first live exchange integration and define live-mode safety flow.
7. Add stronger automated API tests for auth, wallet, deposit, withdraw, buy, sell.
8. Prepare production deployment on Vercel plus Render/Railway/Fly.

