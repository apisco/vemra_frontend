# Vemra — Phase 6 Figma deltas (Landlord)

Everything the Landlord implementation could not take literally from the design, and what it does
instead. Nothing here was resolved by inventing a value silently.

This document is written incrementally, one increment at a time. Covered so far:

- **Increment 1 — landlord shell + LL2 dashboard** (§1–§14). Frames: `50:5` section; LL2 at
  `9:1238` (1440), `109:5597` (768), `102:3639` (390).
- **Increment 2 — properties** (§15–§24). LL7 at `13:343` / `109:5840` / `102:3864`, LL8 at
  `57:186` / `109:6807` / `102:5040`, LL3 at `57:284` / `109:6885` / `102:5134`.

---

## 1. The screen inventory is stale for this section too

Same cause as `tenant-figma-deltas.md` §1: the workflow change edited landlord frames **in place**.
Two corrections found by reading `50:5` live:

| Node | `docs/screen-inventory.md` | Live Figma |
| - | - | - |
| LL12 (`6:118`) | Agent invite | `vemra-property-admin-invite`, and the frame carries `hidden="true"` |

LL12 is also a **recipient-facing 480px invite card**, not a landlord destination, so it is out of
scope for the landlord routes. Every landlord screen must be read live before it is built; the
section was not re-dumped to `.figma-refs/` for this increment, so LL3–LL22 still cost MCP calls.

## 2. The 768 frame is broken and cannot be built as drawn

`stats-grid` at 768 declares a height of **100px**, but its 2×2 children need **272px**. The
next sibling, `property-admin-card`, is positioned at `y=262`, so it renders **on top of** stat
cards 3 and 4 and buries them completely. This is visible in the render, not just the metadata —
only "Occupied units" and "Ready to withdraw" survive.

Built as normal flow with no overlap: all four cards in a 2×2 grid, then the admin card below it.
This is the single largest deviation in the increment, and it is the one place where the tablet
frame gives no usable evidence for anything it covers.

## 3. Internal contradictions in the design

| # | What the design draws | What was built | Why |
| - | - | - | - |
| 1 | `Occupied` badge is **solid dark green** at 1440, a **soft pill** at 768 | `Badge variant="success"` (soft) everywhere | `Vacant` and `Assigned` are soft at every width. Desktop's solid green is the outlier of four badges. |
| 2 | Rent values alternate **teal / dark by odd-even row** at both widths | uniform `text-neutral-900` semibold | 3 teal rows matches nothing in the data — not the 4 cleared payments, not the 5 occupied units, not the vacancy. Alternation by row index is decoration, and the design system has no "alternating value" treatment. |
| 3 | `Next rent due` is **amber** at 390, **neutral** at 1440 | `tone: "warning"` at all widths | Matches the shipped tenant dashboard's identical "Rent due / Sep 5" metric. The 768 card is buried (§2) so it casts no vote. |
| 4 | Admin-card buttons invert: 768 draws **View profile secondary + Message as a bare teal link**; 390 draws **View profile primary + Message secondary** | the 390 pairing | A bare text link next to a bordered button is the odd one out of the four buttons on the screen. |
| 5 | Both 1440 widget avatars read **`DO`** although the names are Priya Nandan and Tunde Alabi | initials derived from the name (`PN`, `TA`) | 390 already draws `PN` correctly, so the desktop widget is a copy-paste slip. Fixed for free by omitting `initials` and letting `Avatar` derive them. |
| 6 | The `wallet` glyph is used **twice** in the sidebar — Caution Deposits and Payout account | Caution deposits → `ShieldIcon`, Payout account → `WalletIcon` | `ShieldIcon` is already what the shipped tenant sidebar uses for "Caution deposit". Two rows sharing a glyph is a placeholder, same class as tenant's duplicate "More" house glyph. |
| 7 | The 390 `Payouts` tab and the sidebar `Payout account` row point at the **same destination with different glyphs** (credit card vs. wallet) | `WalletIcon` in both | The shipped tenant nav keeps one glyph per destination across all three navs (Overview, Messages, Payments). The sidebar is the authoritative full nav. |
| 8 | The 768 header avatar is **18×32** and the 768 admin avatar **17px wide** — both clipped | rendered at their full 32px | Reproducing the clip would put a sliced avatar on screen. Same treatment as `auth-figma-deltas.md` §12. |
| 9 | Buttons are **44px** at 768, **40px** at 1440 and 390 | `size="sm"` (40px) everywhere | Two widths to one, and 40 is the height the whole component library ships. |
| 10 | Sidebar labels mix cases: `Caution Deposits` (title) vs. `Payout account` (sentence) | sentence case throughout | Matches the shipped tenant sidebar, where every one of the twelve rows is sentence case. |
| 11 | Two identical **`Withdraw funds`** CTAs on the 1440 screen — one in the header, one in the widget | both built | Drawn deliberately at the only width that has room for both; they share a destination and a label, which is a duplication worth flagging but not a contradiction. |

