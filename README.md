# বাজার দর | BazarDor

বাজার দর shows current prices for essential products in one place. Browse prices by category, compare market ranges, and keep track of daily price changes.

## Features

- Browse products with current prices, units, and price-change indicators.
- Filter products by category and search by product name.
- Sort prices from low to high or high to low, including Bengali numerals.
- View product price summaries and market-by-market comparisons.
- Create an account, sign in, and update your profile name.
- Responsive layouts with loading skeletons and friendly not-found pages.

## Built With

- Next.js App Router and React
- Tailwind CSS
- Better Auth
- MongoDB Node.js driver
- Sonner notifications

## Getting Started

### Requirements

- Node.js supported by the installed Next.js version
- A MongoDB deployment

### Install and run

```bash
npm install
```

Create `.env.local` with the following values:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bazar-dor
BETTER_AUTH_SECRET=<random-secret-at-least-32-characters>
BETTER_AUTH_URL=http://localhost:3000
```

Generate a secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

Keep `.env.local` private and set the production `BETTER_AUTH_URL` to the deployed app origin.
