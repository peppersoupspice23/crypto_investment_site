# Level Inspired Frontend Deployment

## Local Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

The frontend expects `NEXT_PUBLIC_API_URL` to point at the backend. Locally this is usually:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5050
```

## Production

Recommended target: Vercel.

Build command:

```bash
npm run build
```

Start command:

```bash
npm start
```

Required environment variable:

- `NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL`

## Verification

- `/login` loads with Level Inspired branding.
- Signup routes to the dashboard.
- Dashboard loads live prices, portfolio metrics, and demo cash actions.
- `/trades` shows live prices, chart history, holdings, and trade history.
- `/exchanges`, `/community`, `/achievements`, and `/admin` load.
