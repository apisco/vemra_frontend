# Vemra — Component Library

Twelve components in four folders, built only from the tokens in `src/app/globals.css`.
Live preview of every component in every state: **`/design-system`**.

| Component                                    | File                                             | Figma  | Runtime |
| -------------------------------------------- | ------------------------------------------------ | ------ | ------- |
| [Button](#button)                             | `components/ui/button.tsx`                       | 68:12  | server  |
| [Input](#input)                               | `components/ui/input.tsx`                        | 68:48  | client  |
| [Checkbox](#checkbox)                         | `components/ui/checkbox.tsx`                     | 68:100 | client  |
| [Badge](#badge)                               | `components/ui/badge.tsx`                        | 68:30  | server  |
| [Avatar](#avatar)                             | `components/ui/avatar.tsx`                       | 68:19  | server  |
| [StatCard](#statcard)                         | `components/ui/stat-card.tsx`                    | 68:49  | server  |
| [Tabs](#tabs)                                 | `components/ui/tabs.tsx`                         | 68:95  | client  |
| [Table set](#table-set)                       | `components/ui/table.tsx`                        | 68:78  | server  |
| [TableActionsMenu](#tableactionsmenu)         | `components/ui/table-actions-menu.tsx`           | —      | client  |
| [Modal](#modal)                               | `components/feedback/modal.tsx`                  | 68:79  | client  |
| [Spinner](#spinner) / [Skeleton](#skeleton)   | `components/feedback/`                           | —      | server  |
| [NavItem](#navitem)                           | `components/navigation/nav-item.tsx`             | 68:62  | server  |

Seven of the twelve are Server Components. Only the five that own interaction state —
`Input` (password toggle), `Checkbox` (the `indeterminate` DOM property), `Tabs`, `Modal`,
`TableActionsMenu` — carry `"use client"`. The table itself is a Server Component; only its
actions menu is a client island, so a 200-row table ships no row-level JavaScript.

`components/layout/` is intentionally empty. The layout shells — `PublicLayout`, `AuthLayout`,
`DashboardLayout`, `EmailLayout` and the five role sidebars (`82:162`, `82:236`, `82:294`,
`82:344`, `82:393`) — are screen-phase work per `docs/screen-inventory.md`. Creating placeholder
components now to fill the folder would be inventing design.

---

## Button

`68:12` — Primary `68:2`, Secondary `68:4`, Ghost `68:6`, Destructive `68:8`, Disabled `68:10`.

| Prop        | Type                                                                | Default     | Notes                                                        |
| ----------- | ------------------------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| `variant`   | `"primary" \| "secondary" \| "outline" \| "ghost" \| "destructive"`  | `"primary"` | `outline` is derived — see [Derived from tokens](#derived-from-tokens) |
| `size`      | `"sm" \| "md" \| "lg"`                                              | `"md"`      | 40 / 44 / 48px tall                                          |
| `fullWidth` | `boolean`                                                           | `false`     | Stretches to the container                                   |
| `iconLeft`  | `ReactNode`                                                         | —           | Replaced by the spinner while loading                        |
| `iconRight` | `ReactNode`                                                         | —           |                                                              |
| `isLoading` | `boolean`                                                           | `false`     | Disables the button and sets `aria-busy`                     |
| `disabled`  | `boolean`                                                           | `false`     | Applies the Disabled frame over any variant                  |

Also accepts every `<button>` attribute. `type` defaults to `"button"`, so a button inside a form
does not submit it by accident.

States: **default** and **disabled** are the design's frames. **hover** uses `brand-800`, the
token the design system documents as the primary hover. **active** darkens every variant by the
same `brightness-95` rather than inventing a per-variant pressed colour. **focus** is a 2px
`brand-700` ring, matching the focused-input treatment. **loading** keeps the label rendered so
the button cannot change width mid-request.

```tsx
<Button variant="destructive" size="sm" isLoading>Deleting</Button>
```

## Input

`68:48` — Default `68:31`, Focused `68:35`, Error `68:39`, Disabled `68:44`.

| Prop                 | Type        | Default  | Notes                                                                 |
| -------------------- | ----------- | -------- | --------------------------------------------------------------------- |
| `label`              | `string`    | required | Always rendered; pair with `hideLabel` to hide it visually            |
| `hideLabel`          | `boolean`   | `false`  | `sr-only` label, for a toolbar search field                           |
| `helperText`         | `string`    | —        | Replaced by `error` when invalid                                      |
| `error`              | `string`    | —        | Its presence *is* the error state                                     |
| `iconLeft`           | `ReactNode` | —        |                                                                       |
| `iconRight`          | `ReactNode` | —        | Ignored when `showPasswordToggle` is set — they share the slot        |
| `showPasswordToggle` | `boolean`   | `false`  | Manages `type` internally; pass `type="password"` to start masked      |
| `containerClassName` | `string`    | —        | Width and layout. The field itself is not styleable, by design         |

Also accepts every `<input>` attribute except `className`.

Accessibility: `label` is bound with `htmlFor`/`id` (auto-generated via `useId`, overridable).
`aria-invalid` is set when `error` is present, `aria-describedby` points at the helper and error
text, and the error message carries `role="alert"` so a late validation response is announced.

The focused state is a 1px border **plus** a 1px outline at zero offset. That renders the design's
2px edge without the 1px content shift a thicker border would cause.

## Checkbox

`68:100` — Unchecked `68:96`, Checked `68:97`, Disabled `68:99`.

| Prop                 | Type      | Default  | Notes                                                    |
| -------------------- | --------- | -------- | -------------------------------------------------------- |
| `label`              | `string`  | required | Never optional — a bare box has no accessible name       |
| `hideLabel`          | `boolean` | `false`  | Used by the table's row selector                         |
| `indeterminate`      | `boolean` | `false`  | Sets the DOM property, so AT reads "partially checked"   |
| `containerClassName` | `string`  | —        | Applied to the wrapping `<label>`                        |

Also accepts every `<input>` attribute except `type` and `className`.

A native `input[type=checkbox]` with `appearance-none`, so the space key, form submission and
label association come from the platform rather than from JavaScript. The tick is the design's own
`✓` glyph — the Figma frame draws it as text. `indeterminate` takes visual precedence over
`checked`, matching browser behaviour.

## Badge

`68:30` — Success `68:20`, Warning `68:22`, Error `68:24`, Neutral `68:26`, Info `68:28`.

| Prop      | Type                                                          | Default     |
| --------- | ------------------------------------------------------------- | ----------- |
| `variant` | `"success" \| "warning" \| "danger" \| "info" \| "neutral"`    | `"neutral"` |
| `size`    | `"sm" \| "md"`                                                | `"md"`      |

The design's frame is named *Error*; the prop is `danger` because that is the name in the brief.
`md` is the design (12px inline padding, 12px label); `sm` is derived on the base-4 scale.

## Avatar

`68:19` — Small `68:13`, Medium `68:15`, Large `68:17`.

| Prop       | Type                             | Default  | Notes                                          |
| ---------- | -------------------------------- | -------- | ---------------------------------------------- |
| `name`     | `string`                         | required | Accessible label, and the source of initials   |
| `src`      | `string`                         | —        | Photo. Replaces the initials                   |
| `initials` | `string`                         | —        | Overrides the derived initials                 |
| `size`     | `"xs" \| "sm" \| "md" \| "lg"`   | `"md"`   | 24 / 32 / 40 / 48px — `xs` is derived          |

Three tiers in order: photo → initials → a plain `neutral-200` circle. The last tier is a blank
circle rather than a person glyph because the design ships no icon assets.

With a photo the accessible name comes from `alt`; without one the wrapper takes
`role="img"` + `aria-label` and the initials are `aria-hidden`, so a screen reader reads
"Ada Lovelace" and not "A L".

Uses a plain `<img>`, not `next/image`: avatar hosts are user-uploaded and unknown at build time,
so `images.remotePatterns` cannot be configured yet. The lint rule is suppressed on that one line
with that reason. Sizes are fixed, so there is no layout-shift cost. Revisit when the upload
domain is settled.

## StatCard

`68:49`.

| Prop        | Type            | Default  | Notes                                                     |
| ----------- | --------------- | -------- | --------------------------------------------------------- |
| `title`     | `string`        | required | 13px `neutral-700`                                        |
| `value`     | `ReactNode`     | required | 28px Poppins Bold `neutral-900`                           |
| `icon`      | `ReactNode`     | —        | Top-right slot. Derived                                   |
| `subtitle`  | `string`        | —        | Ignored when `trend` is set — they share the slot          |
| `trend`     | `StatCardTrend` | —        | `{ direction: "up" \| "down" \| "flat"; label: string }`   |
| `isLoading` | `boolean`       | `false`  | Skeleton bars for value and caption; sets `aria-busy`     |

The frame is 260px wide; the component is fluid and the parent grid sets the width — that is what
makes it responsive from 320 to 1440. The trend pairs its colour (`success-600` / `error-600` /
`neutral-700`) with an arrow glyph, so direction is never carried by colour alone.

## Tabs

`68:95` — Default `68:90`, Active `68:92`.

| Prop            | Type                        | Default       | Notes                                           |
| --------------- | --------------------------- | ------------- | ----------------------------------------------- |
| `items`         | `TabItem[]`                 | required      | `{ id, label, disabled?, content? }`            |
| `variant`       | `"underline" \| "pill"`     | `"underline"` | `pill` is derived                               |
| `label`         | `string`                    | required      | Accessible name for the tab list                |
| `value`         | `string`                    | —             | Controlled selection                            |
| `defaultValue`  | `string`                    | —             | Uncontrolled; falls back to the first enabled tab |
| `onValueChange` | `(id: string) => void`      | —             |                                                 |

Panels render only when at least one item has `content`. Inactive panels stay mounted and
`hidden`, so panel state survives tab switches.

Keyboard: the list is a single tab stop, ← → move between tabs, Home/End jump to either end,
disabled tabs are skipped, and selection follows focus.

The active tab's 2px bar sits **inside** the frame's bottom padding, not flush with a baseline, so
the list has no baseline rule — that is the design, not an omission. Inactive tabs render the bar
transparently so switching cannot shift the row.

## Table set

`68:78` — Default `68:63`, Hover `68:68`, Striped `68:73`.

A composed set rather than a `columns`-config component, because the design's tables differ per
screen in what a cell holds — a badge, an avatar pair, a currency figure, a menu — and a config
API would end up re-implementing JSX.

| Component         | Props                                                              |
| ----------------- | ------------------------------------------------------------------ |
| `Table`           | `caption` (required, `sr-only`), `children`, `className`            |
| `TableHead`       | `children` — the `<tr>` is supplied for you                        |
| `TableHeaderCell` | `align?: "left" \| "right"`, plus every `<th>` attribute            |
| `TableBody`       | `children`                                                         |
| `TableRow`        | `isSelected?`, `isStriped?`, `className`                            |
| `TableCell`       | `header?`, `isPrimary?`, `align?`, plus every `<td>` attribute      |

- **Selection** — put a `Checkbox` with `hideLabel` in the first cell and set `isSelected` on the
  row to tint it `brand-50`. A header checkbox with `indeterminate` gives select-all.
- **Hover** is `neutral-50`, from the design's Hover frame.
- **`isPrimary`** is the design's first-column treatment: Semi Bold `neutral-900` against
  `neutral-800` elsewhere.
- **Mobile collapse** — below 768px the header is removed and each row becomes a bordered card
  whose cells are label/value pairs, using `header` as the label. Pure CSS, so the table stays a
  Server Component and there is no resize listener. Cells with no `header` (checkbox, actions)
  render label-less.

```tsx
<Table caption="Tenants and lease status">
  <TableHead>
    <TableHeaderCell>Tenant</TableHeaderCell>
    <TableHeaderCell align="right">Annual rent</TableHeaderCell>
  </TableHead>
  <TableBody>
    <TableRow isSelected={selected}>
      <TableCell header="Tenant" isPrimary>Ada Lovelace</TableCell>
      <TableCell header="Annual rent" align="right">₦1,200,000</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## TableActionsMenu

No Figma source. Composed from tokens already in use: white surface, `elevation-1` (the token the
design system documents for cards *and dropdowns*), `neutral-200` border, `neutral-50` hover,
`error-600`/`error-50` for destructive items.

| Prop      | Type             | Default  | Notes                                                          |
| --------- | ---------------- | -------- | -------------------------------------------------------------- |
| `actions` | `TableAction[]`  | required | `{ id, label, onSelect, isDestructive?, disabled? }`           |
| `label`   | `string`         | required | Make it row-specific: `Actions for 12 Bode Thomas`             |
| `icon`    | `ReactNode`      | `⋯`      | Text glyph, since the library has no icon assets               |

ARIA menu-button pattern: Enter/Space/↓ opens and lands on the first enabled item, ↑ ↓ and
Home/End move, Tab or an outside click closes, Escape closes and returns focus to the trigger.

The panel is `position: fixed` from the trigger's measured rect, because `Table`'s horizontal
scroll container would otherwise clip it. Those two numbers are **the only inline styles in the
library** — runtime geometry cannot be a utility class — and everything visual stays in Tailwind.
A scroll or resize closes the menu rather than letting the coordinates go stale.

## Modal

`68:79`.

| Prop      | Type                     | Default  | Notes                                                   |
| --------- | ------------------------ | -------- | ------------------------------------------------------- |
| `isOpen`  | `boolean`                | required | The parent owns openness                                |
| `onClose` | `() => void`             | required | Fired by Escape and the close button                    |
| `title`   | `string`                 | required | Wired to `aria-labelledby`                              |
| `size`    | `"sm" \| "md" \| "lg"`   | `"md"`   | 400 / 480 (Figma) / 640px — `sm` and `lg` derived       |
| `footer`  | `ReactNode`              | —        | Omit and the divider goes too                           |

Built on native `<dialog>` + `showModal()`, so the **focus trap**, the top layer and **Escape**
come from the browser instead of a hand-rolled trap. **Scroll lock** toggles `overflow-hidden` on
`<body>` — a Tailwind class, not an inline style. The backdrop scrim (`neutral-900/50`) is derived;
the design specifies none.

Clicking the backdrop deliberately does **not** close the dialog: the brief lists Escape and the
close button, and these dialogs confirm destructive actions where a stray click should not dismiss.

Long bodies scroll inside the panel; the panel never exceeds the viewport.

```tsx
<Modal isOpen={open} onClose={close} title="End this tenancy?" footer={
  <>
    <Button variant="secondary" size="sm" onClick={close}>Cancel</Button>
    <Button size="sm" onClick={confirm}>End tenancy</Button>
  </>
}>
  <p>…</p>
</Modal>
```

## NavItem

`68:62` — Default `68:53`, Active `68:56`, Hover `68:59`.

| Prop          | Type                                   | Default     | Notes                                           |
| ------------- | -------------------------------------- | ----------- | ----------------------------------------------- |
| `href`        | `string`                               | required    | Renders a `next/link`                           |
| `label`       | `string`                               | required    |                                                 |
| `icon`        | `ReactNode`                            | —           |                                                 |
| `variant`     | `"sidebar" \| "top" \| "mobile"`        | `"sidebar"` | `top` and `mobile` are derived                  |
| `isActive`    | `boolean`                              | `false`     | Sets `aria-current="page"`                      |
| `isCollapsed` | `boolean`                              | `false`     | Sidebar only; ignored by the other two variants |

Collapsed items keep the label in the accessibility tree (`sr-only`) and expose it as the hover
tooltip, so a collapsed rail is still navigable by screen reader.

`isActive` is a prop rather than read from `usePathname`, which keeps this a Server Component. The
sidebar that renders these will already know the active route.

The design draws every icon as a rounded square filled with the label colour at **40% alpha**.
That is placeholder shorthand, not a spec — real icons inherit `currentColor` at full strength.
Same reading as the design system's `white` card-surface swatch, which renders as `#f7f9fa`.

## Spinner

No Figma source, but `Button` and `StatCard` need it.

| Prop        | Type     | Default    | Notes                                                     |
| ----------- | -------- | ---------- | --------------------------------------------------------- |
| `className` | `string` | `"size-4"` | Size utility                                             |
| `label`     | `string` | —          | Omit inside a control that already sets `aria-busy`       |

Borrows `currentColor`, so it names no colour and inherits whatever token its parent set. Without
`label` it is `aria-hidden`, so a loading button is not announced twice.

## Skeleton

No Figma source. The design's skeleton sheets (`98:3075`, `98:3224`, `98:3300`) are full-screen
compositions belonging to phase 3; `StatCard` needs a bar now.

| Prop        | Type     | Notes                                          |
| ----------- | -------- | ---------------------------------------------- |
| `className` | `string` | Required — the bar has no default size         |

`neutral-100`, the documented divider tint. Always `aria-hidden`; the owning container announces
the busy state.

---

## Token conformance

Every value in every component resolves to a token already in `src/app/globals.css`. Nothing was
added to, removed from, or changed in that file — the token layer is byte-identical to the state
the foundation phase left it in.

- **Colours** — only `brand-*`, `neutral-*`, `success-*`, `warning-*`, `error-*` and Tailwind's
  `white`. Zero hex literals, zero `bg-[…]`/`text-[…]` arbitrary colours. Three opacity modifiers
  appear (`error-600/90` for the destructive pressed step, `neutral-900/50` for the modal scrim,
  `opacity-40` on the preview page's placeholder icon) — each modulates an existing token rather
  than naming a new colour.
- **Radius** — only `rounded-sm|md|lg|xl|full`. No `rounded-[…]`, and the cleared `2xl/3xl/4xl`
  steps are never referenced.
- **Shadow** — only `shadow-elevation-1` and `shadow-elevation-2`. No Tailwind default shadows;
  the `--shadow-*: initial` reset means `shadow-sm`/`shadow-md` would not compile anyway.
- **Type** — only the 12 documented steps plus `font-display` for Poppins. No `text-[…]`.
- **Spacing** — Tailwind's numeric scale, which the token file documents as already covering the
  base-4 set.

Four literal values exist in `src/` outside `globals.css`. None is in a banned category, and each
is annotated where it appears:

1. `border-[1.5px]` — `checkbox.tsx`. The design's 1.5px stroke. A border **width**; the design
   system defines no width tokens, so there is no token to use instead.
2. `style={{ top, right }}` — `table-actions-menu.tsx`. Runtime geometry, discussed above. The only
   inline style in the repo.
3. `#fafbfc` — `table.tsx`, inside a comment explaining collision 2 below. Prose, not a value.
4. `%230e96ac` — `design-system/page.tsx`, in the preview-only sample-avatar data URI. That is
   `brand-600`'s own value; a data URI cannot reference a CSS custom property, and this constant
   exists so the preview page has no network dependency. Not part of the library.

Reproduce the audit:

```bash
npx tsc --noEmit && npx eslint src
grep -rnE '#[0-9a-fA-F]{3,8}\b|(bg|text|border|shadow|rounded|ring|outline)-\[|style=\{|: any\b|shadow-(sm|md|lg|xl|2xl)\b|rounded-(2xl|3xl|4xl)\b' src
```

The grep returns `globals.css`'s own token definitions plus exactly the four lines above — no
arbitrary colour utility, no Tailwind default shadow, no cleared radius step, and no `any`
anywhere. `npx next build` succeeds with `/`, `/_not-found` and `/design-system` all prerendered
static.

Run the build from `vemra_frontend` — the folder's real and canonical on-disk name. A cwd spelled
`VEMRA_FRONTEND` against it fails at the `/_global-error` prerender with `Invariant: Expected
workStore to be initialized`, which is a duplicate-module artefact of Windows' case-insensitive
filesystem, not a fault in any component.

## Derived from tokens

The brief asks for states and variants the design does not draw. Each is built from existing
tokens, and each is listed here so it can be checked against intent rather than discovered later.

| Component          | Derived                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `Button`           | `outline` variant, `lg` size, hover / active / loading states        |
| `Input`            | `iconLeft`, `iconRight`, password toggle, helper text                |
| `Checkbox`         | `indeterminate`                                                     |
| `Badge`            | `sm` size                                                           |
| `Avatar`           | `xs` size, photo tier, blank-circle fallback                         |
| `StatCard`         | `icon`, `trend`, `isLoading`                                        |
| `Tabs`             | `pill` variant, disabled tabs, panel wiring                          |
| `Table`            | header row, selection tint, mobile collapse                          |
| `TableActionsMenu` | the whole component                                                 |
| `Modal`            | `sm`/`lg` sizes, backdrop scrim, close-button glyph                  |
| `NavItem`          | `top` and `mobile` variants, collapsed state                         |
| `Spinner`          | the whole component                                                 |
| `Skeleton`         | the whole component                                                 |

Two conventions the design established and the library follows rather than replacing: text glyphs
where the design uses them (`✓` for the tick, extended to `✕` and `⋯`), and icons as `ReactNode`
slots, since every icon in the Figma library is an unexported placeholder rectangle. **The library
ships no image or SVG assets, because the design exports none.**

## Token collisions worth a decision

Not blockers — the components ship as described above — but each one costs a visual distinction
the design appears to intend. All three come from the near-duplicate collapse the design system's
own critique frame (`18:356`) documents.

1. **Info vs. Neutral badge.** The design's Info tint is `#ebf6f8`; the nearest token, `brand-50`,
   is `#f0f4f6` — the same value as `neutral-100`. So Info and Neutral badges share a background
   and separate on text colour only. One-token fix: `--color-brand-100: #ebf6f8`.
2. **Striped vs. hover table row.** Striped is `#fafbfc`, hover is `#f7f9fa` = `neutral-50`. Both
   collapse onto `neutral-50`, so zebra striping is invisible and a striped row looks permanently
   hovered. One-token fix: `--color-neutral-25: #fafbfc`. Until then, prefer leaving `isStriped`
   off — the row rule already separates rows.
3. **`brand-400` is green.** `#0f7b54`, identical to `success-600`, sitting inside the teal ramp.
   Nothing in the library uses it; flagging it before a chart picks it up as a brand tint.
