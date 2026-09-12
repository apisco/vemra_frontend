# Vemra — Phase 3 Figma deltas

Everything the Public Marketing implementation could not take literally from the design,
and what it does instead. Nothing here was resolved by inventing a value silently.

Frames referenced: **M1 landing** `9:923` (1440) / `108:3476` (768) / `101:3476` (390) and
**M2 browse listings** `9:1085` / `108:3583` / `101:3588`.

---

## 1. Brief sections that do not exist in the design

The Phase 3 build order lists ten sections. M1 contains seven, in this order:

| # | Section                  | Node     | Built as                                    |
| - | ------------------------ | -------- | ------------------------------------------- |
| 1 | Sticky header            | `9:924`  | `components/layout/site-header.tsx`         |
| 2 | Hero                     | `9:938`  | `features/marketing/hero-section.tsx`       |
| 3 | Roles ("Three people…")  | `9:970`  | `features/marketing/roles-section.tsx`      |
| 4 | Dashboard preview        | `9:1009` | `features/marketing/dashboard-preview-section.tsx` |
| 5 | Trust ("See who…")       | `9:1049` | `features/marketing/trust-section.tsx`      |
| 6 | CTA band                 | `9:1069` | `features/marketing/cta-band.tsx`           |
| 7 | Footer                   | `9:1074` | `components/layout/site-footer.tsx`         |

**Four brief sections have no frame anywhere in the marketing section and were not built:**

- **Trusted-by / logo strip** — the brief itself hedges this with "(if present)". It is not.
- **Feature cards** — there is no feature-card grid. The roles section (`9:970`) is the closest
  thing: three full-width rows, not cards in a grid.
- **Testimonials** — absent.
- **FAQ** — absent.

Building any of them would mean inventing copy, layout and imagery, which the brief forbids
twice over ("Do not invent extra features beyond the supplied designs").

**Property showcase** is not on M1 either. It is M2, so `PropertyCard` was derived from the real
M2 grid and ships at `/browse` rather than being guessed onto the landing page.

M3–M6 (listing detail, search empty state, about/contact, public profile) are separate
marketing screens, not sections in the Phase 3 build order, and are untouched. Their nav and
footer links therefore 404 in this phase — see §7. M7 (404) was also out of the build order but
has since been built on request; see §12.

## 2. Header: no transparent-over-hero state exists

The brief asks for "Transparent over hero / Solid after scroll". All three header frames
(`9:924`, `108:3477`, `101:3483`) are **solid white with a `#dde6e9` bottom border**. There is no
transparent variant to switch from, and the hero sits on `neutral-50` rather than an image, so
transparency would show a near-white band, not the hero.

**Implemented as:** solid at rest, plus `shadow-elevation-3` once `scrollY > 0` — that token is
documented in `globals.css` as "fixed nav, toasts", so the scrolled state is the design system's
own answer for a floating header. Sticky, keyboard-navigable and drawer-equipped as specified.

Header heights are 52 / 76 / 72px at 390 / 768 / 1440 — note 768 is **taller** than 1440.
Reproduced exactly (`h-13 md:h-19 lg:h-18`).

## 3. Mobile drawer: hamburger drawn, drawer not

`101:3488` is the hamburger. There is **no open-drawer frame** in the file. The drawer reuses the
header's own surface, border, radius and shadow tokens with the full desktop labels, so it
introduces no new design value. Its slide-in uses Tailwind's `starting:` variant
(`@starting-style`), which needs no `@keyframes` and therefore no edit to the locked
`globals.css`; `motion-reduce:` opts out.

## 4. Colours with no token

Design System tokens are locked, so these are reported rather than added.

| Figma value | Figma name              | Used by                                                        | Rendered as                    |
| ----------- | ----------------------- | -------------------------------------------------------------- | ------------------------------ |
| `#2ec4b6`   | `interactive/secondary` | tenant "Active lease" badge fill, trust-section check glyphs, M1 hero verified dot | `brand-600` `#0e96ac` |
| `#edf2f4`   | `surface/tertiary`      | role tags, progress track                                      | `neutral-100` `#f0f4f6` (Δ 3/255) |

`#2ec4b6` is a real Figma variable with no counterpart in `globals.css` — the palette jumps from
`brand-600` `#0e96ac` to `brand-400` `#0f7b54` (a green, despite the name). If a mint/teal
accent is meant to be part of the system, it needs a token; that is a foundation change and so
out of scope here.

**Related inconsistency inside the design:** the verified dot on M1's hero card is `#2EC4B6`,
while the visually identical dot on M2's listing badges is `#0F7B54`. Same element, two colours,
two frames. Each is rendered with its own nearest token (`brand-600` / `brand-400`) rather than
being unified.