## 4. `READY` is a stale column label

The 1440 table's last column is headed **`READY`**, which reads as the "Ready to withdraw" figure
(₦6,275). Its values do not support that: 1450 + 1200 + 1800 + 1300 + 2400 = **₦8,150**, which is
the "Monthly rent roll" metric. The 768 frame heads the same column **`RENT`**.

Built as **`Rent`**. The date column keeps its own header, `Rent due`, and appears at `lg` only.

## 5. `Property Admin` is the only header not in caps

Four of the five 1440 headers are uppercase (`PROPERTY`, `STATUS`, `RENT DUE`, `READY`); the fifth
is drawn `Property Admin`. The copy is stored sentence-case in `src/constants/landlord.ts` and the
header cells apply `uppercase`, which normalises all five without a second copy of the string.

## 6. The design genuinely differs by width — this is not a bug list

Everything in this table was built as drawn:

| Block | 390 | 768 | 1440 |
| - | - | - | - |
| Greeting + summary | ✓ | ✓ | ✓ |
| `Withdraw funds` | own row under the greeting | header right | header right |
| `Add property` | ✓ | ✗ | ✗ |
| Stat cards | 3 stacked | 4 in a 2×2 | 4 in a row |
| Monthly rent roll | a bar-chart card | stat card 4 | stat card 4 |
| Assigned-admin card | ✓ (count, "3 active") | ✓ (lists 3 units, adds a badge) | ✗ |
| Withdraw widget | ✗ | ✗ | ✓ (380×262) |
| Vemra Property Admins | ✗ | ✗ | ✓ (2 admins) |
| Properties table | ✗ | 4 columns / 4 rows | 5 columns / 5 rows |

DOM order is single and unconditional — header, stat grid, revenue-roll card (`md:hidden`),
admin card (`lg:hidden`), then the table / right-widgets split. Nothing is duplicated to satisfy a
breakpoint, so the reading order matches the visual order at all three widths.

The 768 admin card also loses the `Assigned Property Admin` eyebrow that 390 draws and gains an
`Assigned` badge in its place; both are handled with visibility utilities on one element each.

## 7. Routes the design links to but never draws

`View profile` and `Message` have **no destination frames anywhere in `50:5`**. They point at
`/landlord/property-admins` and `/landlord/messages`, which 404 until those screens are designed —
the same treatment `/tenant/payment-history` got (`tenant-figma-deltas.md` §9, §11).

Likewise, the sidebar has **no Applications row** even though LL9/LL10 exist and the 390 tab bar
promotes one (`tab-applications`, labelled "Updates"). `/landlord/applications` is therefore
reachable from the mobile tab bar only, exactly as drawn.

The `Updates` tab's `users` glyph is kept as drawn: unlike tenant's "More" slip (§3.6 above,
`tenant-figma-deltas.md` §3.3) it is not a duplicate *within* its own tab bar, and applications
plausibly warrant a people glyph.

## 8. Shell gutters differ by role; the shell was not touched

