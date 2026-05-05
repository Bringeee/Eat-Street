# Deployment Guide

This project is configured for static prerender deployment on Vercel.

## Current Output

The production build now generates static HTML files in `dist/client`, including:

- `dist/client/index.html`
- `dist/client/about/index.html`
- `dist/client/categories/index.html`
- `dist/client/contact/index.html`
- `dist/client/gallery/index.html`
- `dist/client/menu/index.html`
- `dist/client/reviews/index.html`
- `dist/client/services/index.html`
- `dist/client/admin/index.html`

This structure works with Vercel static output hosting.

## Recommended Target: Vercel

The repository already includes `vercel.json` with:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist/client`

### 1) Prerequisites

- Vercel account
- Project pushed to GitHub
- Node.js installed

### 2) Add environment variables in Vercel

Add any required `VITE_` variables in Project Settings -> Environment Variables.

Examples:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Firebase-related `VITE_` vars if used

### 3) Deploy from Git integration

1. Import your GitHub repository in Vercel.
2. Keep the detected `vercel.json` settings.
3. Click Deploy.

### 4) Optional CLI deploy

Preview deploy:

```bash
npm run deploy:vercel:preview
```

Production deploy:

```bash
npm run deploy:vercel
```

## Files Used For Deployment

- `vite.config.ts` (prerender route config)
- `vercel.json`
- `package.json` scripts `deploy:vercel` and `deploy:vercel:preview`

## Notes

- You can still deploy elsewhere, but Vercel is now the primary configured target.
- If you add new routes, include them in `vite.config.ts` prerender pages to generate static HTML for them.
