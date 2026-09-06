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

Dla wyciszonego/drugorzędnego tekstu (numery dań, legendy, metadane) **nie
schodź poniżej `text-ink/60`** na jasnym tle ani `text-paper/50` na ciemnym —
niższe wartości (`/40`, `/50` na jasnym tle) łamią AA (audyt Lighthouse to
wyłapał na `ink/40`/`ink/50` w komponentach menu). `ink/60` daje ~5:1,
`paper/50` ~4.9:1 — oba tuż nad progiem 4.5:1, więc nie schodź niżej bez
przeliczenia kontrastu na nowo.

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

## SEO — adres strony (`SITE_URL`)

`lib/seo/metadata.ts` eksportuje `SITE_URL`, czytane z
`NEXT_PUBLIC_SITE_URL` (patrz `.env.example`), z fallbackiem na domenę
produkcyjną. Używane do canonical, hreflang, JSON-LD i `sitemap.xml` — musi
być **absolutnym** adresem z protokołem. Przy audycie Lighthouse lokalnie
ustaw `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, bo inaczej audyt SEO
zgłosi błąd canonical (canonical wskazujący na inną domenę niż testowana —
to nie bug w kodzie, tylko efekt testowania z zaszytym adresem produkcyjnym).
Przy odsprzedaży szablonu nowemu klientowi: podmień `SITE_URL` fallback w
`lib/seo/metadata.ts` (lub ustaw `NEXT_PUBLIC_SITE_URL` w środowisku
produkcyjnym) na docelową domenę.

## Obrazy

Placeholdery z Unsplash (`images.unsplash.com`, `plus.unsplash.com` w
`next.config.ts` → `images.remotePatterns`) — do podmiany na realne zdjęcia
klienta przy wdrożeniu. `images.formats` ustawione na `["image/avif",
"image/webp"]` — Next.js sam negocjuje format po nagłówku `Accept`, nic do
zrobienia przy podmianie zdjęć. Hero na stronie głównej ma `quality={60}`
(celowo niżej niż domyślne 75 — zdjęcie jest przyciemnione nakładką, strata
jakości jest niezauważalna, a to największy pojedynczy czynnik w LCP).

## Przed wdrożeniem — checklist

1. Ustaw prawdziwe klucze w `.env` hostingu: `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`,
   `RESERVATION_NOTIFICATION_EMAIL`, `NEXT_PUBLIC_SITE_URL` (patrz sekcje
   wyżej) — bez nich formularz rezerwacji działa, ale nic nie zapisuje ani
   nie wysyła (loguje ostrzeżenie).
2. Podmień treść w `/content/*.json` i zdjęcia (Unsplash → realne zdjęcia
   klienta, zachowując `remotePatterns` dla nowej domeny hostującej zdjęcia).
3. `pnpm typecheck && pnpm lint && pnpm build` bez błędów.
4. Lighthouse mobile (`pnpm build && pnpm start`, potem audyt) na
   wszystkich stronach w obu językach — cel 95+ w każdej kategorii; przy
   audycie lokalnym pamiętaj o `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
   (patrz sekcja SEO wyżej).
5. Utwórz tabelę `reservations` w Supabase odpowiadającą polom z
   `app/[locale]/reservation/actions.ts` (`date`, `time`, `party_size`,
   `name`, `email`, `phone`, `notes`).
6. Zweryfikuj domenę nadawcy w Resend dla adresu z `restaurant.contact.email`
   (inaczej wysyłka maili z potwierdzeniem się nie powiedzie).

## Konwencje ogólne

- Alias importów: `@/*` wskazuje na root projektu (`@/components/...`,
  `@/lib/...`, `@/types`, `@/content/...`, `@/i18n/...`).
- `pnpm typecheck` i `pnpm lint` przed każdym commitem.
