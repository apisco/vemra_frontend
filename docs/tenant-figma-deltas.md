# Vemra — Phase 5 Figma deltas-

Everything the Tenant implementation could not take literally from the design, and what it does
instead. Nothing here was resolved by inventing a value silently.

This document is written incrementally, one increment at a time. Covered so far:

- **Increment 1 — `DashboardShell` + TN2 dashboard** (§1–§10). Frames: `15:165` (1440), `109:3823`
  (768), `101:4509` (390).
- **Increment 2 — TN5 pay rent + TN25 payment failed** (§11–§17). Frames: `13:474` / `109:4032` /
  `101:4785` and `59:1119` / `109:5336` / `101:6360`.

---

## 1. The Sep-8 `page.xml` dump is dead for this section

The workflow change (landlord decisions now route through an assigned Property Admin) edited
existing tenant frames **in place**, so the cached dump no longer matches Figma:

| Node | Sep-8 dump | Live Figma |
| - | - | - |
| `15:274` | `Landlord · Owns 6 properties` | `Property owner · Verified · View only · No direct contact` |
| `15:281` | `Managing agent · Responds in ~2 hrs` | `Assigned Property Admin · Assigned by Vemra · Responds in ~2 hrs` |
| `56:109` | *(chat header sub-label)* | `Assigned Property Admin · Typical response time: ~1 hour` |

The chat thread list (`56:75`) now has no landlord thread at all. Every tenant screen must be read
live. The section was re-dumped to `.figma-refs/tenant-50-4.xml` (gitignored) so the rest of the
phase costs no MCP calls.

Two screens were also missing from `docs/screen-inventory.md` entirely and have been added there as
TN27 (deposit decision review) and TN28 (approved rent change). Tenant is **28 screens**, not 26.

## 2. `get_metadata` does not expand instance children

Same limitation §19 of `auth-figma-deltas.md` records for `page.xml`: text inside an `<instance>` is
absent from the metadata tree. Three screenshots were taken to recover it — `15:223` (plan panel),
`15:263` (right column) and `109:3854` (tablet metrics) — and **each one corrected an assumption**:
row dividers exist under every installment row including the last, contact avatars are pale teal
rather than solid, and the tablet has its own copy (see §4).

## 3. Internal contradictions in the design

| # | What the design draws | What was built | Why |
| - | - | - | - |
| 1 | Progress fill is **75%** at 1440 (420/560) and 768 (248/332) | **62%** | 62% is what the arithmetic says (₦900 of ₦1,450), what the 390 frame draws (200/326), and what the already-shipped `src/constants/marketing.ts` says verbatim ("₦900 of ₦1,450 (62%)"). Three sources to two. |
| 2 | The active sidebar row's icon is **white on white**, i.e. invisible | icon inherits `text-brand-700` | Same class of slip as AU1's invisible icon chip (`auth-figma-deltas.md` §12), and the same resolution. |
| 3 | The mobile "More" tab's glyph is a **house** — a copy of the Overview icon | `EllipsisIcon` | A duplicate glyph on a tab bar is a placeholder, not a design. |
| 4 | The active sidebar row is **44px** tall; the other eleven are 40px | uniform `h-10` (40px) | A 4px jump on hover/route change is a slip, not an affordance. |
| 5 | Tablet action row is **358px wide inside a 332px column**; Priya's desktop detail text is **382px inside a 320px frame** | both wrap | Reproducing the overflow would put clipped text on screen. Same treatment as AU1's overflowing landlord tag (`auth-figma-deltas.md` §12). |
| 6 | The second plan-panel button is named `ghost-btn` but is **rendered as a white bordered button** | `Button variant="secondary"` | The render wins over the layer name; `ghost` would drop the border the frame draws. |
| 7 | The mobile frame carries an iOS **status bar** (`101:4510`) and **home indicator** (`101:4621`) | dropped | Device chrome, not product UI. Same precedent as phases 3 and 4. |

