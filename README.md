# WriteSpace

WriteSpace is a local-first personal publishing application built as a static React SPA. It lets guests discover recent writing, gives registered writers a browser-local place to publish plain-text posts, and gives the demo Admin local post and account controls. No server, REST API, external provider, or database is used: records persist only in the current browser's `localStorage`.

## Stack

- React 18 + Vite 5
- React Router DOM 6
- Tailwind CSS 3
- Vitest + Testing Library
- Playwright
- Static nginx container and Vercel SPA rewrite

## Run locally

```bash
cd frontend
npm install --no-bin-links
node node_modules/vite/bin/vite.js
```

Open the address printed by Vite, normally `http://localhost:5173`.

## Demo account

- Username: `admin`
- Password: `admin`

This is a local MVP. Passwords are stored as plain text in browser storage by design, so do not use a real password or sensitive content.

## Browser-local records

WriteSpace uses these keys:

- `writespace_posts` - post records
- `writespace_users` - registered local accounts
- `writespace_session` - active browser session

Clearing site storage removes locally created users, posts, and the active session. The default `admin` / `admin` identity remains available.

## Quality commands

```bash
cd frontend
node node_modules/vitest/vitest.mjs run
node node_modules/vite/bin/vite.js build
node node_modules/@playwright/test/cli.js test --config playwright.config.js
```

The Playwright suite starts Vite through `frontend/playwright.config.js` and saves screenshot evidence in its test-result output.

## Deployment

### Vercel

`vercel.json` contains the required SPA rewrite to `/index.html`, so direct navigation to client routes works after deployment. Configure the deployment root to build the `frontend/` project and publish `frontend/dist`.

### Container

The frontend Dockerfile builds the Vite bundle and serves it with nginx on port 80. `frontend/nginx.conf` supplies the history fallback needed for client-side routes.

```bash
docker build -t writespace ./frontend
docker run --rm -p 8080:80 writespace
```

## License

Private and proprietary. All rights reserved.
