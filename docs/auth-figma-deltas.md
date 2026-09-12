# Vemra — Phase 4 Figma deltas

Everything the Authentication & Onboarding implementation could not take literally from the
design, and what it does instead. Nothing here was resolved by inventing a value silently.

This document is written incrementally, one screen at a time, as each screen's design context is
retrieved and built. Screens covered so far: **AU1 sign up — role picker**, **AU2 sign up —
details**, **AU3 identity verification**, **AU4 login**, **AU5 forgot password**, **AU6 reset
password**, **AU7 email verified**, **AU8 two-factor setup**, **AU9 verification pending**,
**AU10 verification rejected**, **AU11 terms & privacy**, and **TN1/LL1/AG1 onboarding complete**
— all 13 screens of the phase.

---

## 1. Brief items that no auth frame draws

The Phase 4 brief lists ten build-order screens and a set of per-screen states. Several of those
states appear in none of the 33 auth frames. Each derived item below records what real design it
was derived from.

| Brief item | Design status | Derived from |
| - | - | - |
| Forgot-password confirmation state | absent | AU7's status pattern — same `StatusIcon` + centred header + email in semibold |
| Forgot-password error state | absent | **not built** — see §5 |
| Email verification "pending" | absent | AU9's designed hourglass glyph + AU7's card geometry |
| Email verification "expired" | absent | AU10's designed alert-triangle glyph + AU7's card geometry |
| Email verification "resend" | absent | AU7's card geometry; placeholder handler + polite live region |
| Password strength meter | drawn in the DS, in no auth frame | the DS Inputs showcase specimen — see §6 |
| Confirm-password on sign up | absent | AU6's field pattern; AU2 draws four fields and no confirm |
| Reset-password success screen | absent | AU7's status pattern |
| Welcome screen (brief item 1, the *entry* screen) | resolved to AU1 | user decision: AU1 is the entry screen, so no `/welcome` **entry** route was built. Not to be confused with `/welcome/[role]`, which is brief item 10 — the onboarding-**completion** screen, fully designed as TN1/LL1/AG1 and built in §20 |

## 2. Contradictions between the brief and the design

The design wins on copy and structure; the brief wins on behaviour it explicitly mandates.

- **"Email Verification" is two unrelated flows.** AU7 (`135:4209`) confirms an **email
  address**. AU3/AU9/AU10 review **identity documents** (government ID, proof of ownership,
  payout account). The brief conflates them into one screen. Both are built; they are not merged.
- **Login draws no show/hide password toggle.** The brief requires one. Added via `Input`'s
  existing `showPasswordToggle` prop — no new markup.
- **Login labels the checkbox "Stay signed in"**; the brief says "Remember me". Design copy wins.
- **Login adds two controls the brief omits**: a Tenant/Landlord/Agent segmented control and a
  "Continue with Google" button. Both are built, because they are drawn.
- **No login loading or validation frames exist.** Those states come from `Button isLoading` and
  `Input error`, which already carry `aria-busy`, `aria-invalid`, `aria-describedby` and
  `role="alert"`.

## 3. Contradictions between widths of the same screen

Where two frames of one screen disagree, neither is authoritative on its own. Each resolution
below picks the reading that both frames imply.

- **Auth card fill.** The 1440 frames of AU4, AU5 and AU6 report the card fill as `#f7f9fa` — the
  page background colour. Their 768 and 390 frames all report `#ffffff`. Built `bg-white`; the 1440
  fill is a design slip. (AU7's 1440 frame reports `#ffffff` correctly, so this is per-screen, not
  universal.)
- **AU6 description.** 1440 and 768 draw "Choose a new password for aisha.bello@example.com" as one
  flat run of `body/md` `#4c5e65`. 390 splits it, rendering the email in Inter Semi Bold
  `#14232a`. Built with the email in semibold at every width — that is the reading AU5 and AU7 both
  use for the same sentence shape, and the flat run loses information rather than adding any.
