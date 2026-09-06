# Spichlerz Nr 8 — konwencje projektu

Strona-wizytówka fikcyjnej restauracji fine dining, zbudowana też jako
szablon do sprzedaży realnym klientom z gastronomii. Priorytet: jakość
wykonania, wydajność (Lighthouse mobile 95+), łatwość podmiany treści.

## Stack

Next.js 15 (App Router) + TypeScript strict + Tailwind CSS v4, i18n przez
`next-intl`, rezerwacje przez Server Action → Supabase + Resend (scaffold,
patrz niżej), pnpm.

## Jak podmienić treść dla klienta

Cała treść biznesowa żyje w `/content/*.json`. **Nie ma potrzeby ruszania
kodu**, żeby podmienić dane klienta:

- `content/restaurant.json` — dane restauracji, adres, geo, szef kuchni,
  galeria, godziny działania jako polityka rezerwacji (`seating`).
- `content/menu.json` — menu degustacyjne, a la carte, karta win, alergeny.
- `content/hours.json` — godziny otwarcia, sloty rezerwacji, wyjątki.
- `content/i18n/{pl,en}.json` — teksty interfejsu (nawigacja, przyciski,
  komunikaty formularza) — **nie** treść biznesowa, tylko UI strings.

Pola tekstowe wielojęzyczne mają kształt `{ pl: string; en: string }`
(`LocalizedString` w `types/restaurant.ts`) — zamiast osobnych plików per
język, żeby nie rozjeżdżały się pola niebiznesowe (ceny, alergeny, geo).

Typy w `/types` są kontraktem: jeśli zmieniasz kształt JSON-a, zmień typ
razem z nim i zaktualizuj wszystkie miejsca, które go konsumują
(`lib/content/get-*.ts` i dalej komponenty).

## Routing i i18n

Routing przez `next-intl` z `pathnames` (`i18n/routing.ts`) — PL i EN mogą
mieć różne widoczne URL-e wskazujące na ten sam segment logiczny:
`/rezerwacja` (pl) ↔ `/reservation` (en), `/kontakt` (pl) ↔ `/contact` (en).
Foldery w `app/[locale]/` noszą **angielską** nazwę segmentu logicznego
(`reservation/`, `contact/`), nie polski slug.

Dodawanie nowej strony:

1. Dodaj wpis do `pathnames` w `i18n/routing.ts` (jeśli ma mieć różne sluggi
   per język).
2. Utwórz folder w `app/[locale]/<segment>/page.tsx`.
3. Linkuj przez `Link`/`useRouter` z `@/i18n/navigation`, **nie** z
   `next/link` bezpośrednio — inaczej lokalizacja URL-i się nie zadzieje.
4. Dodaj klucze tłumaczeń do obu `content/i18n/{pl,en}.json`.

Komponenty pisz z myślą o i18n od razu: teksty przez `useTranslations`/
`getTranslations`, unikaj sklejania stringów przez konkatenację (utrudnia
tłumaczenie na później).

## Design system

Paleta (`app/globals.css`, `@theme`): `--color-ink` (#0A0A0A),
`--color-paper` (#F4F1EA), `--color-amber` (#B8873F, dekoracyjny),
`--color-amber-ink` (#8A6428, tekstowy).

**Ważne — kontrast**: `--color-amber` na `--color-paper` ma kontrast ~2.1:1
(nie spełnia AA). Bursztyn jako **tekst** wolno stosować tylko na ciemnym
tle (`--color-ink`, kontrast ~6.9:1). Na jasnym tle bursztyn to wyłącznie
element graficzny (obramowania, ikony, tło przycisku) — do tekstu na jasnym
tle używaj `--color-amber-ink`.

Typografia: `--font-display` (Fraunces, nagłówki), `--font-sans` (Inter,
treść). Skala nagłówków przez tokeny `text-hero`/`text-display`/
`text-heading` (fluid, `clamp()`) — nie twarde `text-6xl` itp.

Komponenty UI w `components/ui/` są autorskie — nie dodawaj shadcn/Radix bez
wyraźnej potrzeby (native `<select>`/`<input type="date">` wystarczają i są
w pełni dostępne).

## Animacje

Bez Framer Motion. `hooks/use-scroll-reveal.ts` (IntersectionObserver) i
`hooks/use-parallax.ts` (rAF-throttled) — obie **muszą** respektować
`prefers-reduced-motion` (sprawdzane przez `hooks/use-reduced-motion.ts`
i globalną regułą w `globals.css`). Nowa animacja = sprawdź, czy się
wyłącza przy reduced motion, zanim uznasz zadanie za skończone.

## Rezerwacje — Supabase/Resend bez realnych kluczy

`lib/supabase/server.ts`, `lib/supabase/client.ts` i `lib/email/resend.ts`
zwracają `null`, gdy brakuje zmiennych środowiskowych (patrz
`.env.example`), zamiast rzucać wyjątkiem. Server Action
(`app/[locale]/reservation/actions.ts`) musi:

1. Zawsze zwalidować dane przez zod — to działa niezależnie od backendu.
2. Spróbować insertu do Supabase; jeśli klient `null`, zalogować ostrzeżenie
   i kontynuować (nie failować requestu).
3. Spróbować wysłać mail przez Resend; analogiczny guard.
4. Zwrócić czytelny status sukcesu, nawet jeśli oba kroki backendowe zostały
   pominięte z powodu braku konfiguracji.

Żeby przetestować formularz lokalnie bez realnych kluczy: zostaw
`.env.local` z pustymi wartościami (skopiowane z `.env.example`) — walidacja
i UI mają działać, w konsoli serwera pojawią się ostrzeżenia `[supabase]`/
`[resend]` o braku konfiguracji.

## Konwencje ogólne

- Alias importów: `@/*` wskazuje na root projektu (`@/components/...`,
  `@/lib/...`, `@/types`, `@/content/...`, `@/i18n/...`).
- `pnpm typecheck` i `pnpm lint` przed każdym commitem.
- Zdjęcia to placeholdery z Unsplash (`images.unsplash.com`,
  `plus.unsplash.com` w `next.config.ts` → `images.remotePatterns`) — do
  podmiany na realne zdjęcia klienta przy wdrożeniu.
