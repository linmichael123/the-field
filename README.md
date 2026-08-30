# THE FIELD

A tweetable spectator site. Two armies. Ten banners. Bid size is unit size. The hill is for sale.

This is the **X demo slice**: the page *is* the clip. People watch the shove. They click a banner. They do not walk, climb, or unlock a pointer.

## How to run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`). The field is live on first paint — seeded brands, a moving front, a bid ticker.

```bash
npm run build
npm run preview
```

## Cloudflare Pages

| | |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| SPA redirects | `public/_redirects` → `/* /index.html 200` |

Static only. No backend, no auth, no Stripe. All auction state lives in memory after load.

## What you are looking at

- **Ten spots** — five Iron, five Steel — seeded in `src/data/field.json` (copied feel: live bids, fake history, invented brands).
- **Front line** `p = (sumA − sumB) / (sumA + sumB + ε)`, eased in seconds. Units shuffle with it.
- **Slot price** rises on the side that has pushed, discounts on the losing side. Shown on the flag and in the list.
- **One identity** — Place bid is local. You cannot buy a second banner. A quiet scout bids the weaker line so the fight never freezes.
- **Cinematic camera** — 3/4, breathing. Click a regiment or a list row for the overlay.

Not a walking sim. Not a win card. The product is the shove.
