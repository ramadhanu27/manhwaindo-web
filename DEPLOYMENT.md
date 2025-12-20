# Manhwaindo Web - Deployment Guide

## Cloudflare Pages Deployment

This project uses **OpenNext** to deploy Next.js to Cloudflare Pages.

### Build Configuration

**In Cloudflare Pages Dashboard:**

- **Build command**: `npm run pages:build`
- **Build output directory**: `.open-next/assets`
- **Root directory**: (leave empty)

### How it works

1. `npm run pages:build` runs:

   - `next build` - Builds the Next.js app
   - `npx opennextjs-cloudflare build` - Converts Next.js build to Cloudflare format
   - `npm run copy-worker` - Copies the worker to `functions/` directory

2. The build generates:

   - `.open-next/assets/` - Static assets (HTML, CSS, JS, images)
   - `.open-next/worker.js` - Cloudflare Worker for server-side rendering
   - `functions/_worker.js` - Copy of worker for Cloudflare Pages Functions
   - `functions/cloudflare/` - Worker dependencies

3. Cloudflare Pages serves:
   - Static files from `.open-next/assets/`
   - Dynamic routes via `functions/_worker.js`

### Local Development

```bash
# Development server
npm run dev

# Build for production
npm run pages:build

# Test locally with Wrangler
npm run pages:dev

# Deploy to Cloudflare (if using CLI)
npm run pages:deploy
```

### Important Notes

- The `functions/` directory **must be committed** to Git
- `.open-next/` is ignored but `functions/` contains the built worker
- Build must complete successfully before deployment
- Cloudflare Pages will automatically use `functions/_worker.js` for all routes

### Troubleshooting

**404 Error on deployment:**

- Ensure `functions/_worker.js` exists after build
- Check Cloudflare Pages build logs
- Verify build command is `npm run pages:build`

**Build fails:**

- Check Node.js version (requires 18+)
- Clear `.next` and `.open-next` folders
- Run `npm install` to ensure all dependencies are installed
