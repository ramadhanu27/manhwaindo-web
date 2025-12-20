# ManhwaIndo Web - Deployment Guide

## ⚠️ Important: CSS Not Loading Issue

There's currently an issue with static assets (CSS/JS) not being served correctly on Cloudflare Pages with OpenNext. This is being investigated.

### Temporary Workaround

Until the issue is resolved, you can:

1. Use local development: `npm run dev`
2. Wait for the fix to be deployed

### Current Status

- ✅ Server-side rendering works
- ✅ HTML is generated correctly
- ❌ Static assets (CSS, JS) return 404
- 🔧 Fix in progress

## Cloudflare Pages Deployment

**Build Configuration:**

- **Build command**: `npm run pages:build`
- **Build output directory**: `.open-next/assets`
- **Root directory**: (leave empty)

### How it works

1. `npm run pages:build` runs:

   - `next build` - Builds the Next.js app
   - `npx opennextjs-cloudflare build` - Converts to Cloudflare format
   - `npm run copy-worker` - Copies worker files

2. The build generates:
   - `.open-next/assets/` - Static assets
   - `functions/_worker.js` - Cloudflare Worker for SSR
   - `functions/cloudflare/` - Worker dependencies

### Local Development

```bash
# Development server
npm run dev

# Build for production
npm run pages:build

# Test locally with Wrangler
npm run pages:dev
```

### Troubleshooting

**CSS not loading in production:**

- This is a known issue being fixed
- The problem is static assets not being served correctly
- A fix is being deployed

**Build fails:**

- Clear cache: Delete `.next` and `.open-next` folders
- Reinstall: `npm install`
- Rebuild: `npm run pages:build`

**Development server errors:**

- Clear cache: Delete `.next` folder
- Restart: `npm run dev`