## 5. Type sizes off the token scale

`globals.css` has no 20 / 24 / 26 / 30px steps, but the responsive headings need all four:

| Element              | 390  | 768  | 1440 | Tokenised?              |
| -------------------- | ---- | ---- | ---- | ----------------------- |
| Section `h2`         | 24   | 30   | 36   | 1440 only (`display-lg`) |
| CTA band `h2`        | 20   | 26   | 32   | 1440 only (`heading-xl`) |
| PropertyCard price   | 20   | 20   | 22   | none                    |
| Hero `h1`            | 28   | 36   | 48   | 768 + 1440              |

Rendered with arbitrary values (`text-[24px]` etc.) at the untokenised steps, concentrated in
`features/marketing/section-heading.tsx` so the off-scale sizes live in one component rather than
being scattered. Line-height is uniformly 1.5× the font size across **every** heading in the
design, which is consistent enough to be a rule the tokens could encode.

## 6. Two places where the design contradicts itself

- **Tenant progress bar.** Its own label reads `₦900 of ₦1,450 (62%)`, but the bar is drawn at
  280/520 = **53.8%** on 1440 and 200/326 = **61.3%** on 390. Neither matches the label and they
  do not match each other. **The label wins** — it is the only value a reader can check.
- **Hero secondary button.** At 768 it has a white fill; at 1440 it has **no fill**. Implemented
  with the existing `secondary` variant (white) at both, so `hover:bg-neutral-50` remains
  visible — a transparent button whose only hover state is a background change would have no
  hover state at all.

## 7. Footer: brief asks for more than the design has

The brief specifies "company links / product links / social placeholders". `9:1074` has a **flat
list of seven links** and **no social icons at any width**. Built as designed: one flat `<nav>`,
no invented groups, no placeholder icons.

Only `/` and `/browse` exist in this phase, so the other five footer links and three nav links
resolve to 404 until their screens are built. Hrefs are still the real intended paths rather than
`#`, so nothing needs rewriting later. Since §12 those links land on the designed M7 screen rather
than Next's built-in fallback.

## 8. Component-reuse notes

The brief says "Reuse existing Card components. Do not build feature-specific cards from
scratch." There is **no generic `Card` primitive** in the component library — the only card is
`StatCard`, whose recipe (label / value / delta / icon) does not match either the dashboard
preview panels or the property cards. Rather than force `StatCard` into a shape it was not
designed for, or add a `Card` primitive to a locked library:

- `PropertyCard` (`features/marketing/property-card.tsx`) is the **one reusable card** the brief
  asks for, built from M2's real grid and consumed by `/browse`.
- The dashboard preview panels are a private `Panel` inside their own section file — they are
  one-offs that exist nowhere else in the design.
- M1's hero listing card is a **separate variant**, not `PropertyCard`: different price format
  (`₦1,450 / month` vs `₦1,450 /mo`), different badge copy ("Landlord Verified" vs "VERIFIED"),
  an agent response-time note, and at 768 no agent row at all. It is private to
  `hero-section.tsx` for that reason.

Two primitives were also short of what the design needed, and were **not** modified:

- `Badge` has no dot slot and is `rounded-full` only. The dashboard badges are `rounded-sm`, and
  several badges pair a dot with a label. Those are plain spans built from tokens.
- `Avatar`'s size scale is 24 / 32 / 40 / 48px; the design uses 24 / 28 / 32 / 36. Overridden per
  call site with Tailwind's `!` modifier (`size-7!`), which is necessary because `cn()` joins
  classes without resolving conflicts.

## 9. Behaviour the design does not specify

The M2 filter pills (`All homes`, `Price`, `Bedrooms`, `Location`, `Verified only`) have **no
open-dropdown frame and no filtered-results frame**. `BrowseFilterBar` therefore renders them as
designed — including the chevrons, which appear at 390 and 1440 but not at 768 — and wires **no
filter behaviour**. The same applies to "Load more homes": there is no second page of results in
the design. Implementing either would be inventing product behaviour.

## 10. Responsiveness

The design supplies three widths; the brief requires nine (320 → 1440). `lib/layout.ts` pins the
three designed gutter sets exactly and interpolates the rest:

```
SECTION_GUTTER  16 / 32 / 120px at 390 / 768 / 1440   (body sections)
HEADER_GUTTER   16 / 32 /  80px at 390 / 768 / 1440   (header, CTA band)
```

