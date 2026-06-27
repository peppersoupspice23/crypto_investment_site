# Level Inspired Frontend

Next.js frontend for the Level Inspired crypto trading simulator. It includes auth screens, a live-price portfolio dashboard, deposit/withdraw demo cash controls, simulated buy/sell trading, exchange comparison, community, achievements, and admin starter views.

## Local Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev`: start the local dev server.
- `npm run build`: create a production build.
- `npm start`: run the production build.
- `npm run lint`: run ESLint.
- `npm test`: run smoke tests.

## Environment

`NEXT_PUBLIC_API_URL` should point at the Express backend. Locally this is usually `http://localhost:5050`.

## Deployment

See `DEPLOYMENT.md`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