## 4. Copy differs per breakpoint, and sometimes three ways

This is the first phase where the tablet frame is not merely a shortened desktop. `109:3854` proves
768 has its **own** strings, distinct from both neighbours:

| Element | 390 | 768 | 1440 |
| - | - | - | - |
| Metric 2 detail | Full month or continue plan | Full month or installment | Full month or continue your plan |
| Metric 3 **title** | On a payment plan | Payment plan active | On a payment plan |
| Plan panel title | September Rent Plan | Payment plan · September rent | Payment plan · September rent |
| Edit link | Edit | Edit plan | Edit plan |
| Payments panel title | *(panel absent)* | Payments | Recent payments |
| Owner detail | Property owner · View only | *(same)* | Property owner · Verified · View only · No direct contact |
| Admin detail | …· Assigned by Vemra | …· Responds fast | …· Responds in ~2 hrs |
| Page CTA | Pay Rent | Make a payment | Make a payment |

The two-frames-to-one majority rule used in phase 4 does **not** apply here: these are not
truncations of one string, they are three authored variants. They are modelled faithfully by a new
`ResponsiveText` component over a `ResponsiveCopy` (`base` / `md?` / `lg?`) shape. Only the visible
variant is announced — the hidden ones are `display:none`, which removes them from the
accessibility tree, so no string is read twice.

## 5. Structural differences between widths (built as drawn)

These are not inconsistencies; they are the design, recorded so the omissions are not mistaken for
bugs.

- **The recent-payments panel does not exist at 390.** Built `hidden md:flex`.
- **Its third row does not exist at 768** — the tablet mini-table contains exactly two `Table Row`
  instances. Built `hidden lg:flex` on row 3.
- **The plan panel has no action row at 390.** Both buttons are `hidden md:flex`.
- **The plan panel's money summary is one line at 390** ("₦900 paid of ₦1,450") and two runs at
  768/1440 ("₦900 paid" + "of ₦1,450 total"). Both are built; neither is derived from the other.
- **The progress track is 6px at 390 and 8px above it.**

## 6. Costs of reusing the locked component library

Phase 5's brief forbids duplicate primitives, so four existing components were extended
**additively** — each new value defaults to the old behaviour, so no existing call site moved:

| Component | Added | Existing callers affected |
| - | - | - |
| `NavItem` | `tone="dark"` (+ the 4×24 `brand-600` accent bar), `onClick` | none — it had no consumer before this phase |
| `Avatar` | `tone="subtle"` | none |
| `LogoMark` | `variant="inverse"` | none |
| `StatCard` | `variant="outlined"`; `title`/`subtitle` widened to `ReactNode` | `design-system/page.tsx` ×6 — verified byte-identical under the `elevated` default |

Increment 2 added two more, on the same additive terms (see §13 and §17):

| Component | Added | Existing callers affected |
| - | - | - |
| `SegmentedControl` | `disabledValues?: readonly TValue[]` | none — `undefined` keeps today's behaviour, including arrow-key wrap |
| `DashboardShell` | `toNavLinks` exported (was module-private) | none — no behaviour change |

Two geometry deltas follow from that reuse and were accepted rather than forked:

- **`StatCard`'s internal rhythm is a flat `gap-2`** (8/8px). Desktop Figma draws 12px
  label→value and 4px value→detail. Matching it would mean a second gap axis on a locked primitive
  for 4px in each direction.
- **`Badge size="sm"` renders ~20px tall.** The Figma badge frames are ad-hoc: 24px at desktop,
  16px at mobile. Neither is on the `Badge` scale, and 20px sits between them.

## 7. `cn()` has no conflict merging, so overrides were verified in the compiled CSS

`cn` is a filter-and-join, not `tailwind-merge`, so two *unprefixed* classes for the same property
resolve by stylesheet order rather than argument order. Every size override in this increment is
therefore written mobile-first and scaled up with a variant prefix, and the ordering was checked in
the production bundle (`.next/static/chunks/1fz9u2htf1_s5.css`) rather than assumed:

