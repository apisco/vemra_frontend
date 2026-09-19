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
| `#b91c1c`   | *(unnamed)*             | Destructive button hover + pressed                             | arbitrary `bg-[#b91c1c]` — see §13 |

`#2ec4b6` is a real Figma variable with no counterpart in `globals.css` — the palette jumps from
`brand-600` `#0e96ac` to `brand-400` `#0f7b54` (a green, despite the name). If a mint/teal
accent is meant to be part of the system, it needs a token; that is a foundation change and so
out of scope here.

**Superseded:** an earlier revision of this table claimed `#edf2f4` (`surface/tertiary`, used by
role tags and the progress track) had no token and was being approximated by `neutral-100`
`#f0f4f6`. That was wrong. `#edf2f4` **is** the documented value of both `neutral-100` and
`brand-50`; `globals.css` simply held the wrong hex. Corrected in §13 — there is no delta here
any more.

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

The headline is a **two-line block at 768 and 1440 and a single line at 390** — its text box is
237px / 278px wide at the two larger widths but the full 342px content width at 390, so
"This page doesn't exist" breaks after "page". That is deliberate, not overflow: the box is
`HEIGHT`-auto-resizing and reports exactly 2 × 40px. Reproduced with
`md:max-w-[237px] lg:max-w-[278px]`. Because `ErrorScreen` is shared, the 500's
"Something went wrong" wraps on the same rule, which keeps the two screens visually identical.

The screen carries **no header and no footer** at any width — the 768 frame has explicit
`header-dummy-spacer` / `footer-dummy-spacer` placeholders (`108:3971`, `108:3985`), confirming
the omission is deliberate. So `not-found.tsx` sits at the app root, outside `(marketing)`, and
renders only inside the root layout. The 390 frame's iOS status bar and home indicator are device
chrome, not app UI, and are dropped — matching the Phase 4 precedent.

The logo is the ordinary `logo-mark` component at this screen as at every other — 28px symbol,
18px SemiBold wordmark. An earlier revision of this build added a `standalone` size that scaled
the wordmark to 28px; that was a misreading and has been removed. See §13.

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

## 13. Design update — re-check against the current Figma file

The design was updated after Phases 1–3 shipped. New nodes are identifiable by their higher IDs
(`264:*` and above), so the diff was taken structurally rather than by re-reading all 79 frames.
Three things changed that affect built code. Everything else in the component library is still
`68:*` and unmodified.

### 13.1 Button gained a full interaction matrix

`68:12` grew from 4 variants to 24: the four styles now each carry Default / Hover / Pressed /
Loading / Disabled / Focus (`332:5483`–`332:5511`, `339:5669`–`339:5675`). Every variant is
**44px tall, padding 12/24, radius 8, label 14px Semi Bold** — which is exactly the existing
`md` size, so the size scale needed no change.

| Style | Default | Hover | Pressed | Loading | Disabled | Focus |
| ----- | ------- | ----- | ------- | ------- | -------- | ----- |
| Primary | `#0b7a8e` | `#085f70` | `#03323d` | fill @ **0.72** | `#dde6e9` bg / `#4c5e65` text | 2px `#0b7a8e` outside |
| Secondary | `#fff` + `#dde6e9` border | `#f7f9fa` | `#edf2f4` | **0.72** | **0.45** | 2px `#0b7a8e` outside |
| Ghost | none | `#f7f9fa` | `#edf2f4` + `#14232a` text | **0.72** | **0.45** | 2px `#0b7a8e` outside |
| Destructive | `#c13832` | `#b91c1c` | `#b91c1c` | **0.72** | **0.45** | 2px `#0b7a8e` outside |

Every value above maps onto an existing token except `#b91c1c`. What the previous implementation
did instead — `active:brightness-95` for all four, `hover:bg-brand-50` on ghost,
`hover:bg-error-600/90` on destructive, and one shared `disabled:bg-neutral-200` treatment for
every style — was approximation, and is now replaced by the table.

`button.tsx` splits the old single map into `VARIANT_CLASSES` (static), `INTERACTIVE_CLASSES`
(`hover:` + `active:`) and `DISABLED_CLASSES`. Loading omits the latter two and applies
`opacity-72`, so the loading fade never has to out-specify a hover rule. Disabled pins its own
`disabled:hover:` / `disabled:active:` pairs: those stack to specificity (0,3,0) and therefore
beat the single-variant (0,2,0) hover rules regardless of source order. Verified in the built
CSS — `hover:` emits at byte 30311, `active:` at 31798, `disabled:` at 32137, so the intended
cascade holds on order as well as specificity.

**Four things are reported rather than absorbed:**

1. **`#b91c1c` has no token.** It is the only colour in the new matrix that is not in the DS
   Color System frame. Tokens are locked, so it ships as an arbitrary value in the two
   destructive rules — the only arbitrary colour in the component library. It wants
   `--color-error-700`; the palette currently stops at `error-600` `#c13832` and `error-50`.
2. **Destructive Hover and Pressed are the same colour.** Both are `#b91c1c`. Pressing a
   destructive button therefore produces no visual change from hovering it. Implemented as
   drawn; if a darker pressed value is intended it needs to be added to the design.