- **AU6 description leading.** 22px at 1440 and 768, 20px at 390. Both honoured
  (`leading-[20px] md:leading-[22px]`, already `AuthHeader`'s `compact` description).
- **AU7 success badge.** 1440 draws `#e8f5ee` (= `success-50` exactly) with a **black** icon
  stroke; 768 and 390 draw `#edf2f4` (off-token, nearest `neutral-100 #f0f4f6`) with a **green**
  `#198754` stroke. Neither frame is internally coherent. The intent both agree on is a green
  success glyph on a success-tinted badge, so it is built `bg-success-50` + `text-success-600`.
- **Login Google button.** 1440 draws it solid teal (identical to the primary submit); 768 draws
  it as a secondary outline. Built as `variant="secondary"` — two identical primaries stacked is
  the less defensible reading.
- **"Stay signed in" default.** 1440 and 390 draw it checked, 768 unchecked. Defaults to checked.
- **AU7 copyright line type.** 12/18 at 1440, 14/20 at 768 and 390. Both are honoured
  (`text-body-md leading-[20px] lg:text-label-sm lg:leading-[18px]`).
- **Mobile card-footer type on login** mixes 14/20 and 12/16 within one sentence. Normalised to
  one size.
- **AU1's selected role card is drawn three different ways.** 390 fills it `#edf2f4` with a dark
  title and a `#4c5e65` description; 768 fills it `#03323d` (= `brand-950`) with every text run
  white; 1440 fills it `#0b7a8e` (= `brand-700`) but keeps the title `#14232a` while the
  description is white — about 2.3:1, which fails the brief's own accessibility gate. Only the
  `border-2 #0b7a8e` is unanimous. Built as the **768 reading**: it is the only frame whose text
  colours are internally consistent, the only one in which every element stays visible, and the
  only one whose card and chip fills land exactly on existing tokens. 390's reading would need two
  off-token values, one of which (`#2ec4b6`) has no token at all.
- **AU1's unselected card fill** reports `#f7f9fa` at 1440 — the same page-colour slip already
  recorded above for AU4, AU5 and AU6. Built `bg-white`.
- **AU1's unselected card description** is `#4c5e65` at 390 and 768 but `#37474e` at 1440. Built
  `neutral-700`, two frames to one.
- **AU1's tablet copy is shorter.** 768 draws "Browse verified homes, message landlords, and
  manage rent." and "Manage properties assigned to you by a verified landlord."; 390 and 1440
  agree on the longer forms. The long copy wins, two frames to one. The **tags** are not shortened
  — see §12, where their geometry proves the copy is identical at all three widths.
- **AU1's logo is non-monotonic**: 99×28 at 390 and 1440, but 118×32 at 768. `LogoMark
  size="fixed"` matches two of the three frames exactly. AU8 draws the identical three sizes
  (`135:4331`, `135:4403`, `135:4359`) and takes the same treatment.
- **AU8's card width is non-monotonic**: 480 at 1440 (`15:694`) but 500 at 768 (`108:4199`), both
  horizontally centred. Reproduced literally as `md:max-w-[500px] lg:max-w-[480px]`; see §15.
- **AU8's description and closing note each disagree at one width.** 768 reads "Required for secure
  account actions." and "…cannot be skipped for secure account management."; 390 and 1440 agree on
  "Required for admin accounts." and "…cannot be skipped for this account type." The two-frame
  majority wins, matching the AU1 tablet-copy resolution above.

- **AU9 and AU10's status icon is non-monotonic.** The badge is 64×64 with a 28px glyph at both
  1440 (`15:729`, `15:761`) and 768 (`108:4244`, `108:4285`), but 56×56 with a 24px glyph at 390
  (`101:4340`, `101:4404`) — mobile is smaller, not proportionally scaled, and the glyph shrinks
  with it. Reproduced exactly by a new `StatusIcon size="md"`
  (`p-4 [&_svg]:size-6 md:p-4.5 md:[&_svg]:size-7` = 16+24+16 at mobile, 18+28+18 from `md` up).
  AU7 keeps the existing 64/32 geometry as `size="lg"`, which stays the default, so that call site
  did not move.

- **AU9 and AU10's title-to-description gap disagrees.** 12px at 1440 (title bottom 40 → desc
  y=52), 8px at 768 (80 → 88 for AU9, 40 → 48 for AU10) and 8px at 390 (28 → 36). The two-frame
  majority wins: `AuthHeader variant="display"` is a flat `gap-2`, and the 4px desktop delta is
  recorded in §4.

- **AU9's status pills are real component instances at one width only.** 768 draws
  `<instance name="Badge">` (`108:4253`, `108:4257`, `108:4261`; `108:4294`, `108:4299` for AU10),
  while 1440 and 390 draw a plain `<frame>` wrapping a `<text>` at the same place. The instances
  measure 23px tall and 3–4px wider than the hand-drawn frames (78 vs 74, 106 vs 102). The
  component is clearly the intent at every width, so all six pills use `Badge size="md"`; the
  1px height and 4px width deltas are recorded in §4.

- **AU9 and AU10's CTA is hug-width at 1440 and full-width below.** 174×44 at x=633 for AU9
  (`135:4275`) and 191×44 at x=624.5 for AU10 (`135:4277`), both horizontally centred against the
  1440 axis; 520×44 edge-to-edge inside the 520 column at 768, and 358×44 at 390. Built as
  `w-full lg:w-auto` inside a centring column. Verified in the compiled CSS that `.lg\:w-auto` is
  emitted after `.w-full`, so the variant wins at `lg` despite `cn` being a plain join.

- **AU9's "Submitted 4 hours ago." line shrinks at mobile.** 155×20 at 1440 and 768, 133×18 at 390
  — a smaller type size, not a rewrap (the string fits on one line at all three widths). Built as
  `text-body-sm leading-[18px] md:text-body-md md:leading-[20px]`, matching the two measured line
  boxes.

## 4. Values that are off the token scale

No token was added or changed. Each value below is snapped to its nearest existing token, and the
delta is recorded rather than absorbed.

| Figma value | Where | Token used | Delta |
| - | - | - | - |
| `#959c9f` | login aside divider | `neutral-400 #8ca2ac` | nearest |
| `#238797` (1440), `#54a2af` (768) | login aside stat numbers | `brand-600 #0e96ac` | two different values for one element |
| `#edf2f4` | AU7 badge (768/390), progress tracks | `neutral-100 #f0f4f6` | nearest |
| `#5f7782` | tablet input placeholder | `neutral-700 #4c5e65` | nearest |
| `#2d3e46` | tablet input label | `neutral-800 #37474e` | nearest |
| `#198754` | AU7 icon stroke (768/390) | `success-600 #0f7b54` | nearest |
| 46px | login card buttons (1440) | `Button size="md"` (44px) | 2px; 768 draws 44 exactly |
| 10px | AU7 logo gap (1440) | `LogoMark` `gap-2` (8px) | 2px |
| 18px | mobile checkbox box | `Checkbox` (20px) | 2px |
| 12px | tablet checkbox label | held at 14px | design draws 14 / 12 / 14 across widths |
| `#edf2f4` | AU1 role tag fill | `brand-50 #f0f4f6` | nearest |
| `#0a7487` | AU1 role tag text | `brand-700 #0b7a8e` | nearest |
| `#2ec4b6` | AU1 selected icon chip (390) | **none** | no token exists — reported, not retrofitted |
| `#37474e` | AU1 unselected card description (1440) | `neutral-700 #4c5e65` | 390 and 768 both draw `#4c5e65` |
| 10px | AU1 role tag padding-x | `Badge size="md"` (12px) | 2px |
| 36×40 | AU1 icon chip (390) | square `p-2` + 20px glyph | see §12 |
| 25px | AU8 QR inset (768) | `p-5` (20px) | 5px; 1440 draws 20 exactly, 390 draws 20 horizontally |
| 10px | AU8 QR inset, vertical only (390) | `p-5` (20px) | the same 140px box is inset 20 horizontally and 10 vertically — the design's own inset is not uniform |
| 16px | AU8 closing-note leading (768) | `leading-[18px]` | 2px per line; 1440 and 390 both draw 18 |
| 28px | AU8 title line box (390) | `AuthHeader` `compact` (30px) | 2px; 1440 and 768 both draw 30 |
| 18px | AU8 description leading (390) | `AuthHeader` `compact` (20px at mobile) | 2px per line |
| 54px | AU8 OTP box height (768/1440) | `md:h-[54px]` | reproduced literally — no height token exists at 54 and the box is a fixed-size field, not a `Button` |
| 12px | AU9/AU10 title→description gap (1440) | `AuthHeader` `display` (`gap-2`, 8px) | 4px; 768 and 390 both draw 8 |
| 28px | AU9/AU10 title line box (390) | `AuthHeader` `display` (30px at mobile) | 2px; 1440 and 768 both draw 40, matching `md:leading-[40px]` exactly |
| 18px | AU9/AU10 description leading (390) | `AuthHeader` `display` (20px at mobile) | 2px per line |
| 23px | AU9/AU10 pill height (768 only) | `Badge size="md"` (24px) | 1px; the 1440 and 390 frames draw 24 exactly — see §3 |
| 78 / 106px | AU9/AU10 pill width (768 only) | `Badge size="md"` (intrinsic) | +4px over the 74 / 102 drawn at 1440 and 390 — the tablet frame uses the real component instance |
| 10px | AU9/AU10 pill padding-x | `Badge size="md"` (`px-3`, 12px) | 2px; identical to the AU1 role-tag delta above |
| `#edf8f5` | TN1/LL1/AG1 badge outer + step-number fill | `success-50 #e8f5ee` | nearest (−5 / −3 / −7) — see §20 |
| `#1E9E6A` | TN1/LL1/AG1 check stroke | `success-600 #0f7b54` | nearest; same mapping as `#198754` above |
| `#bce3df` | TN1/LL1/AG1 inner badge layer (44px) | **none** | no token in reach — reported, not retrofitted; badge renders single-tone — see §20 |
| 20px | TN1/LL1/AG1 mobile vertical padding | `AuthLayout` `py-10` (40px) | 20px; the shared auth convention is kept rather than forked — see §20 |
| 10px | TN1/LL1/AG1 logo gap | `LogoMark` `gap-2` (8px) | 2px; identical to the AU7 logo-gap delta above |
| 72 / 40 / 40 / 20 / 36px | TN1/LL1/AG1 badge, logo, gap, card padding, step circle (768 only) | the 390 + 1440 values | the whole tablet tier is non-monotonic — larger at 768 than at 1440 — and was not built; per-dimension table in §20 |

Figma effect styles map to shadow tokens **exactly**, and the MCP's inline `drop-shadow-[…]`
conversion is lossy — the styles list is authoritative:

| Figma effect style | Token |
| - | - |
| `elevation/overlay` — `#0000001F`, offset (0,4), radius 12 | `--shadow-elevation-2` |
| `elevation/navigation` — `#00000029`, offset (0,8), radius 24 | `--shadow-elevation-3` |

## 5. AU5 has no designed error state, and none was invented

The brief asks forgot-password for an "error state". No AU5 frame draws one. With no backend and
"client-side validation only", the only error that can actually occur is a malformed email, and
`Input` already renders it correctly (`border-error-600`, `role="alert"`, `aria-invalid`,
`aria-describedby`).

A form-level banner would require inventing both a trigger (rate limit? unknown account? neither
is observable without a backend) and its copy. So no banner, and no `auth-alert.tsx` yet. That
component will be built from AU10's **measured** inline reason box (`15:755`), which is real
design, and reused if a later screen needs it.

AU5's confirmation copy ("Check your email", "We sent a reset link to …") is derived-minimal and
follows AU7's sentence shape, including the email rendered in semibold `neutral-900`.

## 6. Reset password's strength affordance

AU6's only strength affordance is a static helper line: "Use 8+ characters with a mix of letters
and numbers." It is rendered through `Input`'s existing `helperText` prop. The brief's strength
**meter** is additive on top of it, not a replacement for it.

**Correction, made while building AU2.** An earlier revision of this section stated that the design
draws no meter anywhere. That was wrong. No *auth frame* draws one, but the Design System does:
`98:3689` "Inputs Showcase Grid" contains `98:3721` "Strength Indicator Wrapper", 314×26, and it is
fully expanded, so it is measurable. Its anatomy:

| Part | Measured |
| - | - |
| Segments | four, 74×4, **6px** apart, 314 total |
| Segments → label row | 6px |
| Label row | 16px tall |
| Left label | "Password Strength: Medium", 164 wide, x=0 |
| Right hint | "Include symbols for Strong", 140 wide, x=174 |

`PasswordStrengthMeter` was realigned to that specimen: the segment gap moved from 4px to 6px, the
label became `Password Strength: <level>`, and a right-hand hint was added on the same row with
`justify-between`. The three levels the specimen does not name — Weak, Strong, and the empty state —
keep the vocabulary it establishes (`Medium` for the middle level, not `Fair`). Only
`Include symbols for Strong` is designed copy; the three sibling hints
(`Use 8+ characters for Strong`, `Mix upper and lower case for Strong`, `Include numbers for
Strong`) are written to the specimen's template, one per rule in `passwordStrength()`, and the
first unmet rule is the one shown.

`PasswordStrengthMeter` sits *below* the field, inside the field's own 6px wrapper, so the designed
helper keeps its designed position and its `aria-describedby` link. It draws four segments — one per
rule — on `neutral-100`, filling with `error-600`, `warning-500` or `success-600`. No token was
added; the specimen carries no fills that `page.xml` can supply, so the colours are the semantic
tones the token layer already publishes.

The segments are `aria-hidden`. The password requirement is already announced to screen readers
through the designed helper text via `aria-describedby`, so a live region on the meter would
re-announce a level on every keystroke without adding information. The level label and its hint stay
visible text.

**`Input` fix this screen forced.** AU6 is the first field to pass both `error` and `helperText`.
`Input` built `aria-describedby` from both ids but rendered the helper only when there was no
error, so an invalid AU6 password would have pointed `aria-describedby` at a missing element —
failing the brief's own `aria-describedby` requirement. The two messages now render as siblings.
No other screen passes both, so nothing else changed.

## 7. Card and header geometry is per-screen, not a scale

Across four measured screens, card padding, internal gap and elevation never form a progression:

| Screen | Padding 390 / 768 / 1440 | Gap 390 / 768 / 1440 | Elevation |
| - | - | - | - |
| AU4 login | 24 / 32 / 40 | 24 / 24 / 28 | overlay → navigation |
| AU5 forgot | 28 / 40 / 32 | 24 / 28 / 24 | overlay → navigation |
| AU6 reset | 28 / 40 / 40 | 24 / 28 / 28 | overlay → navigation |
| AU7 verified | 24 / 40 / 48 | 28 / 32 / 32 | navigation at all widths |
| AU2 details | 16 / 32 / 32 | 16 / 24 / 20 | not measurable — inferred, see §19 |
| AU3 checklist | 18 / 32 / 28 | 16 / 24 / 24 | not measurable — inferred, see §19 |
| AU8 two-factor | **no card** / 40 / 40 | 20 / 32 / 28 | not measurable — inferred, see §19 |
| AU9 pending | 18 / 28 / 24 | 28 / 28 / 32 | not measurable — inferred, see §19 |
| AU10 rejected | 18 / 28 / 24 | 28 / 28 / 32 | not measurable — inferred, see §19 |

Mobile is 16, 18, 24 or 28, tablet 28, 32 or 40, desktop 24, 28, 32, 40 or 48, and the three axes
co-vary per screen rather than independently. A `sm | md | lg` scale would have needed a fourth key
at AU6, a fifth at AU2, a sixth at AU3, a seventh at AU9/AU10 and no key at all for AU8, whose 390
frame draws no card. `AuthCard` therefore takes one `variant`
(`split | prompt | form | status | details | checklist | review`), each a measured frame, matching
the vocabulary `AuthHeader` already used. The first four class strings are byte-identical to the
three-axis versions they replaced, so AU4/AU5/AU7 did not move. AU8 uses no `AuthCard` variant —
see §15. AU9 and AU10 share `review`, the one variant used by more than one screen, because their
two frames are byte-identical in card geometry — see §16.

AU9 and AU10 are also the only screens whose desktop padding is *smaller* than their tablet
padding (24 against 28) while the row gap moves the other way (32 against 28). That inversion is
why the variant carries `lg:` overrides in both directions rather than a monotonic ramp.

AU3's 18px mobile padding is the first value on the half-step spacing scale: `p-4.5` compiles to
`calc(var(--spacing) * 4.5)` = 18px against the repo's `--spacing: .25rem`. It is a real Tailwind
utility, not an arbitrary value, so it does not trip the token audit.

`AuthHeader`'s `align` gained a third value for the same reason: AU4 centres its header at 390 and
left-aligns from 768 up, while AU6 is `items-start` at every width. Those are `responsive` and
`start`; `responsive` is the default, so no existing call site changed.

## 8. Normalisations made to share one layout primitive

- **AU6 desktop page padding** is 64px; `AuthLayout` insets `py-20` (80px) at `lg`, matching AU4
  and AU7. The column is vertically centred at that width, so the value acts only as a minimum
  inset and the 16px never shows.
- **AU7 mobile page padding** is 16px in the design; AU5 and AU6 mobile are 20px. All three share
  `AuthLayout`'s `px-5 md:px-12` inset, costing AU7 4px at one width on an otherwise identical
  full-width card. Cheaper than a fourth padding key map.
- **AU7 content container** is 520px wide at 1440 while its card is 480px. The container is only
  wider so the single-line copyright can sit on one line; the copyright is `whitespace-nowrap` in
  the design. The column is built at the card width (440/480) with the copyright inside it, which
  is still one line at 12px.
- **AU9 and AU10's desktop container is wider than their card**, the same shape as AU7 but for the
  opposite reason and with the opposite resolution. The `text-header` is 560 wide at 1440 while the
  `status-card` is 480; here the extra 80px is load-bearing, because the 768 frame proves the title
  wraps to two lines the moment its container narrows to 520 (`108:4248` reports h=80 against
  `15:733`'s h=40 at the same font size). Clamping the column to the card width would have wrapped
  the desktop title. The column is therefore built at the header width
  (`xl` = `md:max-w-[520px] lg:max-w-[560px]`) and the card carries `lg:max-w-[480px] lg:self-center`
  — `AuthCard`'s base `w-full` resolves against the 560 column and is then clamped, so `self-center`
  centres a 480 box. At 768 both are 520 and the override is inert. Verified against the design by
  summation: the card's inner row width lands on 432 at 1440 (480 − 2×24) and 464 at 768
  (520 − 2×28), both exactly the row widths `page.xml` reports.
- **Mobile frames carry iOS chrome** — a `status-bar` reading "9:41" and a `home-indicator-bar`.
  Dropped, matching the Phase 3 precedent.
- **Mobile Google button** draws a 16px `circle-x` placeholder glyph; 1440 and 768 draw no glyph,
  and the file contains no Google brand asset. Omitted rather than substituted.
- **The sign-up flow's 390 frames carry a mobile header bar** — full-bleed white with a bottom
  border, the logo at x=16 and a 24×16 hamburger at x=350. AU1 (`101:4085`), AU2 (`101:4159`),
  AU3 (`101:4232`), AU8 (`101:4298`), AU9 (`101:4340`) and AU10 (`101:4394`) all have one; AU4,
  AU5, AU6 and AU7's 390 frames have none.
  (An earlier revision
  of this note said AU1 was the only auth mobile frame with a header bar. It was written before AU2's
  frames were read, and it was wrong — the bar is a property of the multi-step sign-up flow, not of
  AU1.) The hamburger has no designed destination anywhere in Phase 4 — no auth nav drawer frame
  exists — and at 390 the design places no logo in the column at all. Both are dropped, and the logo
  joins the step header block, centred, at every width, matching 768/1440 and the four auth screens
  already built. Cost: one extra logo row at 390. Same precedent as the dropped Google glyph and the
  iOS chrome — a control with no designed target is not invented.
- **AU1's page insets.** The design draws `px-16 py-20` at 390 and `px-48 pt-32` at 768;
  `AuthLayout` insets `px-5 md:px-12` and `py-10`. That is the documented 4px mobile delta again,
  plus 8px of extra top inset at 768. At 1440 the column is vertically centred, so `py-20` acts
  only as a minimum against the designed 64px and never shows. AU2's frames draw the same insets and
  take the same treatment.

## 9. Derived-state routing on AU7

The three email-verification states the brief requires are reached as follows:

| State | URL | Source |
| - | - | - |
| verified | `/verify-email` | the designed frame `135:4209` |
| pending | `/verify-email?status=pending` | derived |
| expired | `/verify-email?status=expired` | derived |

`useSearchParams` in a statically prerendered route **must** sit inside a `<Suspense>` boundary or
the production build fails
(`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md:181`).
Reading `searchParams` in the page instead would force dynamic rendering and lose the
all-routes-static property established in Phase 3.

The Suspense fallback is **the designed verified card**, not a skeleton. Consequence: the
prerendered HTML of `/verify-email` contains the designed state verbatim, so the common case has
no loading flash; only the two derived states, reached by an explicit query string, swap on
hydration.

The derived states reuse designed glyphs rather than new ones: AU9's hourglass (`warning`) and
AU10's alert-triangle (`error`), both exact Figma path exports. `StatusIcon`'s `warning` tone is
`text-warning-500` because that is the hourglass's designed stroke (`#c77e12`) exactly.

AU9 and AU10 draw those glyphs at a 28px leaf; AU7's badge leaf is 32px. AU7's states render at
32px, matching AU7's own designed badge. `StatusIcon` will need a size axis when AU9/AU10 are
built — their badge padding has not been measured yet and is deliberately not guessed here.

**Resolved.** AU9/AU10 were measured and the axis was added: `md` (`p-4 [&_svg]:size-6
md:p-4.5 md:[&_svg]:size-7`) with `lg` kept as the default so AU7 did not move — see §3. A third
size `sm` and a `shape` axis followed for the onboarding-complete screens — see §20. All four
additions are additive; no existing call site changed.

## 10. Corrections to `docs/screen-inventory.md`

That document is wrong on two counts, both corrected there:

- It describes `AuthLayout` as "centred card on the page background, no nav". Login is a **split
  two-panel** layout — a dark `brand-950` aside at `md`+ and the card on the right. `AuthLayout`
  supports both arrangements through one optional `aside` slot.
- It classifies TN1/LL1/AG1 as dashboard-shell screens. They have **no shell**. `15:165` is the
  first frame that instantiates `Sidebar / Tenant` (`82:163`), and it is out of Phase 4 scope.

## 11. Frame naming

The agent onboarding tablet frame is named `agent-welcome-tablet` (`109:7071`), not
`onboarding-welcome-agent-tablet` as the other two roles' frames would imply.

## 12. AU1's role picker

**At 1440 the icon chip is invisible on all three cards.** Every `icon-wrap` is filled with the
same colour as the card it sits on — `#0b7a8e` on the `#0b7a8e` selected card, `#f7f9fa` on the
`#f7f9fa` unselected cards. On the landlord card the exported `house.svg` also strokes `#0B7A8E`,
so the chip *and* its glyph disappear entirely; the frame's own screenshot shows a blank corner
where the icon should be. 768 draws a visible chip on the dark card but still strokes the glyph in
the chip's own colour.

The three glyphs are designed, exported assets, and the design-to-code contract forbids omitting
one. They are therefore built with a contrasting chip — `bg-brand-700` on the dark selected card,
`bg-neutral-50` on the white unselected cards — and the glyph inherits `text-white` or
`text-neutral-700` through `currentColor`. This is the 768 reading again, applied consistently.
The chip is 36×40 at 390 with a 20×24 glyph frame, an aspect distortion of a 24×24 square export;
it is built square.

**The landlord tag overflows its own card at 768.** The tag is a fixed-size instance that was
never resized per width: it measures 227×24 for landlord, 180×24 for tenant and 179×24 for agent
in **all three** frames, which also proves the tag copy is identical at every width — unlike the
descriptions, the tablet frame does not shorten it. At 1440 the card offers a 232px content box
and at 390 a 322px one, so 227 fits. At 768 the card is 214.67px wide with a 166.67px content box,
and the tag is drawn from x=24 to x=251 — 60px past the card's right edge and across the 16px
gutter into the tenant card, which begins at x=230.67. The design draws overlapping text.

Reproducing that would put unreadable text on screen at every viewport from 768 up to roughly
952px, where the cards finally grow wide enough to contain 227px. The tag is therefore allowed to
wrap from `md` up and its text centred; below `md` nothing changes, because 227px still fits the
244px content box even at 320. Copy, fill, text colour, size, radius and position are untouched —
the only thing dropped is the single-line assumption, which the design breaks itself.

Because `cn` is a plain join and not `tailwind-merge`, that override is resolved by CSS source
order rather than argument order, so it was verified in the compiled stylesheet rather than
assumed: `.whitespace-nowrap` is emitted at byte 23427 and `.md\:whitespace-normal` at 36923, both
at specificity 0-1-0, so the responsive rule wins inside its media block.

**The two `Ellipse` assets are control chrome, not icons.** They are plain circles encoding radio
*state* — `r=9.5 fill #F7F9FA stroke #DDE6E9` for idle, `r=9 fill+stroke #0B7A8E` for selected —
and an inline SVG cannot reflect `:checked`. They are built as a bordered CSS circle instead. The
geometry is preserved exactly: both render at 20px, with the idle disc carrying a 1px
`neutral-200` border on `neutral-50` and the selected disc a solid `brand-700`.

That disc is `brand-700` on `brand-950`, about 2.7:1, below the 3:1 minimum for non-text UI. It is
the drawn value, and selection is carried redundantly by the card fill inversion, the 2px border
and the native radio's own checked state, so it was kept rather than recoloured.

**Native radios, not `SegmentedControl`.** The cards share one `name`, sit in a `<fieldset>` with
a visually hidden `<legend>`, and each hides an `<input type="radio" class="sr-only">` inside its
`<label>`. That buys arrow-key navigation, a single tab stop, Enter submission and form
participation from the platform, with the focus ring hung on the label via
`has-[:focus-visible]:`. Reusing `SegmentedControl` would have meant a different control with a
different design and roughly twenty lines of hand-rolled key handling, so this is a second control
rather than a duplicated one.

**No designed hover state exists.** A border-colour hover was added to the unselected cards only,
matching `Button`'s existing hover convention, because the cards are the screen's primary control
and need a pointer affordance. Nothing else was animated.

**Primitive extensions this screen forced.** AU1 is the first auth screen whose logo is centred
and whose logo sits *inside* the header block — its logo→progress gap is 24 while the column gap
is 24/32/48, so the logo cannot use `AuthLayout`'s own slot. `AuthLayout` gained `logoSize="none"`
for that, a `gap="lg"` key for 24/32/48, and `justify="desktop"` for a column that is top-anchored
at 390 and 768 but vertically centred at 1440 — the existing `justify="top"` centres from 768 up,
which would have pushed AU1's tablet content down by roughly 157px. `AuthHeader` gained a
`display` variant for the 22/30 → 32/40 title; its wrapper and description classes are identical
to `compact`. `AuthLayout`'s `wide` width is confirmed by measurement at 900px — it was previously
a guess.

AU1's role order is **landlord, tenant, agent**, which is not `AUTH_ROLES`' tenant/landlord/agent
(login's designed order), so the two orders are kept as separate constants rather than reconciled.
Per-role CTA labels are stored as complete strings to avoid deriving the "a"/"an" article.

## 13. AU2's details screen

**AU2 draws four fields, not five.** `15:63`, `108:4059` and `101:4149` all place exactly four
`input-field` instances in the form card. The labels are not readable from `page.xml`, because an
`<instance>` node is not expanded — only its frame geometry survives. They were recovered from two
independent *expanded* designed sources rather than invented: the settings profile grid `6:192`
draws exactly "Full name", "Email Address", "Phone Number", "Password" as plain `<text>` nodes, and
AU11's privacy policy (`57:768`) lists "• Name, email, mobile phone, and secure account
credentials." AU2's 768 frame independently confirms the fourth field is the password, because it
carries the helper "Use 8+ characters with a mix of letters and numbers." as a sibling text node.
The four labels are normalised to the sentence case the built login screen already uses
("Email address", "Phone number"). The brief's confirm-password is the fifth field and is additive,
per §1.

**No placeholders are recoverable.** All four fields are instances, so no placeholder string exists
in the dump for any of them. None was invented, and AU2 therefore renders four fields with labels
and no placeholder text — unlike login, whose email placeholder *is* designed. Recorded rather than
reconciled.

**The password helper is drawn only at 768.** At 390 and 1440 the password `input-field` instance is
the same height as the other three, with no helper sibling; at 768 it is wrapped in a
`password-field-group` that adds a 16px helper 6px below the box. The helper is rendered at all
widths, because a validation constraint that disappears at two of three widths is a frame
inconsistency, not a responsive decision.

**The `input-field` instance is 72 / 67 / 72 px tall.** 390 and 1440 draw 72, 768 draws 67
(17 + 6 + 44). The DS Inputs showcase specimen measures 20 + 6 + 44 = 70, which is what `Input`
renders, so the built field is 2px shorter than two frames and 3px taller than the third. The
instance was never resized consistently; the DS specimen wins.

**The role pill is centred at 390 and 1440, space-between at 768.** At 390 the icon/label/Change run
is 243px centred in 358, and at 1440 it is 250px centred in 500, both with uniform 8px gaps. At 768
the same three parts sit inside a 20px inset with the label stretched to 385px and "Change" pushed
to the right edge. Centred wins 2:1 and is built at every width; the 768 reading is a fill-mode
difference on one text layer, not a second layout.

Its geometry is exact at all three widths: the pill is 33 / 40 / 36 tall, which is
`py-2 md:py-2.5 lg:py-2` over a row whose height is set by its tallest child — the 17px label at
390, the 20px "Change" at 768 and 1440. The icon is 16 / 18 / 16
(`size-4 md:size-4.5 lg:size-4`) and the gaps are 8 / 12 / 8 (`gap-2 md:gap-3 lg:gap-2`).

**The selected role is not carried between steps.** AU1's role choice is client state in a screen
with no persistence layer and placeholder handlers only, so AU2 renders `SIGNUP_DEFAULT_ROLE`
(landlord — AU1's own designed default and the role its 1440 frame draws selected), matching every
AU2 frame, which all read "Signing up as a Landlord". "Change" links back to `/signup`.

**The divider gap is 12 / 16 / 12.** `AuthDivider` defaults to `gap-3` — login's measured value at
its own widths — and AU2 passes `md:gap-4` for the tablet frame. The two classes sit at different
breakpoints, so there is no `cn` join conflict to resolve.

**The column has two widths at 768.** The header block spans 672 (a 48px inset) while the role pill
and the form card are 520 and centred. `AuthLayout` gained a `content` width that is full-bleed at
390 and 768 and 500px at 1440, and the pill and card carry `md:mx-auto md:max-w-[520px]`
themselves. At 1440 the 500px column caps them first, so the 520 never applies. A single column
width would have had to pick one of the two.

**Terms acceptance is a validated checkbox.** The design draws the sentence with "Terms of Service"
and "Privacy Policy" as link text; the brief requires a terms checkbox. `Checkbox`'s `label`
widened from `string` to `ReactNode` to carry the two `next/link`s — safe because the HTML spec
skips label activation when the click target is interactive content, so the links navigate without
toggling the box. The unchecked error message is derived (no error frame exists) and is wired with
`aria-invalid` and `aria-describedby` on the input plus `role="alert"` on the message, matching
`Input`'s pattern, since `Checkbox` has no `error` prop of its own.

`Checkbox` also gained `align`. At 390 the terms sentence is two lines (36px) and the design
top-aligns the 20px box against it; at 768 and 1440 the sentence is one 20px line, where start and
centre are identical. `align="start"` is therefore correct at every width, but it could not be
passed as a `containerClassName` override: `cn` is a plain join, and Tailwind emits `items-center`
after `items-start`, so the base class would have won. The two values are mutually exclusive in one
slot instead.

**Primitive extensions and de-duplication this screen forced.** `AuthLayout` gained the `content`
width and a `gap="xs"` key for 20/32/32. `AuthCard` gained `details`. Four pieces were extracted so
AU2 adds no duplicated markup: `SignupStepHeader` (logo + progress + display header — AU1's and
AU2's header blocks are geometrically identical, 114px at 390, 186px at 768, 182px at 1440, and AU3
is the same shape), `AuthDivider` (extracted from `login-form.tsx`), `PasswordField` (`Input` +
`PasswordStrengthMeter` in one 6px wrapper, extracted from `reset-password-form.tsx`) and
`ROLE_ICONS` (extracted from `signup-role-picker.tsx`, which now imports it). AU1's page, the login
form and the reset-password form were refactored onto them; the rendered markup did not change.

## 14. AU3's identity-verification screen

Frames: `15:118` (1440), `108:4126` (768), `101:4222` (390). Step 3 of 3, so the progress bar fills
all three segments. The screen is a checklist, not a form — it owns no inputs and no validation, and
it is the first auth route built entirely from Server Components.

**The privacy body is drawn three different ways.** 1440 reads "…Your documents are reviewed by our
team and never shown publicly."; 768 inserts one word — "reviewed **securely** by our team"; 390 is a
materially shorter sentence, dropping "on Vemra", "a deposit" and the review clause altogether.
Built from the 1440 string. It wins twice under §3's existing rule: 390 and 1440 both omit
"securely", two frames to one, and the long form beats the shortened one, the same resolution AU1's
tablet copy took.

**The row descriptions are shortened at 390 too** — "Drivers license or passport" versus "Drivers
license or passport matched to your legal name", "A property title deed" versus "A property title
deed or mortgage statement for each listing", "Where rent is sent" versus "Where rent is sent once
it clears and you withdraw". Same rule, long copy at every width. The consequence is measurable and
accepted: each row wraps to two description lines at 390 instead of one, growing rows from the
designed 40px to 56px and the card from 220px to roughly 270px. The alternative — a second copy
field keyed to viewport — would put the same sentence in the constants file twice and hide content
from small screens, which the brief's own responsiveness gate does not ask for.

**The "Connect" control has no size on the `Button` scale.** 390 and 1440 draw a 74×28 chip with a
50×16 label; 768 draws a real `Button` **instance** at 108×44. Nothing matches: `Button` is
40/44/48. Built `size="sm"` (40px) rather than the 2:1 majority. 44px would be taller than the
entire 40px mobile row it sits in, whereas 40px fills that row exactly and still centres inside the
64px rows at 768 and 1440. The width grows from the designed 74px to 90px (`px-5` around a 50px
label); the row text is `min-w-0 flex-1`, so it absorbs the 16px and nothing overflows — verified
down to a 320px viewport, where the row still sums to exactly the available 280px.

**"Uploaded" is not a `Badge`.** The plan assumed the status pills on AU3/AU9/AU10 were `Badge`
instances at `size="md"`. On AU3 they are not: `15:140` and `15:147` are plain `<text>` nodes, 66×20,
right-aligned to the row edge, with no surrounding frame. A `Badge` would add a pill the design does
not draw, so it is built as styled text. AU9 and AU10 are re-checked separately rather than
inheriting this reading.

**The primary CTA is drawn disabled.** 390 and 1440 name the node `btn-disabled`; 768 draws a plain
`Button` instance whose state is not recoverable. Built `disabled`, two frames to one, which is also
the only state coherent with the screen it sits on — step 3 of the checklist is still pending. The
screen therefore has exactly one live control, the placeholder "Connect".

**Geometry, all verified by summation.** Column gaps are uniform 24 / 32 / 32, which no existing
`AuthLayoutGap` key covered (`xs` is 20/32/32, `lg` is 24/32/48) — added as `flat`. The desktop cap
is 520px, not the 500px AU2 uses, so `AuthLayoutWidth` gained `contentLg`; 768 repeats AU2's
two-width shape, a 672px header stack over a 520px column centred at x=124. Checklist card padding is
18 / 32 / 28 with a uniform 16 / 24 / 24 gap between every row and separator. Rows are 40 / 64 / 64
tall with a 24px leading glyph, 12 / 16 / 16 either side of the text block, and a 4px title-to-
description gap; the description line box is 16px at 390 and 20px above it. The privacy note is
16 / 20 / 20 padding around a 20px lock, 12 / 16 / 16 to a text block whose body is 18px-leaded at
390 and 20px above. `SignupStepHeader` needed no change — AU3's header block is 134 / 208 / 204,
which is what the component already renders.

**Primitive extensions this screen forced.** `AuthLayout` gained `width="contentLg"` and
`gap="flat"`; `AuthCard` gained `checklist`. Three pieces were added: `StatusRow` (the shared
leading-glyph / title+description / trailing-slot row the plan reserved for AU3, AU9 and AU10),
`AuthNote` (the lock-and-copy information panel) and `VerificationChecklist` (the `<ol>` that pairs
them with the separators). `LockIcon` was added to the icon set. One unrelated fix: `ButtonProps`
had a stray leading space on `isLoading`, corrected.

**Markup note.** The checklist is an `<ol>` because the pending row is numbered, and each `<li>`
carries its own separator as a leading `<span aria-hidden>` — a bare `<span>` between `<li>`s is not
valid list content. The `<ol>` gap and the `<li>` gap are both `gap-4 md:gap-6`, which reproduces the
designed row / separator / row rhythm exactly.

## 15. AU8's two-factor setup screen

The two-factor screen is the only auth screen whose card exists at some widths but not others.
Frames `15:688` (1440), `108:4186` (768) and `101:4288` (390):

- **The 390 frame has no `auth-card` node.** Its header, `qr-holder`, `otp-section`, button and
  closing note are direct children of `scrollable-content` at x=16 — full-bleed on the page
  background. Both wider frames wrap the same five blocks in a centred `auth-card` with 40px padding
  all round. `AuthCard` cannot express "no card below `md`": its base string hardcodes `border` and
  `bg-white`, and because `cn` is a plain join (not tailwind-merge) a later `md:`-prefixed override
  cannot reliably win against an unprefixed base in the same slot — the same limitation that drove
  `Checkbox`'s `align` prop. So AU8's form owns its own responsive container:
  `md:rounded-lg md:border md:border-neutral-200 md:bg-white md:p-10 md:shadow-elevation-2 lg:shadow-elevation-3`.
  The card chrome simply switches on at `md`, matching the frames exactly, and no `AuthCard`
  variant was added for a one-off shape.
- **The card width is non-monotonic** — 500 at 768, 480 at 1440, both centred — so `AuthLayout`
  gained an `otp` width key `md:max-w-[500px] lg:max-w-[480px]` rather than snapping both to one
  value. (Recorded also in §3.)
- **Section gaps are 20 / 32 / 28** (`gap-5 md:gap-8 lg:gap-7`), uniform between every block at
  each width. Card padding is 40 at both card widths (`md:p-10`).
- **The logo is centred over the card**, not left-aligned as `AuthLayout` renders its own slot. So
  the page passes `logoSize="none"` and renders `<LogoMark className="self-center" />` as the
  column's first child. The 32px logo→card gap and the 20px mobile gap both come from
  `GAP_CLASSES.xs`.
- **Only the QR box and the manual-entry block are provably centred** — their x-offsets inside the
  400/420/358-wide content column prove it (`qr-box` at x=120/130/109; `manual-entry` text at
  x≈139/149/127). The header, OTP row, button and note are full-width, so their text alignment is
  not recoverable from geometry. They are built left-aligned, matching every other auth card header;
  the QR and manual code sit in their own centred sub-block.
- **The submit button label is unrecoverable** — the control is `<symbol id="135:4274">` at 1440
  and an `<instance>` at 768/390, and `page.xml` does not expand either. Inferred "Verify and
  continue" (recorded in §19). It is drawn at full width, 44px tall, at every frame.
- **The QR code has no asset.** `qr-code` (1440/390) and `Icon` (768) are empty frames inside the
  160/160/140px `qr-box`, with a ~20px inset. The file contains no QR image and no plugin data, so a
  real QR cannot be extracted. `QrPlaceholder` draws a deterministic decorative matrix (seeded LCG,
  fixed at build time so server and client markup match) with three finder squares — visually a QR,
  functionally inert. The real affordance is the manual code beneath it, which *is* designed text.
- **The OTP row is six single-character boxes**, gap 6/8/8, height 48/54/54, each box filling an
  equal share of the row (their widths sum exactly to the row width, so `flex-1` is correct). Built
  as the new `OtpInput` primitive: one accessible group label, per-box `aria-label="Digit n of 6"`,
  arrow-key/backspace/paste handling, `inputMode="numeric"` and `autoComplete="one-time-code"` on
  the first box only.
- **No 2FA success or verify-result frame exists.** Per the brief (client-side validation only, no
  auth requests), the submit handler is a placeholder; the only validation is "Enter all 6 digits to
  continue." when fewer than six are entered.

No duplicated markup: `AuthHeader` (compact), `Button`, `LogoMark` and the new `OtpInput` /
`QrPlaceholder` primitives compose the screen. `OtpInput` is a general `src/components/ui/`
primitive, not an auth-only piece, per the plan.

## 16. AU9 and AU10's verification review screens

These are the only two screens in Phase 4 that are structurally the same design. Laid side by side,
`verification-pending` (`15:723` / `108:4231` / `101:4339`) and `verification-rejected`
(`15:755` / `108:4272` / `101:4384`) agree on every measurement: centred logo, status badge,
centred header, bordered status card, CTA. They differ only in tone, copy, row count and whether a
timestamp sits above the CTA. Building them as two page files over one `VerificationStatus` shell
was therefore the only reading consistent with "do not duplicate components" — a second copy of the
markup would have been a transcription of the first.

- **The card geometry is identical across both screens and all six frames**: padding 18 / 28 / 24
  and row gap 28 / 28 / 32 (390 / 768 / 1440). Verified by summation against the drawn card
  heights: AU9's 1440 card is 184 = 24 + 24 + 32 + 24 + 32 + 24 + 24; its 768 card is
  181 = 28 + 23 + 28 + 23 + 28 + 23 + 28; its 390 card is 164 = 18 + 24 + 28 + 24 + 28 + 24 + 18.
  AU10's 176 / 178 / 156 resolve the same way with its taller second row. This is the one
  `AuthCard` variant (`review`) shared by more than one screen — see §7.
- **The rows carry no separators.** AU3's checklist draws a divider node between items; AU9 and
  AU10 draw none at any width — the `step-row` frames are siblings with plain gaps between them.
  The `<span className="h-px bg-neutral-200" />` rule from AU3 was deliberately *not* carried over.
  (Rows 1 and 2 report a frame height of 40 at 1440 against 24px of content; that 16px is frame
  slack with no child in it, not an undrawn divider. Row 3, the last, reports exactly 24.)
- **AU10's rejection reason is a full-width line under the row, not a second column.** `15:778`
  spans the entire 432px row width beneath the label-and-pill line, offset 8px. `StatusRow`'s
  existing `description` slot sits *beside* the trailing element in the middle column, which is the
  wrong shape, so `StatusRow` gained a separate `detail` slot rendered below the flex row. The
  component was restructured into an outer column to host it; its sole existing caller
  (`VerificationChecklist`) passes neither `detail` nor `className`, and with one child the new
  wrapper's gap is inert, so AU3 renders byte-identically.
- **The column gaps are not uniform, so the icon and header are one block.** Measured boundaries
  are logo→icon 40 (1440) / 32 (768), icon→header 24 / 24 / 20, header→card 32 / 32 / 20 and
  card→footer 32 / 32 / 20. `AuthLayout gap="xs"` supplies 20/32/32 for the outer boundaries, and
  the icon and header are wrapped in their own `gap-5 md:gap-6` block to hit the 24 that the column
  gap would otherwise overshoot by 8. The remaining mismatch is logo→icon at 1440 only: 32 against
  a drawn 40.
- **The footer gap runs the other way.** AU9's timestamp sits 20px above the CTA at 390 but 16px at
  768 and 1440 — the only boundary in either screen where mobile is *larger*. Built as
  `gap-5 md:gap-4`. AU10 has no timestamp, so its footer is the CTA alone.
- **Only the mobile frames centre nothing.** Every block's x-offset resolves to the frame centre at
  1440 and 768 (logo 670.5 + 99/2 = 720; icon 688 + 32 = 720; header 440 + 280 = 720; card
  480 + 240 = 720; timestamp 642.5 + 77.5 = 720; CTA 633 + 87 = 720), and the 390 frames are
  full-bleed within a 16px inset. The header and the footer are built `items-center`; the card rows
  are left-aligned with right-aligned pills, matching the drawn row geometry (every pill's right
  edge lands exactly on the row's right edge at every width).
- **Both CTA labels are unrecoverable**, the same `<instance>`/`<symbol>` limitation as AU8.
  Inferred from the hug widths at 1440 — 174px for AU9 and 191px for AU10, less `Button size="md"`'s
  48px of horizontal padding, leaving ~126px and ~143px of label. Recorded in §19 with the
  reasoning; neither is presented as measured.
- **Neither screen's pill colours are measurable.** The status-icon tones are semi-recoverable —
  Figma names the frames `status-icon-amber` (AU9, `108:4244`) and `status-icon-red` (AU10,
  `108:4285`), which map to `StatusIcon tone="warning"` and `tone="error"`. The pill fills have no
  such hint and are inferred from their own copy: Received and Approved as `success`, In review as
  `warning` (agreeing with AU9's amber badge), Needs update as `danger` (agreeing with AU10's red).
  All four are recorded in §19.
- **The card has no designed accessible name.** It is a list of document states with no visible
  heading, so it is built as a `<ul>` with `aria-label="Document review status"` and one `<li>` per
  row. The label is added copy, recorded in §19; without it the list announces as an unlabelled
  group.
- **Neither CTA has a designed destination.** Both are built as `next/link` rather than a
  placeholder `onClick`, because both have an obvious existing route and a real link is a better
  placeholder than a dead handler: AU9 → `/browse` (the only route reachable while documents are in
  review), AU10 → `/signup/verification`, which is the upload step its own copy tells the user to
  return to ("Update it and we will take another look"). Both destinations are recorded in §19.
  Neither page is a client component — there is no interaction on either screen beyond navigation,
  so both stay Server Components and both prerender static.

No duplicated markup: `AuthLayout`, `AuthCard`, `AuthHeader`, `StatusIcon`, `StatusRow`, `Badge`,
`LogoMark` and `buttonClasses` compose both screens through a single `VerificationStatus` shell.
The only new file in `src/features/auth/` is that shell; the three primitives it needed
(`StatusIcon`'s size axis, `StatusRow`'s `detail` slot, `AuthCard`'s `review` variant) were
extended in place rather than forked, and none of their existing call sites changed.

## 18. AU11's legal pages

The first phase-4 screens outside the `(auth)` group. `/terms` and `/privacy` share one document
shell and one header/footer pair, so AU11 is really two page files over `LegalDocument`, with all
copy in `src/constants/legal.ts`.

- **The desktop and mobile frames draw one document containing both documents.** `legal-body`
  (`57:736` at 1440, mirrored at 390) runs Terms title-block → intro → sections 1–5 → a `divider`
  → `privacy-section-header` → privacy sections 1–3 → the contact block, all inside one frame. Read
  alone, that says the two policies are one page.
- **The tablet frame (`109:3677`) contradicts them, and it is the one to believe.** It renders a
  *complete, coherent page* containing only Terms — title, intro, sections 1–3, then the divider,
  then the contact block, then the footer — with no Privacy document anywhere in the frame. That is
  a one-document page shape, i.e. the "Terms of Service tab selected" state of the two-segment
  control the frame draws above it. Four things corroborate the reading:
  - `privacy-section-header` carries its **own** "Last updated August 1, 2026" line. A section
    heading inside a bigger document would not repeat the document's date; a document title would.
  - The divider's role flips between frames — before the contact block at tablet, between the two
    documents at desktop and mobile — so it is a generic separator, not a document boundary.
  - The desktop divider is a `<frame name="divider">` (720×1) while tablet and mobile use
    `<line name="Line">`. Inconsistent tooling is what an artboard seam looks like.
  - The tablet frame **truncates copy**: "…during registration." for "…during registration and keep
    account details up to date at all times.", and "…withdraw funds into verified accounts." for
    "…into a verified payout account once the clearing timeline has elapsed." Desktop and mobile
    agree on the full strings, so tablet is an abbreviated mock, not a copy spec.
  Built as **two real routes over one `LegalDocument`**, tabs as `next/link`, divider before the
  contact block (the tablet model). Both marketing-footer links (`/terms`, `/privacy` in
  `FOOTER_LINKS`) already pointed at two destinations, so this is also the only reading that leaves
  the existing site navigation working. Full copy is used at every width.
- **The plan's "640px prose" is wrong — the desktop column is 720.** `57:736` is 720 wide at x=360
  in a 1440 frame; 640 is the tablet width and 358 the mobile, and both of those are simply the full
  content width at their breakpoint, not a separate measure. The 720 emerges from
  `px-4 md:px-16` (16 / 64) plus a centred `max-w-[720px]` column: at 1440 the gutter leaves 1312
  and centres the column at 64 + (1312 − 720)/2 = **360, exactly as drawn**.
- **The footer is 84px tall on desktop, not 102.** The plan's 102 is right for tablet and mobile
  (`py-6` 24 + links 20 + `gap-4` 16 + copyright 18 + 24 = 102). Desktop drops to `py-8`,
  `gap-8` and single-line copy: 32 + 20 + 32 = **84**.
- **The `legal-body` gap is uniform per width, and mobile inverts above tablet.** 40px desktop, 24
  tablet, 28 mobile → `gap-7 md:gap-6 lg:gap-10`. Verified by walking every child of all three
  frames (each child's `y + height` against the next child's `y`) and landing exactly on the drawn
  frame height in every case. The 28 > 24 inversion is the same pattern §8 already records for the
  AU9/AU10 and AU11 padding scales.
- **The section-heading colour and weight resolve by elimination.** Desktop section headings
  measure a 22px font in a 30px line box (ratio 1.364) and the document title 32px in 44px
  (1.375) — the same ratio, which is what fixes the title at `heading-lg`→`heading-xl` rather than
  some larger display size. Body copy is **14px, not 16**: Terms section 5 is 194 characters in a
  720px column and renders two lines (section height 86 = heading 30 + gap 12 + body 44). At 14px
  Inter the prediction is 1.89 lines → 2 ✓; at 16px it is 2.16 → 3 ✗.
- **The 4px top offset on tablet and mobile bullet lists is dropped.** `li` boxes sit 4px below the
  preceding body line's baseline in those two frames and flush at desktop; reproducing it would
  mean a per-width margin with no design rationale, so the list is built flush.
- **Footer links measure ~13px at desktop against ~14px at tablet and mobile** — a 1px inversion
  the other way. Normalised to `text-body-md` (14px) at every width; 13px is `body-sm`, which no
  other footer link in the repo uses.
- **Tabs are links, not a JS tablist.** The control is visually identical to AU4's `SegmentedControl`
  track, but it navigates between two URLs. Rendering it as `role="tablist"` would promise
  in-page panel switching that does not exist and would break without JS, so it is a `<nav>`
  of `<a>`s with `aria-current="page"` on the active one — which is also what makes both pages
  prerender static.
- **The 306px hug on the title is ~7% wider than a 32px prediction.** Recorded rather than
  explained; the title is built at `text-heading-lg leading-[36px] lg:text-heading-xl
  lg:leading-[44px]` on the strength of the line-height-ratio argument above.
- **The contact surface, borders and chrome are inferred.** `page.xml` carries no fills, so
  `bg-brand-50` for the contact block, `border-neutral-200` for the header and footer edges,
  `bg-white` for the header and `bg-neutral-50` for the footer all come from tokens the rest of the
  repo already pairs for those roles — see §19.
- **The extra 24px of top padding above `privacy-section-header` at desktop disappears** when the
  documents split into two pages; it existed only to separate the two documents inside one body.
  The privacy page therefore opens with the same `pt-5 md:pt-8 lg:pt-16` as the terms page.

Reuse rather than duplication: `LogoMark` matched the drawn logo at all three widths unchanged,
`HEADER_GUTTER` matched the drawn header *and* footer gutters exactly (16 / 32 / 80 → 16 / 32 / 80),
and the tab control reuses AU4's track and segment styling through newly extracted
`segmentedTrackClasses` / `segmentedSegmentClasses`. Those two helpers needed a `size` axis: AU4's
track (`57:362`) has contiguous 124px segments (x = 4, 128, 252) → `p-1` with no gap and `md:`
stepping the label to 14px/20 for a 44px rail; AU11's has a 4px gap (x = 4, 202; width 194;
4 + 194 + 4 + 194 ≈ 392 inner + gap) → `gap-1 p-1`, a 40px rail below `lg` stepping to 48 at `lg`
via `py-2.5` + 20px leading (10 + 20 + 10 = 40 segment + 8 track padding = 48 ✓). AU4's rendered
output is unchanged, verified against the prerendered `/login` markup after the refactor.

The helpers live in `src/components/ui/segmented-control-classes.ts`, a plain module, because
`segmented-control.tsx` carries `"use client"` and **exports of a client module become client
references that a Server Component cannot call** — only render or pass. AU11's tabs are server-
rendered, so calling them from `segmented-control.tsx` failed the build with
`Attempted to call segmentedTrackClasses() from the server`. This is the same reason
`buttonClasses` is callable from servers: `button.tsx` has no `"use client"`. Any future shared
class helper consumed by both a client control and a server caller belongs in its own plain module.

## 19. Values inferred while the Figma MCP tools were unavailable (AU1–AU11 only)

**Scope.** This section covers AU1–AU11, which were built while the Figma MCP tools were not
exposed. It does **not** apply to TN1/LL1/AG1: by the time those were built the tools were
available, so every value in §20 is measured from `get_design_context` rather than inferred. The
table below is a record of what had to be reconstructed, not a standing limitation of the phase.

The plan anticipated this: `mcp__figma__get_design_context` is not exposed in the implementation
session. `ListMcpResourcesTool` confirms the `figma` server is connected but publishes resources
(docs and skills) and no tools, so `get_design_context` returns "No such tool available" rather
than a classifier refusal. All design context therefore comes from `.figma-refs/page.xml` plus the
DS doc frames.

`page.xml` turned out to be far more useful than the plan assumed. Figma auto-names text layers
after their own content, so `<text name="Continue to verification" x=… width=… height=…/>` yields
exact copy *and* exact geometry. Two things it cannot supply:

- **Fills, strokes, radii and effects.** No node carries them.
- **Anything inside an `<instance>` or `<symbol>`.** Those are not expanded, so a component
  instance's internal text — input labels, placeholders, badge copy — is absent. Only the
  instance's own frame box survives.

Every value below is therefore inferred from an existing token or an already-measured sibling, and
is listed here rather than presented as measured:

| Value | Screen | Inferred as | Basis |
| - | - | - | - |
| Form card shadow | AU2 | `shadow-elevation-2 md:shadow-elevation-3` | the four measured auth cards all use this pair |
| Role pill fill | AU2 | `bg-neutral-50` | the lightest surface token; the pill is a passive bar on white |
| Role pill radius | AU2 | `rounded-md` | it is a full-width bar, not a capsule; `rounded-md` is the DS surface radius |
| Role pill label colour | AU2 | `text-neutral-800` | matches `Checkbox`'s label tone on the same card |
| Input placeholders | AU2 | omitted | not recoverable, not invented |
| Strength meter fills | AU6, AU2 | `neutral-100` / `error-600` / `warning-500` / `success-600` | semantic tones the token layer already publishes |
| Strength hint copy (3 of 4) | AU6, AU2 | written to the specimen's template | only "Include symbols for Strong" is designed |
| Checklist card shadow | AU3 | `shadow-elevation-2 md:shadow-elevation-3` | same pair as every other measured auth card |
| Row separator colour | AU3 | `bg-neutral-200` | the border token `AuthCard` already uses for its own edge |
| "Uploaded" status colour | AU3 | `text-success-600` | it labels the two rows whose leading glyph is a check; the pending row has none |
| "Uploaded" status weight | AU3 | `font-semibold` | 66px for eight characters at 14px Inter fits semibold, not regular |
| Pending-badge fill/stroke | AU3 | `border border-neutral-400 text-neutral-700` | an outline circle pairs with the outline check glyph it replaces in the same slot |
| Connect button variant | AU3 | `variant="secondary"` | the same resolution §2 already made for login's Google CTA — one primary per screen |
| Privacy-note surface | AU3 | `rounded-lg bg-brand-50` | `brand-50` is the established informational tint (`Badge variant="info"`, active `NavItem`, `Table` selected row) |
| Privacy-note icon colour | AU3 | `text-brand-700` | the foreground half of that same `bg-brand-50 / text-brand-700` pair |
| Lock glyph | AU3 | drawn to the icon-set convention | the frame is an empty 20×20 `lock` box; no path data is in `page.xml` |
| Submit button label | AU8 | "Verify and continue" | the control is `<symbol id="135:4274">` at 1440 and an `<instance>` at 768/390, so its text is unrecoverable; wording follows AU2's "Continue to verification" and AU7's "Continue to verification" |
| Two-factor card shadow | AU8 | `md:shadow-elevation-2 lg:shadow-elevation-3` | same pair as every other measured auth card, gated to the widths that draw a card |
| OTP box fill and border | AU8 | `border-neutral-200 bg-white` | matches `Input`'s resting box on the same card |
| OTP box focus ring | AU8 | `focus:border-brand-700 focus:outline-1 focus:outline-brand-700` | copied from `Input`'s `focus-within` treatment so the two field types focus identically |
| OTP box error border | AU8 | `border-error-600` | `Input`'s error border token; no error frame is drawn |
| QR box fill and border | AU8 | `rounded-md border border-neutral-200 bg-white` | the `qr-box` frame is empty; these are the surface tokens `Input` and `AuthCard` already pair |
| QR module artwork | AU8 | decorative placeholder | see §15 — the file contains no QR asset and `qr-code`/`Icon` are empty frames |
| Manual-code weight | AU8 | `font-semibold` | 157px for 19 characters at 14px Inter fits semibold; the prompt line above it is 122px for 18 characters at regular |
| CTA label | AU9 | "Browse properties" | `<instance id="135:4275">` at every width, so the text is unrecoverable. The 1440 button hugs at 174px; less `size="md"`'s 48px of padding that leaves ~126px of label, which "Browse properties" fits at 14px Inter Semi Bold. `/browse` is also the only route reachable while documents are under review |
| CTA label | AU10 | "Re-upload document" | same limitation; the 1440 button hugs at 191px, leaving ~143px of label. The screen's own copy — "Update it and we will take another look" — names the action, and `/signup/verification` is the upload step it returns to |
| CTA destination | AU9, AU10 | `/browse`, `/signup/verification` | no frame carries a link target; both are existing routes chosen over a dead placeholder handler — see §16 |
| Status-card fill, border and shadow | AU9, AU10 | `rounded-lg border border-neutral-200 bg-white shadow-elevation-2 md:shadow-elevation-3` | `AuthCard`'s base surface plus the shadow pair every other measured auth card uses |
| "Received" / "Approved" pill tone | AU9, AU10 | `Badge variant="success"` | both label a step the review has cleared; no fill is recoverable from `page.xml` |
| "In review" pill tone | AU9 | `Badge variant="warning"` | the step still in progress, agreeing with the frame Figma names `status-icon-amber` on the same screen |
| "Needs update" pill tone | AU10 | `Badge variant="danger"` | the step that failed, agreeing with the frame Figma names `status-icon-red` on the same screen |
| Status-icon tones | AU9, AU10 | `tone="warning"`, `tone="error"` | semi-recoverable: the tablet frames are named `status-icon-amber` and `status-icon-red`, but the fills themselves are absent |
| Status-card accessible name | AU9, AU10 | `aria-label="Document review status"` | added copy — the card is an unheaded list of document states, and without a name the `<ul>` announces as an unlabelled group |
| Rejection-reason type | AU10 | `text-body-sm leading-[18px] md:text-body-md md:leading-[20px]` | the drawn line boxes are 40px over two lines at 1440/768 and 36px over two at 390; the colour follows `StatusRow`'s existing secondary copy |
| Header surface and edge | AU11 | `sticky border-b border-neutral-200 bg-white` | the layer is named `sticky-header` but `page.xml` carries no fill or stroke; the pair is the repo's established header treatment (`SiteHeader`) |
| Footer surface and edge | AU11 | `border-t border-neutral-200 bg-neutral-50` | same limitation; `SiteFooter` pairs these two for the same role |
| Contact-block surface | AU11 | `rounded-lg bg-brand-50` | `brand-50` is the established informational tint (`Badge variant="info"`, active `NavItem`, `Table` selected row, AU3's privacy note) |
| Contact-block icon colour | AU11 | `text-brand-700` | the foreground half of the same `bg-brand-50 / text-brand-700` pair |
| Contact-block icon | AU11 | `InfoIcon`, drawn to the icon-set convention | `page.xml` names the frame but has no path data; a circled "i" matches the drawn 20×20 box |
| Divider colour | AU11 | `bg-neutral-200` | the border token `AuthCard` and the header/footer edges already use |
| Back-link destination | AU11 | `/browse` | no frame carries a link target; `/browse` is the listing surface the label "Back to listings" names |
| Contact-block destination | AU11 | `/help` | added copy — the label says "Contact us about this policy" and no support route is designed; `/help` is the same route `FOOTER_LINKS` uses for "Support" |
| Footer "Support" link | AU11 | `/help` | `FOOTER_LINKS` in `constants/marketing.ts` already resolves the same label to `/help` |
| Copyright string | AU11 | "© 2026 Vemra Technologies. All rights reserved." | transcribed from the frame, but **differs from `COPYRIGHT` in `constants/marketing.ts`** ("© 2026 Vemra. All rights reserved."); the legal pages therefore carry their own `LEGAL_COPYRIGHT` rather than reusing it — see §18 |
| Tab control element | AU11 | `<nav>` of `<a>` with `aria-current="page"` | the drawn control is visually AU4's `SegmentedControl` track, but it navigates between two URLs; a `role="tablist"` would promise in-page switching that does not exist and break without JS — see §18 |
| Tablet copy truncation | AU11 | full strings at all widths | `109:3677` abbreviates sections 1–2 and omits sections 4–5 and the whole Privacy document; desktop and mobile agree on the full strings, so tablet is a mock, not a copy spec — see §18 |
| Title type size | AU11 | `text-heading-lg leading-[36px] lg:text-heading-xl lg:leading-[44px]` | inferred from the line-height ratio (title 32/44 = 1.375 against section headings 22/30 = 1.364); the 306px hug measures ~7% wider than a 32px prediction — see §18 |
| Footer link size at desktop | AU11 | `text-body-md` (14px) at every width | measures ~13px at desktop against ~14px at tablet/mobile; 13px is `body-sm`, which no other footer link in the repo uses — see §18 |

## 20. TN1, LL1 and AG1 — the onboarding-complete screens

The last three screens of phase 4, and the first for which **`get_design_context` was available**.
Everything below is therefore *measured*, not inferred — §19's limitation does not apply to this
section. Fills, radii and strokes come back as `var(--token, #hex)`, so the token mapping is
authoritative rather than reconstructed from `page.xml` geometry.

All three frames are structurally identical — logo → success badge → title + description → three
numbered step cards → full-width CTA — and differ only in copy. One `OnboardingComplete` component
driven by `ONBOARDING_COMPLETE[role]` covers all three, behind a single `/welcome/[role]` route
with `generateStaticParams` over `tenant | landlord | agent` and `dynamicParams = false`.
`next build` prerenders all three as `●` SSG.

### The tablet tier is non-monotonic and was not built

The 768 frames inflate **every** dimension above the 1440 frames, which would render a 768 viewport
larger than a 1440 one:

| Element | 390 | 768 | 1440 | Built |
| - | - | - | - | - |
| Success badge | 64 | **72** | 64 | 64 at every width |
| Logo | 28 | **40** | 32 | `h-7 md:h-8` (mobile 28, desktop 32) |
| Container gap | 24 | **40** | 32 | `gap-6 md:gap-8` |
| Step-card padding | 16 | **20** | 18 | `p-4 md:p-4.5` |
| Step-number circle | 32 | **36** | 32 | `size-8` |
| Body copy | 14/22 | **16/24** | 14/22 | 14/22 at every width |
| Container width | 358 | **670** | 602 | `md:max-w-[560px]` |

Two tiers were built instead — mobile below `md`, desktop at `md`+ — taking the 390 and 1440
readings, which agree with each other on the direction of every one of those scales. This is the
same treatment §3 already applies to AU1's logo and AU8's card width, and the deltas above are the
record of what was dropped.

**The tenant tablet copy was rejected on the same grounds.** 768 draws longer step details than
either 390 or 1440. Two frames to one, matching the AU1 and AU8 copy resolutions in §3.

Where **desktop and mobile themselves disagree** — landlord step 2, tenant step 3, and tenant's
step 1 and 2 titles — the longer desktop form wins, because the shorter form loses information.

### The badge is a squircle here and a circle on AU7, by design

`get_design_context` on AU7 (`135:4209`) returns an arbitrary radius of `var(--radius/full, 9999px)`
— i.e. a true circle; the welcome
frames return `radius/xl` (16px). Both are authoritative, so this is a real difference, not a slip
in either frame. `StatusIcon` therefore gained an **additive** `shape` axis (`circle | squircle`,
defaulting to `circle`) and an `sm` size, leaving all four existing call sites — AU7, AU9, AU10 and
`verify-email-panel` — rendering exactly as before.

`rounded-full` had to move out of `StatusIcon`'s base string into the new `SHAPE_CLASSES` map:
`cn` is a plain join, not `tailwind-merge`, so two unprefixed utilities setting `border-radius`
would resolve by stylesheet order rather than argument order, and the base would always win.

`sm` is `p-5.5 [&_svg]:size-5` — 22 + 20 + 22 = **64px**, matching the drawn badge and its 20px
glyph exactly.

### The check glyph is the existing icon, scaled

The welcome frames draw a 20×20 check path; `src/components/icons/check-icon.tsx` is 14×14. The
two are the same path at a 10/7 ratio, verified point by point: 11.6662 × 10/7 = 16.666,
3.5 × 10/7 = 5, 5.25017 × 10/7 = 7.5002, 9.9162 × 10/7 = 14.166, 2.3338 × 10/7 = 3.334,
6.99975 × 10/7 = 9.9996. No new asset was added — the existing `CheckIcon` is reused at `size-5`.

### Three off-token greens, two snapped and one reported

| Figma value | Where | Token used | Delta |
| - | - | - | - |
| `#edf8f5` | badge outer fill, step-number circle fill | `success-50 #e8f5ee` | nearest (−5 / −3 / −7), comparable to the accepted `#edf2f4`→`neutral-100` in §4 |
| `#1E9E6A` | check stroke | `success-600 #0f7b54` | nearest — the same mapping §4 already records for `#198754` |
| `#bce3df` | the 44px **inner** badge layer | **none** | no token in reach — reported, not retrofitted |

`#bce3df` sits between `success-50` (far lighter) and `success-600` (far darker), and the token
layer publishes no `success-100` or `success-200`. The numerically nearest token is
`neutral-200 #dde6e9`, a grey-blue **border** colour that is semantically wrong for a success
badge. This follows the `#2ec4b6` precedent in §4: reported rather than approximated.

**Consequence, stated plainly:** the badge renders single-tone — `bg-success-50` with a
`text-success-600` glyph — and loses the subtle two-tone ring the design draws. That is the same
resolution AU7's own badge already received in §3, so the two screens stay consistent with each
other. Adding the ring would require a new token, which this phase may not do.

### Everything else

- **Device chrome dropped.** The mobile frames are full iOS mockups — a status bar reading "9:41",
  a hamburger header, a tab bar and a home indicator. No other auth screen carries them, they are
  not product UI, and reproducing a hard-coded clock would be inventing interface. Same treatment
  as the marketing precedent and §2. The **logo is kept** and centred at all tiers, matching
  `AuthLayout`'s default and AU7.
- **The agent CTA has no destination in this phase.** The frame reads "Go to your dashboard", but
  no dashboard route exists — `DashboardLayout` is phase 5+. Tenant and landlord resolve exactly
  (`/browse`, `/list-your-property`); agent is pointed at `/` as an honest placeholder rather than
  inventing a `/dashboard` route that would 404. **This is the one link on these three screens that
  does not go where its label says**, and it should be repointed when the agent dashboard lands.
- **Mobile vertical padding is 40px against the designed 20.** `AuthLayout`'s shared
  `px-5 py-10 md:px-12 lg:py-20` is used unchanged; forking it per screen would break the
  convention every other auth screen follows, for a 20px gain.
- **The logo gap is 8px against the designed 10.** `LogoMark`'s existing `gap-2`, identical to the
  AU7 delta already recorded in §4.
- **Step-detail copy at 12px maps to `text-label-sm`.** Exact size match; the name says *label* but
  the token is 0.75rem, which is the drawn value. `text-caption` (0.6875rem) would be 1px short.
- **The description colour is breakpoint-dependent**, and only the colour: `#4c5e65`
  (`neutral-700`) at mobile, `#37474e` (`neutral-800`) at desktop, at 14px/22px in **both**. Built
  `md:text-neutral-800`, which resolves correctly under a plain-join `cn` because Tailwind 4 emits
  variant utilities after unprefixed ones.

### Reuse, and why two components are new

`AuthLayout`, `AuthHeader`, `StatusIcon`, `LogoMark`, `CheckIcon` and `buttonClasses` compose the
whole screen. Three shared components were extended **additively**, so no gated screen moved:

- `StatusIcon` — new `sm` size, new `shape` axis, both defaulted to existing behaviour.
- `AuthHeader` — new `welcome` variant. The existing `display` variant does not fit: its mobile
  title is 22/30 and this screen needs 28/36. Editing the shared base was not an option either,
  because the base bakes in `text-neutral-700` and this description is breakpoint-dependent.
- `AuthLayout` — new `welcome` width (`md:max-w-[560px]`). The existing `xl`
  (`md:max-w-[520px] lg:max-w-[560px]`) does not fit: the design is 560 at **both** `md` and `lg`.

No new gap key was needed — the drawn 24→32px container gap is exactly the existing `flat` key.
Padding and justification needed no change either; `px-5 py-10 md:px-12 lg:py-20` with the default
`justify="top"` reproduces the drawn geometry at every width:

- 390: 390 − 40 = **350** ✓
- 768: 768 − 96 = 672, centred 560 → x = **104** ✓
- 1440: 1440 − 96 = 1344, centred 560 → x = **440** ✓; vertically 900 − 160 = 740, centred 602 →
  y = **149** ✓

**`OnboardingStepCard` is a new component rather than an `AuthCard` variant**, for two independent
reasons. `AuthCard`'s base hardcodes `flex-col` — and because Tailwind emits `flex-row` *before*
`flex-col`, a variant could never override it under a plain-join `cn` — while the step card is a
row. And all seven `AuthCard` variants carry a shadow; the step card has none. `role-card.tsx` is
the existing precedent for a self-contained card that owns its own surface classes, and this
follows it, including owning its own `<li>` the way `role-card.tsx` owns its `<label>`.

The numeral is `aria-hidden` and the list is an `<ol aria-label>`, so the ordinal is announced by
list semantics rather than read twice — the `verification-checklist.tsx` idiom.

**`AuthLayout logoSize="none"` plus a manual centred `LogoMark`.** The built-in logo is `self-start`
and `AuthLayoutLogo` has no `"responsive"` member, so the layout's own slot cannot centre it. This
matches how `verification-status.tsx` already handles the same requirement.