| Override | Base rule | Variant rule | Result |
| - | - | - | - |
| `md:grid-cols-[380fr_300fr]` | — | `grid-template-columns:380fr 300fr` emitted | ✓ |
| `max-md:h-8` / `max-md:px-3` / `max-md:text-label-sm` (mobile CTA) | `.h-10` @14763, `.px-5` @21754, `.text-label-md` @23980 | all three inside `@media not all and (min-width:48rem)` @35500 | ✓ |
| `md:h-11` / `md:px-6` (desktop CTA) | same | `@media (min-width:48rem)` @36637 | ✓ |
| `lg:size-10` / `lg:text-label-md` (contact avatar) | `.size-8` @14107, `.text-label-sm` @24026 | `@media (min-width:64rem)` @43361 | ✓ |
| `lg:h-10` / `lg:px-4` (plan buttons) | `Button size="md"` | same `lg` block | ✓ |

## 8. Component choices that differ from the obvious primitive

- **The mini payment tables are `<ul>`, not `Table`.** Neither the plan panel's installment list nor
  the recent-payments panel draws a header row. `Table`'s `max-md:` card-transform branches would be
  dead weight, and a headerless `<table>` is worse for screen readers than a list.
- **"More" opens the drawer; it is not a link.** No `/tenant/more` screen exists in the design. It
  renders through `navItemClasses({ variant: "mobile" })` as a `<button>` so it is visually identical
  to the four real tabs without pretending to be a route.
- **The drawer closes via `onClick` on each link, not an effect on `pathname`.** The repo's ESLint
  config makes `react-hooks/set-state-in-effect` an **error**, and `site-header.tsx` already
  establishes the `onClick` pattern. This is why `NavItem` gained `onClick`.

## 9. Routes that are drawn in the sidebar but not yet built

The sidebar renders all twelve tenant destinations, because that is what the design draws. Increment
1 builds `/tenant` only; the other eleven 404 until their increment lands — the same state
`/for-landlords` and `/verification` sit in today from the marketing footer.

`/tenant/messages` · `/tenant/payment-plan` · `/tenant/payment-history` · `/tenant/maintenance` ·
`/tenant/rent-savings` · `/tenant/caution-deposit` · `/tenant/saved-properties` ·
`/tenant/my-rentals` · `/tenant/referrals` · `/tenant/notifications` · `/tenant/settings`

The route shape is `/tenant/…` under a `(dashboard)` route group rather than `/dashboard/…`: the
design ships five distinct role sidebars, so the role has to be in the URL, and a route group adds
no segment.

## 10. Gate not closed by this increment

`npx tsc --noEmit`, `npx eslint src` and `npx next build` are all clean (22 routes, `/tenant`
prerendered static). The **no-horizontal-scroll-at-nine-widths** gate is reasoning over the compiled
CSS, not observation — there is no browser or screenshot tooling for the running app in this
environment. That gate needs a human look in a browser to actually close.

---

# Increment 2 — TN5 pay rent, TN25 payment failed

## 11. `/tenant/payment-history` has no design, at any width

The sidebar draws a **Payment history** row, and the dashboard's payments panel draws a **View all**
link. Neither has a destination frame. Searched section `50:4` exhaustively:

- Every frame whose name contains `payment` is either a *panel* inside another screen, or one of the
  six pay-rent / payment-failed screens.
- A parent trace on every `history-*` node in the dump resolves each one to **my-rentals**,
  **rent-savings**, **referral-dashboard** or **caution-deposit** — none to a payments screen.

Under "do not invent extra features beyond the supplied designs" this is reported rather than built.
`/tenant/payment-history` stays a 404 until a frame exists, same as the other unbuilt sidebar rows
in §9.

## 12. `/tenant/payment-plan` and TN5 pay-rent are the same screen