| Width | Landlord frame | Tenant frame (what `DashboardShell` implements) |
| - | - | - |
| 1440 | 48px gutters, 1084 content | 64px gutters, 1052 content |
| 768 | 24px gutters | 32px gutters |

`DashboardShell` is locked and role-agnostic — the landlord layout reuses it with **zero**
modification, so landlord renders at tenant's gutters. Changing it would move every shipped tenant
screen to satisfy one role. Flagged rather than absorbed: if the 48/24 values are intentional the
shell needs a per-role gutter prop, which is a foundation change and needs sign-off.

## 9. Values snapped to the type scale

Three text sizes in LL2 fall between existing tokens. Each was snapped to the nearest, never to a
new arbitrary value:

| Element | Figma | Token used | Delta |
| - | - | - | - |
| Revenue-roll value (390) | ~24px | `text-heading-md` (22px) | −2px, and it matches the stat-card values on the same screen |
| Greeting summary (1440) | ~13px | `text-body-md` (14px) | +1px |
| Withdraw amount (1440) | ~36px | `text-display-lg` (36px) | exact |

The summary is **not** stepped up to `body-lg` at `md` the way the tenant header is: the landlord
frame draws it at roughly 13px at 1440, where tenant draws 16.

## 10. Bar chart colours

The 390 revenue chart has no colour tokens attached — three pale bars and two solid ones, read from
the render. The pale fill matches `neutral-200` (#dde6e9) and the solid matches `brand-700`. No new
token was added. The chart is `aria-hidden` and the figure it encodes (₦8,150) is adjacent as text,
so nothing is lost to assistive technology.

## 11. The table primitive keeps its padding; the card gives up its own

`TableCell` hard-codes `px-4`, and `cn()` does not merge conflicting classes, so overriding it from
a consumer is not reliable. To land the column text on the same left edge as the card title, the
card carries **no horizontal padding at `md` and `lg:px-2`**, and the title carries `px-4`. Text
aligns exactly at 16px (768) and 24px (1440) as drawn. The cost is that the row dividers run 8px
wider than the text on each side at `lg`; the frame insets them to the text. Text alignment was
judged the more visible of the two.

## 12. One new icon, no new primitives

`UsersIcon` is the only asset LL2 needed that did not exist. It is derived from the shipped
`UserIcon` path shifted −2 on x plus a second figure, so its stroke geometry matches the set
exactly. Everything else — `DashboardShell`, `StatCard`, `Badge`, `Table`, `Avatar`, `Button` /
`buttonClasses`, `ResponsiveText` — was reused unmodified. LL2 is the **first real consumer of
`Table` with a header row**; tenant deliberately used `<ul>` for its headerless mini-tables.

Two small refactors came out of it, both behaviour-preserving:

- `DashboardNavItem`, `DashboardUser` and `MetricTone` moved from `src/constants/tenant.ts` to
  `src/types/dashboard.ts`, so the landlord constants never import from a tenant file.
  `constants/tenant.ts` re-exports all three, so no existing consumer changed.
- The tone → colour map moved to `src/lib/metric-tone.ts` and is now shared by both roles' stat
  grids rather than duplicated.

## 13. Not implemented

The 390 frame carries an iOS **status bar** and **home indicator**. Device chrome, not product UI —
dropped, same as phases 3, 4 and 5.

## 14. Gate status for increment 1

`npx next typegen`, `npx tsc --noEmit`, `npx eslint src` and `npx next build` are clean — **25
routes**, `/landlord` prerendered static. The fractional utilities this increment introduced were
confirmed in the emitted bundle (`.h-7\.5`, `.h-8\.75`, `.h-12\.5`, `.h-13\.75`, `.h-15`,
`.w-6\.5`, `678fr 378fr`, `.max-lg\:hidden`) rather than assumed, and the prerendered HTML was
checked for the §3.5 fix (`PN` / `TA`, no third `DO`) and the §4 rename (zero occurrences of
`READY`). `src/` is still comment-free.

The nine-width no-horizontal-scroll gate carries the same caveat as `tenant-figma-deltas.md` §10:
it is reasoning over the emitted CSS, not observation in a browser. The tightest point is **768**,
where the four-column table has to fit 704px of content — the `Rent due` column is held back to
`lg` for exactly that reason, and `Table` keeps its own `overflow-x-auto` as a floor.

---

## 15. Two new primitives, and why neither is a duplicate

Phase 3 forbids duplicate UI primitives. Two were still missing:

- **`EmptyState`** — `docs/screen-inventory.md` already calls for one component across 12 screens.
  LL3 is the first consumer. Props are `icon` / `title` / `description` / `action` / `headingId` /
  `className`, with `description` and `action` as `ReactNode` so a screen can pass
  `ResponsiveText` or a `Link` styled with `buttonClasses`. Responsive by the LL3 frames: badge
  64→80px, icon 32→40px, card padding 32→64px, gap 20→24px, text block capped at 480px. No `sm`
  variant was added — LL15 is the next empty state and it can decide whether one is needed rather
  than having it guessed now.
- **`Textarea`** — none of the 13 files in `src/components/ui/` does multi-line input; `Input`
  renders `<input>` only. It mirrors `Input`'s API (`label` / `hideLabel` / `helperText` /
  `error` / `containerClassName`) and adds `fieldClassName` for LL8's two drawn heights.

