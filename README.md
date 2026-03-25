# Does My Carry-On Fit?

**[doesmycarryon.fit](https://doesmycarryon.fit)** — instantly check if your carry-on luggage meets cabin size requirements for 95 airlines.

Default preset is the **Rimowa Original Cabin** (55 × 40 × 23 cm). Enter any custom dimensions and bookmark the URL to save your bag.

---

## Features

- 95 airlines with cabin dimensions and weight limits
- Economy / Business class toggle
- Optional weight check
- Bookmarkable URLs — `?h=55&w=40&d=23&kg=4.2&cls=economy`
- Orientation-agnostic check (bag is compared in its most favorable orientation)
- Search and filter by pass / fail
- Mobile-first, no dependencies, no tracking

## Running locally

Requires [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/).

```bash
git clone https://github.com/olizimmermann/doesmycarryonfit.git
cd doesmycarryonfit
docker compose up
```

Open [http://localhost](http://localhost).

## Deployment

The service is designed to run on a VPS behind **Cloudflare**. Nginx is configured to accept connections only from [Cloudflare's IP ranges](https://www.cloudflare.com/ips/) — all other traffic is silently dropped (`444`).

```bash
docker compose up -d
```

Point your Cloudflare DNS A record to your VPS IP. Set the proxy to **Proxied** (orange cloud). No SSL configuration is needed on the origin — Cloudflare handles TLS termination.

To keep the Cloudflare IP allowlist current, update the `geo` block in `nginx/nginx.conf` whenever Cloudflare publishes changes.

## Data

Airline cabin policies are stored in `web/app.js`. The data was compiled from official airline websites and is provided as-is.

> **Disclaimer:** Airline policies change frequently. Always verify with your airline before travel. This tool offers no guarantee of accuracy.

If you spot an error or want to add an airline, [open an issue](https://github.com/olizimmermann/doesmycarryonfit/issues).

## Project structure

```
.
├── docker-compose.yml
├── nginx/
│   └── nginx.conf          # Cloudflare IP allowlist, security headers, gzip
└── web/
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
