# Portfolio Website

Full-stack portfolio built with Next.js 14, Prisma, Tailwind CSS, and a minimal custom theme.

## Theme

The site uses this palette throughout:

- `#4A4A4A`
- `#CBCBCB`
- `#FFFFE3`
- `#6D8196`

## Local Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

## Admin Login

Default local/demo credentials:

```text
admin@example.com
admin123
```

For production, set these environment variables:

```text
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
NEXT_PUBLIC_SITE_URL=
```

Optional integrations:

```text
EMAIL_SERVICE=
EMAIL_USER=
EMAIL_PASS=
GITHUB_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
REDIS_URL=
```

## Production Check

```bash
npm run build
npm start
```

The project is ready for Vercel or any Node-compatible Next.js host.