Everything else on the three screens is reused unchanged: `Tabs`, `Table`, `Badge`, `Input`,
`Button` / `buttonClasses`, `Avatar`, `ResponsiveText`, `DotIcon`, `HouseIcon`. No new icons.

## 16. LL7 contradictions

| # | What the design draws | What was built | Why |
| - | - | - | - |
| 1 | The `Vacant` pill is `#fef6e5` on `#4c5e65` at 1440 and `#fffbeb` on `#92400e` at 390 | `Badge variant="warning"` (`warning-50` #fffbeb / `warning-600` #d97706) at both | Neither pair is tokenised — `#fef6e5` and `#92400e` appear nowhere in `globals.css`. The 390 pair is one step off the token pair; the 1440 pair puts a neutral text colour on a warning state. |
| 2 | The 1440 filter tabs are unpadded labels separated by a 24px gap, underline sitting directly under the text | the shipped `Tabs` (`underline`), which pads each tab `px-4 py-2.5` | Building a second tab strip would violate the no-duplicate-primitives rule, and `Tabs` already carries the roving `tabIndex` and Arrow/Home/End handling Phase 3 asks for. The underline runs ~32px wider per tab than drawn. |
| 3 | The 768 frame sets `hidden="true"` on the `Assigned by Vemra` sub-label for the five assigned rows, but keeps the unassigned row's note | built exactly that way — assigned notes carry `max-lg:hidden`, the unassigned note does not | 768 has to fit six columns in 704px; the frame is buying width back deliberately, so it is honoured rather than normalised. |

The `Occupied` pill (`#edf8f5` / `#0f7b54`) is an exact `Badge variant="success"` match — no delta.

## 17. LL7 genuinely differs by width

Built as drawn:

| Block | 390 | 768 | 1440 |
| - | - | - | - |
| Layout | photo-led cards | 6-column table | 6-column table |
| Admin column header | — | `Vemra Property Admin` (wraps to 2 lines) | `Property Admin` |
| `Assigned by Vemra` sub-label | — | ✗ | ✓ |
| Unassigned row action | — | `Support` | `Request support` |
| Empty tenant | the card shows the vacancy note instead | `—` | `-` |
| `Add property` | `+ Add` pill, 28 tall | full label, 44 tall | full label, 44 tall |
| `6 properties across 3 locations` | ✗ | ✓ | ✓ |

Two notes. The 390 frame draws only three of the six cards — the frame is clipped, not a
three-item list, so all six render. And the empty-tenant cell is a hyphen at 1440 and an em dash
at 768; the em dash ships at both.

## 18. LL8 deltas

- The status pill's `#1e9e6a` border is the only green outline in the file and is untokenised.
  Shipped as `success-600` (#0f7b54) — the pill's own text colour.
- `Cancel` is drawn `bg-[var(--neutral/black, black)]`: a raw black behind a broken variable
  reference. The library has no black button, and a black `Cancel` beside a teal `Save` reads as
  the heavier action being the safe one. Shipped as `secondary`.
- The 1440 admin avatar reads `DO` while the name is Priya Nandan — the third instance of the slip
  in §3.5. Same fix: initials derived from the name, and the prerender carries exactly one `PN`.
- `Avatar` is `rounded-full`; the frame draws a 16px-radius square. Kept round — LL2's shipped
  widgets are round, and `cn()` cannot reliably override a radius the primitive hard-codes.
- The panel's own title was not captured in the live read. The Sep-8 dump shows it as
  `Assigned agent` with `Managing agent since Jan 2024` and a `Reassign` action — all three
  replaced by the workflow change. It ships as **`Assigned Property Admin`**, the string LL2
  already uses for the same relationship. Flagged as reconstructed, not drawn.
- 390 drops the admin panel entirely and adds a photo gallery (358×160 plus three 114×48) that
  neither larger width draws. Both built as drawn.
- 390 draws a shorter description, dropping the transit sentence. **Not** honoured: a `<textarea>`
  holds one string and scrolls, so the short version is frame clipping rather than a copy
  decision. The full text ships at every width.
- 390's rent value reads `₦ 1,450` under a `Monthly rent (₦)` label. Shipped as `1,450`, the
  1440/768 value, so the symbol is not doubled.
- `Bedrooms` is a text box holding `2 Bedrooms` with no options list anywhere in the frame. Shipped
  as a text `Input`; inventing the option set would be inventing a feature.

## 19. Listing data the design does not supply

Figma details exactly one listing. Five more need data for `/landlord/properties/[propertyId]` to
exist at all:

| Field | Unit 4B | The other five |
| - | - | - |
| `description` | verbatim from Figma | written for this build |
| `listedSince` | `Jan 2024`, drawn | written |
| `bedrooms` | `2 Bedrooms`, drawn | written |
| `photos` | not drawn at 1440/768; 390 draws four slots | mapped to `public/marketing/*.png`, the only property photography in the repo |

Unit 4B's description was recovered verbatim from `.figma-refs/page.xml` rather than retyped. That
dump is stale for anything the workflow change touched — it still says `6 properties across 2
buildings` where the live frame says `3 locations` — so it was used only to confirm strings the
live read had already shown, never as a source in its own right.

Everything LL7 draws — names, tenants, admins, rents, statuses, the vacancy date, the unassigned
note — is verbatim.

## 20. LL2 and LL7 describe the same six properties differently

| | LL2 (`9:1238`) | LL7 (`13:343`) |
| - | - | - |
| Naming | `Maple & 9th, Unit 4B` | `Unit 2A · Maple & 9th` |
| Rents | 1,450 / 1,200 / 1,800 / 1,300 / 2,400 | 1,450 / 1,450 / 1,290 / 1,325 / 1,325 / 1,600 |
| Total | ₦8,150 — matches LL2's own `Monthly rent roll` metric | ₦8,440 — matches nothing on either screen |
| Third location | `Cedar Heights, Unit 12`, admin `Daniel Osei` (the landlord himself) | `7 Riverside Court`, admin `Unassigned` |

Both ship as drawn. Reconciling means overwriting one approved frame's data, and only LL2's set
balances against the rent-roll metric — so which is canonical is a design decision, not a build
one. `Cedar Heights` naming the landlord as his own Property Admin also contradicts the workflow
change the rest of the section is built around.

One name **was** normalised: LL8 draws `Unit 4B, Maple & 9th` with a comma, LL7 draws
`Unit 4B · Maple & 9th`. The detail page reads its name from the LL7 record so the list and the
screen it opens agree.

## 21. Values snapped to the scale (increment 2)

| Element | Figma | Token used | Delta |
| - | - | - | - |
| LL7 cell text | 14/20 | `text-body-sm` (13px) | −1px, the size every shipped table uses |
| LL7 row padding | 24 / 20 | `lg:px-6 lg:py-5` per cell | exact at 1440; the primitive's 16/12 holds at 768, whose rows are drawn 56 tall |
| LL7 row divider | `#dde6e9` | `border-neutral-100`, hard-coded in `TableRow` | one step lighter |
| LL8 field label | 13/20 | `text-label-md` (14px), from `Input` | +1px |
| LL8 field box | `p-12`, 46 tall | `Input`'s `h-11 px-3` | −2px |
| LL3 checklist row padding | not drawn | `p-3` | no evidence either way |

The variant-prefixed overrides above (`lg:px-6`, `md:h-20`, `max-md:h-7`) are the same technique
§11 settled on: `cn()` does not merge, so only media-prefixed classes can safely beat a
primitive's unprefixed base.

## 22. More routes with no destination frames

`Request support` on LL7's unassigned row has no destination anywhere in `50:5`.
`LANDLORD_ROUTES.support` was added as `/landlord/support`; it 404s exactly like
`/landlord/tenants`, `/landlord/property-admins` and `/landlord/messages` (§7). `Add property`
points at `/landlord/properties/new`, which lands with LL4 in increment 3.

## 23. Behaviour the design does not draw

- **LL3 has no entry point.** It is reachable at `/landlord?state=empty`, the same way the tenant
  flow gives `/tenant/payment-plan/failed` a real URL. Reading `searchParams` on the server moves
  `/landlord` from static prerender to on-demand rendering — visible in §24. That was chosen over
  the `useSearchParams` + `<Suspense>` pattern `/verify-email` uses: there the fallback is the
  default variant, which here would flash a fully populated dashboard before the empty one.
- **The 390 property cards draw no action.** Each card is wrapped in a link to its detail page — a
  list you cannot open at the one width where the `Manage` column does not exist is broken. The
  desktop `Request support` action is untouched.
- **`Save changes` and `Unlist` have no success or confirmation screen** (SH7's confirmation
  dialogs are a later pattern sheet). Both run the same kind of local stub as
  `src/features/tenant/pay-rent-form.tsx` and return to `/landlord/properties`, with `isLoading`
  on the pressed button and the other disabled meanwhile.
- **`Tabs` renders all three filter panels** and hides the unselected two, so the six rows sit in
  the DOM three times. Accepted: that is what the shipped primitive does, `hidden` keeps the
  copies out of the accessibility tree, and the alternative is a second filtering primitive.

## 24. Gate status for increment 2

`npx next typegen`, `npx tsc --noEmit`, `npx eslint src` and `npx next build` are clean — **32
routes**, up from 25. `/landlord/properties` prerenders static, the six detail pages are SSG via
`generateStaticParams`, and `/landlord` is now `ƒ` for the reason in §23.

The new utilities were confirmed in the emitted bundle rather than assumed: `.max-w-120`,
`.md\:min-h-95`, `.h-25`, `.md\:h-20`, `.lg\:w-45`, `.lg\:w-30`, `.lg\:w-25`, `.lg\:px-6`,
`.lg\:py-5`, `.max-md\:h-7`, `.max-md\:h-9`, `.last\:border-b-0` and `.md\:[&_svg]\:size-10`. The
prerendered HTML was checked for the derived tab counts (`All (6)` / `Occupied (5)` /
`Vacant (1)`), the 768 header string, the unassigned row's note, a single `PN` on LL8's admin
avatar with no fourth `DO`, and the absence of an admin panel on
`/landlord/properties/7-riverside-court`. `src/` is still comment-free.

The nine-width gate carries the same caveat as §14. The tightest point is again **768**: six
columns in 704px. Measured off the emitted classes the columns need roughly 685px, which fits —
and `Table` keeps its own `overflow-x-auto` as the floor if a longer property name pushes past it.