There is no separate "payment plan" screen either. TN5 is the screen that carries the plan's
pay-full-vs-installment `payment-toggle`, and the dashboard CTA already points at it
(`TENANT_DASHBOARD.action.href === TENANT_ROUTES.paymentPlan`). So the sidebar's **Payment plan**
row and TN5 resolve to one route rather than one route being invented for each.

## 13. The six frames disagree about whether these screens are inside the shell

This is the sharpest contradiction in the tenant section:

| Screen | 390 | 768 | 1440 |
| - | - | - | - |
| TN5 pay rent | in shell | **standalone card** | standalone card |
| TN25 payment failed | in shell | **full tablet shell** | standalone card |

Resolved by a detail the frames themselves supply: on pay-rent at 390, `tab-payments` in the mobile
tab bar is drawn **active** (brand teal). A tab bar only renders an active tab for a route that is
inside the shell. So both screens are dashboard destinations below `lg` and focused standalone cards
at `lg` — which contradicts exactly one frame (pay-rent at 768, drawn without chrome) instead of the
two or three either uniform reading would contradict.

Built with a **route group**, whose documented purpose is "opting specific route segments into
sharing a layout, while keeping others out"
(`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md`):

```
src/app/(dashboard)/tenant/(shell)/…      ← sidebar + topbar + mobile nav
src/app/(dashboard)/tenant/(checkout)/…   ← topbar + mobile nav, no sidebar
```

`DashboardShell` was **not modified**. Each of its three sub-components already carries its own
responsive visibility (`DashboardSidebar` is `lg:flex`, `DashboardTopbar` is `md:flex lg:hidden`,
`DashboardMobileNav` is `md:hidden`), so composing topbar + mobile nav *without* the sidebar
produces "chrome below `lg`, nothing at `lg`" for free. The one additive change was exporting the
existing `toNavLinks` helper so the second layout can reuse it — a `ComponentType` in the nav config
cannot cross a `"use client"` boundary, but a rendered element can.

`TENANT_NAV_MOBILE`'s **Payments** tab was repointed from `paymentHistory` to `paymentPlan` so the
active state the 390 frame draws is actually reachable.

## 14. The amount is ₦550.00, not ₦550,000.00

The three payment-failed frames draw **₦550,000.00**; the three pay-rent frames draw **₦550.00**.
₦550.00 wins on four counts, not just the 3–3 frame count:

- `TENANT_PAYMENT_PLAN.installments[2].amount` is already `₦550` (increment 1, from Figma).
- The plan totals ₦1,450, of which ₦900 is paid — the remainder *is* ₦550.
- `src/constants/marketing.ts` already ships "₦900 of ₦1,450 (62%)" verbatim.
- The failed screen is reached *from* the pay-rent screen; the figure cannot change in between.

## 15. Other per-frame contradictions

| # | What the design draws | What was built | Why |
| - | - | - | - |
| 1 | pay-rent at 768 puts amount and meta **side by side** with a compressed 2-line meta block and no divider | one label/value list with a divider at all three widths | Five of the six frames draw the stacked list-plus-divider; this is the lone outlier. |
| 2 | pay-rent at 768 **omits "Name on card"** | field kept at all widths | Hiding a form control by viewport is a functional defect, and a `display:none` input still submits. |
| 3 | pay-rent at 390 labels the field **"Expiry"**; 768/1440 label it **"Expiry (MM/YY)"** | "Expiry (MM/YY)" everywhere | `Input.label` is typed `string`, not `ReactNode`. Widening a locked primitive to shorten one label by seven characters is not worth it. |
| 4 | payment-failed at 390 sets the amount label **uppercase** ("FINAL INSTALLMENT DUE") and shortens the 4th meta label to "Progress" | sentence case, "Plan progress" | Five of six frames agree. |
| 5 | payment-failed at 390 adds a **dashboard-style page header** ("Pay Rent" / "Review and complete your payment.") above the card | dropped | It is the only frame with it, and it would put a second `<h1>` above the banner's "Payment Failed" heading. |
| 6 | Both mobile frames carry an iOS **status bar** and **home indicator** | dropped | Device chrome. Same precedent as §3.7. |

