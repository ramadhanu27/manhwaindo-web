# Deploy to Vercel

## Quick Start

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

   - Visit the URL shown in terminal
   - Login with GitHub or email
   - Authorize Vercel CLI

3. **Deploy**:

   ```bash
   vercel
   ```

   - Follow the prompts
   - Choose project settings
   - Wait for deployment to complete

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Configuration

The project is configured with `vercel.json`:

- Build command: `next build`
- Framework: Next.js
- Output: `.next`

## Environment Variables

If you have environment variables in `.env.local`, you need to add them to Vercel:

1. Go to your project on Vercel Dashboard
2. Settings → Environment Variables
3. Add each variable from `.env.local`

## Automatic Deployments

Once connected to GitHub:

- Every push to `main` branch → Production deployment
- Every pull request → Preview deployment

## Custom Domain

1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Advantages of Vercel

✅ **Zero Configuration** - Next.js works out of the box
✅ **Automatic HTTPS** - Free SSL certificates
✅ **Global CDN** - Fast worldwide
✅ **Automatic Deployments** - Push to deploy
✅ **Preview Deployments** - Test before production
✅ **Built-in Analytics** - Performance monitoring

## Troubleshooting

**Build fails:**

- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

**Environment variables not working:**

- Add them in Vercel Dashboard
- Redeploy after adding variables

**Custom domain not working:**

- Check DNS settings
- Wait for DNS propagation (up to 48 hours)