3. **Primary Focus draws a `#0b7a8e` ring on a `#0b7a8e` fill**, flush (stroke align OUTSIDE,
   no offset). Against the button itself the ring is invisible; it only reads against the page
   behind it, where it looks like the button grew 2px. Implemented as drawn —
   `focus-visible:outline-2 focus-visible:outline-brand-700`, with the previous
   `outline-offset-2` removed — so focus stays visible against the page, but an offset ring or a
   contrasting ring colour would be clearer.
4. **Figma's Loading variant has no spinner** — it is the label alone at 72% opacity (the
   Loading and Default variants are identical in width, and the node has one TEXT child). The
   `Spinner` is **kept**, because 72% opacity is otherwise hard to tell from the 45% disabled
   fade, and Phase 2 explicitly required a loading state. This is the one place the
   implementation deliberately shows more than the frame.

Also: the Figma set has exactly four styles, so the **`outline` variant was removed**. It had no
Figma counterpart and existed only on the design-system showcase page, which now demonstrates
the four real ones.

Secondary's focus variant replaces its `#dde6e9` border with the teal ring rather than keeping
both — a Figma node can only hold one stroke. The implementation keeps the 1px neutral border
and adds the ring as a CSS `outline` (which sits outside the border box), because dropping the
border on focus would lose the resting shape for no visual gain.

### 13.2 Three Design System token values were wrong

The DS Color System frame `18:2` names every swatch in a sibling TEXT layer. Pairing each swatch
rect with its label proved three hexes in `globals.css` did not match the documented palette:

| Token | Was | Now | DS label |
| ----- | --- | --- | -------- |
| `--color-brand-50` | `#f0f4f6` | `#edf2f4` | "Tint background" |
| `--color-neutral-100` | `#f0f4f6` | `#edf2f4` | "Dividers" |
| `--color-success-50` | `#e8f5ee` | `#edf8f5` | — |

This is a correction to the foundation, not a change to it: the tokens now hold the values the
design documents. It also retires the §4 delta, since `#edf2f4` was the value being approximated.

Two oddities in the frame itself, reported and left alone:

- **`brand-50` and `neutral-100` are the same colour** (`#edf2f4`). Two names, one value. Worth
  collapsing to one token, or giving them distinct values, before more screens pick a side.
- **The swatch labelled "white / Card surface" is filled `#f7f9fa`**, i.e. `neutral-50`, which is
  also the "Page background" swatch. Cards throughout the design are really `#ffffff`, so this
  reads as a mis-filled swatch rather than an intended value. No code change made.

### 13.3 The logo was componentized, and has one size everywhere

`logo-mark` is now a real component (`135:4326`) with 207 instances across the file. **Every
instance is identical**: a 28×28 symbol container at radius 8, `gap: 8`, and a wordmark at
**18px Semi Bold / 28px line-height**. There is no responsive type step anywhere in the file.

`LogoMark` had four sizes — `responsive` (18→22px bold at md), `hero` (18→28px bold at lg),
`standalone` (28px bold at all widths) and `fixed` (18px). Only `fixed` matched the design; the
other three scaled a wordmark that never scales. The `size` prop is **removed** and all nine call
sites updated. `AuthLayout`'s `logoSize` is now `"default" | "none"`, since its only remaining
job is to suppress the logo on screens that supply their own header. The wordmark also moves off
an arbitrary `text-[18px]` onto the `heading-sm` token, which is exactly 18px.

`priority` on `next/image` is deprecated as of Next 16.0 in favour of `preload`; swapped while
this file was open.

Two findings here are reported, not implemented:

- **The design draws a `#f7f9fa` rounded-8 chip behind the symbol**, with the artwork scaled to
  32×43 and clipped to the 28×28 frame. `public/logo.png` is a differently-proportioned asset
  (275×240) rendered at `h-7 w-auto`, so reproducing the chip would mean re-cropping the mark
  against an asset that does not match the Figma placement. On the near-white surfaces where the
  logo sits the chip is invisible; on the dark login aside it would be a visible change to every
  built screen. Left as-is pending the real asset.
- **A third tone exists**: `logo-mark-inverse` (`332:5517`) specifies a **white** wordmark, used
  on the dark-sidebar dashboard shells (tenant, landlord, property-admin) and the email
  templates — none of which are built yet. The existing `onDark` variant is **correct as it
  stands**: it renders `#8ca2ac`, which is what `login-tablet` (`135:4415`) and `login-desktop`
  (`135:4435`) actually draw, while `login-mobile` (`135:4371`) uses the default `#14232a`. The
  white variant should be added when the dashboard shells are, not before.

### 13.4 Not in scope for this pass

The update also added flows that have no implementation yet and were not touched: super-admin
invite / detail / assignment-confirmation (`264:*`), suspend-admin (`268:*`), property-admin
no-assignments / assignment-changes / restricted-access (`269:*`), landlord rent-price approval
(`282:*`), and tenant deposit-decision-review / approved-rent-change (`287:*`).

