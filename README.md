# SIMON

Frontend de las pantallas informativas de soporte técnico de GO Service LATAM.

## Requisitos

- Node.js 24
- npm 11

## Inicio desde cero

```sh
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000/pantalla/sala`.

## Variables

- `NEXT_PUBLIC_USE_MOCK=true` usa datos JSON locales.
- `NEXT_PUBLIC_API_URL` URL del backend real.
- `NEXT_PUBLIC_SUPABASE_URL` proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` clave pública anónima.

## Verificación

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
```
