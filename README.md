# Does My Carry-On Fit?

**[doesmycarryon.fit](https://doesmycarryon.fit)** — instantly check if your carry-on luggage meets cabin size requirements for 94 airlines.

Default preset is the **Rimowa Original Cabin** (55 × 40 × 23 cm). Enter any custom dimensions and bookmark the URL to save your bag.

---

## Features

- 94 airlines with cabin dimensions and weight limits
- Economy / Business class toggle
- Optional weight check
- Bookmarkable URLs — `?h=55&w=40&d=23&kg=4.2&cls=economy`
- Orientation-agnostic check (bag is compared in its most favorable orientation)
- Search and filter by pass / fail
- Mobile-first, no dependencies, no tracking

## Running locally

Requires [Node.js](https://nodejs.org/) 20+ and Python 3.

```bash
git clone https://github.com/olizimmermann/doesmycarryonfit.git
cd doesmycarryonfit
npm ci
npm run dev
```

Open [http://localhost:8787](http://localhost:8787).

## Deployment

The site runs on **Cloudflare Workers** (free plan): the files in `web/` are served as
[static assets](https://developers.cloudflare.com/workers/static-assets/) (free and unlimited),
and a small Worker (`src/worker.js`) answers only the `/status` usage beacon.

**Option A — Git integration (recommended, no API token stored anywhere):**
Cloudflare dashboard → Workers & Pages → Create → Import a repository → select this repo.
Deploy command: `npx wrangler deploy`. Every push to `main` deploys.

**Option B — from your machine:**

```bash
npx wrangler login
npm run deploy
```

Test on the `*.workers.dev` URL first. To go live on the real domain, delete the old DNS
record for the apex, uncomment the `routes` entry in `wrangler.jsonc`, and deploy again.

Beacon events are visible under Workers & Pages → doesmycarryonfit → Observability → Logs.

## Data

Airline cabin policies are stored in `web/app.js`. The data was compiled from official airline websites and is provided as-is.

> **Disclaimer:** Airline policies change frequently. Always verify with your airline before travel. This tool offers no guarantee of accuracy.

If you spot an error or want to add an airline, [open an issue](https://github.com/olizimmermann/doesmycarryonfit/issues).

## Project structure

```
.
├── wrangler.jsonc          # Cloudflare config: assets, beacon rate limit, logs
├── src/
│   └── worker.js           # /status beacon: validates, rate-limits, logs
├── scripts/
│   └── build.py            # writes web/version.js (commit hash)
└── web/
    ├── _headers            # security + cache headers
    ├── index.html
    ├── style.css
    ├── app.js              # Airline data + check logic
    ├── robots.txt
    └── sitemap.xml
```

## Contributing

Pull requests for data corrections are welcome. For anything beyond data, please open an issue first to discuss.

1. Fork the repo
2. Edit the `AIRLINES` array in `web/app.js`
3. Include a link to the official airline source in your PR description

## Support

If this tool saved your trip, consider buying me a coffee.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/olizimmermann)

## License

MIT
