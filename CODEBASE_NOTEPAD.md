# Level Inspired Codebase Notepad

Date: 2026-06-23

## Where We Are

This workspace has two separate Git repos:

- `crypto-invest-demo`: backend/API repo.
- `crypto-trading-frontend`: frontend/Next.js repo.

Both repos are committed locally and safe before pushing.

## Current Local Commits

Backend:

```bash
cd "crypto-invest-demo"
git log -1 --oneline
```

Current commit:

```text
b9020d4 feat: launch live-price Level Inspired workspace
```

Frontend:

```bash
cd "crypto-trading-frontend"
git log -1 --oneline
```

Current commit:

```text
f09590c feat: launch live-price Level Inspired workspace
```

## Backup Bundles

These backup bundles are saved at the workspace root:

- `crypto-invest-demo-backup-b9020d4.bundle`
- `crypto-trading-frontend-backup-f09590c.bundle`

They are local safety copies of the committed work.

## GitHub Push Status

Backend already has a GitHub remote:

```text
origin https://github.com/peppersoupspice23/crypto_investment_site.git
```

Frontend does not currently have a remote configured.

## Push From VS Code

### Backend Push

Open this folder in VS Code:

```text
crypto-invest-demo
```

Then use Source Control and push `main`.

Or use the terminal inside VS Code:

```bash
cd "/Users/roastedplantain/Documents/Documents - Roasted’s MacBook Pro/crypto-invest-demo"
git push origin main
```

### Frontend Push

Open this folder in VS Code:

```text
crypto-trading-frontend
```

First add a GitHub remote. Replace `YOUR_FRONTEND_REPO_URL` with the repo URL you want to use:

```bash
cd "/Users/roastedplantain/Documents/Documents - Roasted’s MacBook Pro/crypto-trading-frontend"
git remote add origin YOUR_FRONTEND_REPO_URL
git push -u origin main
```

If you want one combined repo instead, we should convert the project into a monorepo before pushing the frontend.

## Important Safety Note

The backend `.env` file is now ignored and should not be pushed. Use `.env.example` for safe environment variable documentation.

## What Was Built

- Rebranded the app to `Level Inspired`.
- Switched the interface accent from blue to green/emerald.
- Added live CoinGecko price service on the backend.
- Added shared market endpoints:
  - `GET /api/market/prices`
  - `GET /api/market/history/:symbol`
- Updated wallet valuation to use live prices.
- Updated buy/sell trading to use live prices.
- Added chart fallback when CoinGecko history is rate-limited.
- Added frontend live dashboard with:
  - market cards
  - portfolio value
  - P/L
  - BTC chart
  - holdings
  - performance metrics
  - recent activity
- Added deposit/withdraw demo cash UI.
- Added live-price trade screen with chart, holdings, and trade history.
- Added starter pages:
  - exchange comparison
  - community feed
  - achievements
  - admin dashboard
- Added backend tests.
- Added frontend smoke tests.
- Added deployment docs inside both repos.

## Verified Before Push

These passed:

```bash
cd crypto-invest-demo
npm test
node --check server.js

cd ../crypto-trading-frontend
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

## Next Work List

1. Push backend repo from VS Code.
2. Decide frontend repo URL or convert to monorepo.
3. Push frontend repo.
4. Draft the project questionnaire for:
   - frontend design
   - backend/API decisions
   - user roles
   - live trading direction
   - branding
   - deployment
   - admin/community/achievement features
5. Make achievements dynamic from actual trades and holdings.
6. Make community feed backend-backed.
7. Add real admin data and admin authorization.
8. Expand backend tests for auth, wallet, deposit, withdraw, buy, sell.
9. Polish mobile/responsive views.
10. Research the first live exchange integration.
11. Define live-mode safety controls before any real-money execution.
12. Deploy backend and frontend.

