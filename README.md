# Spichlerz Nr 8

Strona-wizytówka fikcyjnej restauracji fine dining "Spichlerz Nr 8"
(Wyspa Spichrzów, Gdańsk) — Next.js 15, TypeScript, Tailwind CSS v4,
i18n PL/EN przez `next-intl`.

Konwencje projektu (podmiana treści, design system, i18n, rezerwacje) opisane
w [`CLAUDE.md`](./CLAUDE.md).

## Uruchomienie

```bash
pnpm install
pnpm dev
```

Aplikacja jest dostępna pod `http://localhost:3000` (przekierowuje na
`/pl`). Do lokalnego działania formularza rezerwacji nie są wymagane
realne klucze Supabase/Resend — patrz `.env.example` i sekcja o
rezerwacjach w `CLAUDE.md`.

## Skrypty

- `pnpm dev` — serwer deweloperski
- `pnpm build` / `pnpm start` — build produkcyjny
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm format` — Prettier