Each responsive section is **one DOM**, reordered with `order-*` and revealed with
`hidden`/`inline`/`contents`, so no layout is duplicated per breakpoint. Where the design rewrites
a string per width rather than truncating it (hero trust note, roles descriptions, roles tags,
dashboard progress label, browse subheading), both forms live in `constants/marketing.ts` and are
switched by responsive spans.

**Horizontal overflow:** the trust section's two columns are drawn at fixed 520px and 560px. Held
as a flex basis but left shrinkable, so 1024 and 1280 narrow them proportionally instead of
overflowing — with `shrink-0` they would have needed 1268px of viewport. No other fixed width
exceeds its container at any of the nine widths.

The trust section itself is **1440-only**: neither the 768 nor the 390 frame contains it, so it is
`hidden lg:block` rather than given an invented small-screen layout.

## 11. Withdrawn from the earlier review

An earlier pass reported the hero overline and the "5 Active Listings" badge as same-colour
text-on-background (invisible text). **That was wrong.** Both are a 10% `brand-700` tint behind
teal text; `get_design_context` strips fill alpha and reports the tint as an opaque fill. The
`brand-400` = `#0f7b54` reading was also confirmed correct against swatch `18:15`
("Charts / Accent 2") — no token change needed.

## 12. Error screens: 404 built from M7, 500 has no design at all

**404 (M7)** is fully designed at all three widths — `6:13` (1440), `108:3970` (768),
`101:4043` (390) — and is implemented verbatim at `src/app/not-found.tsx`. It was not in the
Phase 3 build order (§1 notes M3–M7 as out of scope), so it is a late addition, built on request.

Three readings taken from the frames rather than assumed:

| Element  | 390          | 768           | 1440          |
| -------- | ------------ | ------------- | ------------- |
| Numeral  | 96 / 96 / -2 | 120 / 120 / -4 | 140 / 140 / -4 |
| Headline | 22 / 30      | 32 / 40       | 32 / 40       |
| Body     | 14 / 22      | 16 / 24       | 16 / 24       |

(size / line-height / letter-spacing, px.) The numeral sizes are off the token scale — the largest
`--text-*` token is `display-xl` at 48px — so they are arbitrary values, consistent with the
precedent set in §5. The **404→headline gap differs per width**: 12px at 390 and 768, but **0px at
1440**, where the two lines butt together deliberately. That is `gap-3 lg:gap-0`, not an oversight.

Structurally the mobile frame nests the body copy *inside* the numeral group (gap 12), while 768
and 1440 make it a sibling (gap 40). One DOM serves all three via `-mt-5 md:mt-0` on the body.

The screen carries **no header and no footer** at any width — the 768 frame has explicit
`header-dummy-spacer` / `footer-dummy-spacer` placeholders (`108:3971`, `108:3985`), confirming
the omission is deliberate. So `not-found.tsx` sits at the app root, outside `(marketing)`, and
renders only inside the root layout. The 390 frame's iOS status bar and home indicator are device
chrome, not app UI, and are dropped — matching the Phase 4 precedent.

`LogoMark` gained a `standalone` size (`h-8 md:h-10` mark, 28px/36px bold wordmark at every
width) because the screen wants the wordmark at 28px even at 390, which none of `responsive`,
`fixed` or `hero` provide. This is additive: no existing call site changes.

### The 500 reuses the M7 design

**There is no 500, server-error or generic-error frame anywhere in the file** — not in
`🌐 Public / Marketing [50:2]`, not among the seven SH pattern sheets. M7 is the only error screen
designed. `src/app/error.tsx` was built on explicit request and **renders the M7 design unchanged**:
same layout, type scale, spacing, colours and single primary "Back to browse rentals" button. The
two screens share `ErrorScreen` and `ErrorBackLink`, so they cannot drift apart.

Only two values are written rather than read from Figma:

- **Numeral `500`** in place of `404`. It inherits M7's 96/120/140px responsive scale exactly.
- **Copy** — "Something went wrong" and "Something failed on our end. It is usually temporary, so
  try again in a moment." No Figma source exists for either.

An earlier revision added a second **Try again** button wired to Next 16's `retry` prop. That was
dropped on request in favour of matching M7 exactly, so `error.tsx` takes no props and recovery is
a browser refresh. If a retry affordance is wanted later, `retry` is the stable Next 16 prop —
note the older `reset` name is no longer the recommended one.

If a 500 is ever designed, the numeral scale and the copy are the only things to check.

`global-error.tsx` was **not** built. It replaces the root layout, so it cannot use the app's
fonts or global styles without duplicating them, and it only fires for a throw inside the root
layout itself. Errors in every page and nested layout are already covered by `app/error.tsx`.
