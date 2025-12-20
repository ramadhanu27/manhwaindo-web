# Deploy ke Cloudflare Workers/Pages

## Instalasi Selesai ✅

Semua dependensi untuk deploy ke Cloudflare Workers/Pages sudah terinstall:

### Package yang Terinstall:

- ✅ `wrangler@^4.56.0` - CLI untuk Cloudflare Workers
- ✅ `@opennextjs/cloudflare@^1.14.7` - Adapter OpenNext untuk Cloudflare
- ✅ `@cloudflare/next-on-pages@^1.13.16` - Dev platform untuk Cloudflare
- ✅ `@cloudflare/workers-types@^4.20241218.0` - TypeScript types untuk Workers

## Cara Deploy

### 1. Build untuk Production

```bash
npm run pages:build
```

Command ini akan:

- Build Next.js app
- Generate output yang compatible dengan Cloudflare Workers
- Output akan ada di folder `.open-next/worker`

### 2. Test Secara Lokal

```bash
npm run pages:dev
```

Command ini akan menjalankan Wrangler dev server untuk test di local.

### 3. Deploy ke Cloudflare Pages

#### Opsi A: Via Command Line

```bash
# Login ke Cloudflare (hanya sekali)
npx wrangler login

# Deploy
npm run pages:deploy
```

#### Opsi B: Via GitHub Actions

File `.github/workflows/deploy.yml` sudah tersedia. Untuk menggunakannya:

1. Buat Cloudflare API Token:

   - Login ke Cloudflare Dashboard
   - Pergi ke "My Profile" → "API Tokens"
   - Buat token dengan permission "Cloudflare Pages - Edit"

2. Tambahkan secrets di GitHub:

   - `CLOUDFLARE_API_TOKEN` - API token yang baru dibuat
   - `CLOUDFLARE_ACCOUNT_ID` - Account ID dari Cloudflare dashboard

3. Push ke GitHub, deployment akan otomatis berjalan

#### Opsi C: Via Cloudflare Dashboard

1. Login ke Cloudflare Dashboard
2. Pergi ke "Workers & Pages"
3. Klik "Create Application" → "Pages" → "Connect to Git"
4. Pilih repository GitHub Anda
5. Set build configuration:
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.open-next/worker`
   - **Node version**: `18` atau `20`

## File Konfigurasi

### `wrangler.toml`

```toml
name = "manhwaindo-web"
compatibility_date = "2024-12-20"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".open-next/worker"
```

### `open-next.config.ts`

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

### `next.config.ts`

- Sudah dikonfigurasi dengan `setupDevPlatform()` untuk development
- Image optimization di-disable (`unoptimized: true`) karena Cloudflare Pages requirement

## Environment Variables

Jika ada environment variables (dari `.env.local`), tambahkan di:

- **Local development**: File `.dev.vars` (format KEY=VALUE)
- **Production**: Cloudflare Dashboard → Workers & Pages → Settings → Environment Variables

## Troubleshooting

### Build Error

Jika ada error saat build:

```bash
# Clear cache dan rebuild
rm -rf .next .open-next node_modules
npm install
npm run pages:build
```

### Runtime Error

- Pastikan semua Node.js APIs yang digunakan compatible dengan Cloudflare Workers
- Cek Cloudflare Workers documentation untuk API yang tidak didukung

## Resources

- [OpenNext Documentation](https://opennext.js.org/cloudflare)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