## 16. Elements that genuinely are per-breakpoint (built as drawn)

- **Badge "Installment 3/3" is 768-only.** Built `lg:hidden` inside a `hidden md:flex` logo row, so
  it never appears at 390 or 1440.
- **The "payments are held until the due date" note is 1440-only.** Built `hidden lg:block`.
- **The form header ("Complete payment" / description) is not drawn at 390.** Built
  `sr-only md:not-sr-only`, not `hidden md:block`: the page still needs an `<h1>` at 390 for the
  heading-hierarchy gate. For the same reason the summary panel's amount label is a `<p>` carrying
  the `aria-labelledby` target rather than an `<h2>` — an `<h2>` there would sit above the `<h1>` in
  DOM order at 390.
- **Three authored copy variants again**, handled with `ResponsiveText` as in §4:

  | Element | 390 | 768 | 1440 |
  | - | - | - | - |
  | Form title | *(sr-only)* Complete payment | Complete payment method | Complete payment |
  | Form description | Paying the final installment… | Secure rent processing held in Escrow. | Paying the final installment… |
  | Footnote | Secure encrypted checkout. | Payments are encrypted and processed securely. | *(same as 768)* |

## 17. Two behaviours the design does not specify

- **The "Bank transfer" segment has no panel at any width.** Every frame draws the toggle with
  **Card** selected and card fields below it; nothing shows what bank transfer looks like. Rather
  than invent that panel or leave a control that silently does nothing, `SegmentedControl` gained an
  additive `disabledValues?: readonly TValue[]` (defaults to `undefined`, so no existing call site
  moved) and the segment renders disabled and is skipped by arrow-key navigation. This is a
  *state* the phase brief already asks for, not a new feature.
- **Submitting the form navigates to `/tenant/payment-plan/failed`.** There is no payment-success
  screen anywhere in the tenant section — failure is the only designed outcome of this form, and it
  is how the TN25 screen is reachable at all. `Try Again` and `Use Different Card` both return to
  the form, because that is the only other screen the pair can lead to.

## 18. Geometry: the card matches Figma exactly at 1440 and 768

The wrapper is sized so the padded content box equals the Figma card, rather than approximating it:

| Width | Wrapper | Content box | Figma card |
| - | - | - | - |
| 390 | `w-full px-4` | 358 | 358 ✓ |
| 768 | `max-w-176 px-8` (704 − 64) | 640, at x=64 | 640 at x=64 ✓ |
| 1440 | `lg:max-w-258 lg:px-4` (1032 − 32) | 1000, at x=220 | 1000 at x=220 ✓ |

`lg:py-32` (128px) against a drawn y of 130, and `md:py-8` (32px) against the tablet's y=32. The
split is `lg:grid-cols-[440fr_560fr]` over `lg:min-h-160` (640px) — the drawn 440/560 columns.

The desktop amount is drawn at ~56px, which is not on the type scale. It uses the scale instead:
`text-heading-xl md:text-display-lg lg:text-display-xl` (32 → 36 → 48px) with `tracking-tight`, so
the tightening scales with the size rather than being pinned to the `-1px` the frame uses.

## 19. Gate status for increment 2

`npx next typegen`, `npx tsc --noEmit`, `npx eslint src` and `npx next build` are clean — **24
routes**, both new pages prerendered static. The new utilities were confirmed in the emitted bundle
(`440fr 560fr`, `.leading-4\.5`, `#ffffff26`, `not-sr-only`, `max-w-176`, `max-w-258`, `min-h-160`)
rather than assumed. `src/` is still comment-free.

The nine-width no-horizontal-scroll gate carries the same caveat as §10. One width is worth
flagging: at **1024** the `lg` layout is active but `max-w-258` exceeds the viewport, so the card
falls back to `w-full` with 16px gutters instead of the 220px the 1440 frame draws. No overflow, but
it is the tightest point in the range.