Gates after this pass: `tsc --noEmit` clean, `eslint src` clean, `next build` green (22 routes,
all prerendered).

## 14. Workflow change: "Agent" replaced by Vemra-assigned Property Admin

A later Figma revision replaced the self-registering third-party **Agent** with a Vemra-employed
**Property Admin**. The highest node IDs in the file (`291:5031`–`291:5054`) belong to this change,
which makes it the most recent edit. Three structural consequences:

1. **`agent` is no longer a signup role.** `signup-role` (`15:8`, `108:3993`, `101:4075`) shows two
   cards, not three. Property Admins are invited by Vemra, never self-registered.
2. **A staff sign-in entry point was added to all three login breakpoints.** Desktop
   (`291:5032`) renders it as a sibling card below the auth card inside a new `auth-stack` wrapper
   (gap 20, both children 460 wide); tablet (`291:5041`) and mobile (`291:5054`) render it inside
   the auth card's footer.
3. **Landlord–tenant direct contact is now prohibited.** All communication routes through an
   Assigned Property Admin or Vemra Support, which rewrites four legal clauses and the copy on the
   hero, roles, trust, browse, login aside, and welcome frames.

### 14.1 Applied

| Area | Change |
| --- | --- |
| `constants/marketing.ts` | Hero subheading/trust note rewritten at all three widths; roles row 2 retitled to "Property Admins"; trust checks now reference the assigned admin; browse subheading de-agented; all six listing prices `/mo` → `/yr`; listing contact `AGENT` → `PROPERTY_ADMIN` ("Priya Nandan · Vemra Property Admin"); footer gains Terms/Privacy at tablet |
| `constants/auth.ts` | `AuthRole` drops `"agent"`; `SIGNUP_ROLE_OPTIONS` down to two cards with new descriptions; `LOGIN_ASIDE` headline/description replaced and the tablet variants collapsed (Figma now draws identical copy at both widths); `ONBOARDING_COMPLETE.agent` deleted; tenant and landlord step copy updated (landlord step 3 is now "Meet your Assigned Property Admin"); new `STAFF_SIGN_IN` block; `AUTH_ROUTES.twoFactor` → `/staff/two-factor` plus `staffLogin` |
| `constants/legal.ts` | Terms §1, §3 bullet 3, §5 and Privacy §3 rewritten verbatim from `57:719` |
| `features/auth/staff-sign-in.tsx` | New component, one per placement: `card` (desktop, `hidden lg:flex`) and `inline` (mobile + tablet shapes, each self-gated) |
| `app/(auth)/login/page.tsx` | Wrapper `div` carries the `auth-stack` 20px gap at `lg` only, so `AuthLayout` stays untouched |
| `app/(auth)/two-factor` | Moved to `app/(auth)/staff/two-factor`. Figma has no public 2FA frame — every 2FA frame now lives in Property Admin Flow (`50:6`) as `property-admin-two-factor-setup-*`. The screen keeps the `(auth)` layout because that group is a layout concern, not a role boundary |
| `features/auth/role-icons.tsx`, `login-aside.tsx`, `marketing/hero-section.tsx`, `browse/page.tsx` | Call sites updated to match the constants above |

`/staff/login` is referenced but **not built** — Figma supplies the entry point only, no screen.
This matches the existing precedent for `/for-landlords`, `/for-tenants`, `/verification`,
`/list-your-property`, `/about` and `/help`, which all resolve to `not-found`.

### 14.2 Figma inconsistencies — reported, not absorbed

1. **`signup-details` (`15:63`) and `signup-verification` (`15:118`) both still read "Step 1 of 3".**
   They are steps 2 and 3. `SignupStepHeader` keeps rendering 1/2/3; Figma's stepper text was not
   updated when the frames were revised.
2. **The roles-section middle card's subtitle was only updated at desktop.** Desktop reads "The
   Property Admin", tablet still reads "On-Site Manager" and mobile "The On-Site Manager", even
   though the *title* was renamed to "Property Admins" at all three widths. Implemented with the
   desktop value at every width.
3. **The tablet "Invited" pill uses `#5f7782`, which is not a design-system token.** Rendered with
   the nearest token, `neutral-700` (`#4c5e65`), rather than introducing an arbitrary hex.
4. **The desktop staff button instance is 46px tall**, while the authoritative Button component set
   is 44px. Used the standard 44px secondary Button (`size="md"`).
5. **Terms §1 has a lowercase "landlords" mid-sentence** in Figma. Implemented as "Landlords".
6. **The mobile staff button is a plain frame, not a Button instance** (135×28, 12px semibold
   `brand-700` on `neutral-50`). Implemented as a locally styled `Link` — the Button primitive has
   no 28px size and forcing one would need five `!` overrides.
7. **The hero says "₦1,450 / year" while the browse cards say "₦1,450 /yr"** for the same unit.
   Followed each frame literally.

Gates after this pass: `tsc --noEmit` clean, `eslint src` clean, `next build` green — 21 routes
(one fewer: `welcome/agent` is gone, `/two-factor` became `/staff/two-factor`), all prerendered.
