# Vemra — Screen Inventory

Source: Figma file `TOQCNmbIIi0C3IZSoZfkPf` ("Vemra Design"), page `3:2`.

Every product screen is designed at three widths — **1440** (desktop), **768** (tablet), **390** (mobile).
Node IDs below are listed as `width=nodeId`. Where a breakpoint is missing, the design does not
provide that frame and the layout must be derived from the neighbouring widths.

**Totals:** 79 product screens · 13 email templates · 7 cross-cutting pattern sheets.

---

## 1. Marketing — 7 screens

Public, unauthenticated. Section `🌐 Public / Marketing [50:2]`.

| #   | Screen              | 1440    | 768      | 390      |
| --- | ------------------- | ------- | -------- | -------- |
| M1  | Landing page        | 9:923   | 108:3476 | 101:3476 |
| M2  | Browse listings     | 9:1085  | 108:3583 | 101:3588 |
| M3  | Listing detail      | 10:236  | 108:3689 | 101:3681 |
| M4  | Search empty state  | 13:310  | 108:3793 | 101:3887 |
| M5  | About / contact     | 6:27    | 108:3841 | 101:3776 |
| M6  | Public profile      | 13:113  | 108:3901 | 101:3946 |
| M7  | 404                 | 6:13    | 108:3970 | 101:4043 |

`logo [7:2]` is a brand asset, and `screen-container-1 [57:699]` / `screen-container-5 [57:719]`
are empty layout scaffolds — none are screens.

## 2. Auth — 11 screens

Section `Onboarding Flow [50:3]`. No app shell; centred card on the page background.

| #    | Screen                | 1440     | 768      | 390      |
| ---- | --------------------- | -------- | -------- | -------- |
| AU1  | Sign up — role picker | 15:8     | 108:3993 | 101:4075 |
| AU2  | Sign up — details     | 15:63    | 108:4059 | 101:4149 |
| AU3  | Sign up — verification| 15:118   | 108:4126 | 101:4222 |
| AU4  | Login                 | 57:341   | 109:3528 | 101:6660 |
| AU5  | Forgot password       | 57:655   | 109:3593 | 101:6715 |
| AU6  | Reset password        | 13:181   | 109:3621 | 101:6744 |
| AU7  | Email verified        | 135:4209 | 109:3653 | 102:3474 |
| AU8  | Two-factor setup      | 15:688   | 108:4186 | 101:4288 |
| AU9  | Verification pending  | 15:723   | 108:4231 | 101:4339 |
| AU10 | Verification rejected | 15:755   | 108:4272 | 101:4384 |
| AU11 | Terms & privacy       | 135:4225 | 109:3677 | 102:3502 |

## 3. Tenant — 26 screens

Section `🏠 Tenant Flow [50:4]`. Dashboard shell with the tenant sidebar (`82:162`), **except TN1**,
which has no shell and is built on `AuthLayout` in phase 4.

| #    | Screen                      | 1440    | 768      | 390      |
| ---- | --------------------------- | ------- | -------- | -------- |
| TN1  | Welcome / onboarding        | 13:78   | 109:3789 | 101:4436 |
| TN2  | Dashboard                   | 15:165  | 109:3823 | 101:4509 |
| TN3  | Apply for property          | 9:1379  | 109:3944 | 101:4623 |
| TN4  | Lease signing               | 9:1428  | 109:3991 | 101:4707 |
| TN5  | Pay rent                    | 13:474  | 109:4032 | 101:4785 |
| TN6  | My rentals                  | 56:601  | 109:4169 | 101:4988 |
| TN7  | My rentals — empty          | 59:1371 | 109:5513 | 101:6598 |
| TN8  | Saved properties            | 56:474  | 109:4502 | 101:5354 |
| TN9  | Saved properties — empty    | 59:668  | 109:5141 | 101:6034 |
| TN10 | Rent savings                | 56:132  | 109:4247 | 101:5067 |
| TN11 | Rent savings — setup        | 59:1250 | 109:5443 | 101:6504 |
| TN12 | Caution deposit             | 56:251  | 109:4418 | 101:5258 |
| TN13 | Maintenance — report        | 56:363  | 109:4335 | 101:5160 |
| TN14 | Maintenance — tracking      | 56:838  | 109:4687 | 101:5553 |
| TN15 | Maintenance — empty         | 59:830  | 109:5203 | 101:6160 |
| TN16 | Maintenance — success       | 59:1163 | 109:5399 | 101:6441 |
| TN17 | Condition record            | 56:966  | 109:4796 | 101:5649 |
| TN18 | Chat / messaging            | 56:9    | 109:4605 | 101:5461 |
| TN19 | Messages — empty            | 59:749  | 109:5173 | 101:6102 |
| TN20 | Referral dashboard          | 56:1054 | 109:4864 | 101:5735 |
| TN21 | Referrals — empty           | 59:990  | 109:5270 | 101:6274 |
| TN22 | Notifications               | 56:1162 | 109:4951 | 101:5843 |
| TN23 | Notifications — empty       | 59:911  | 109:5235 | 101:6218 |
| TN24 | Account settings            | 56:1256 | 109:5055 | 101:5940 |
| TN25 | Payment failed              | 59:1119 | 109:5336 | 101:6360 |
| TN26 | Support                     | 15:500  | 109:4077 | 101:4876 |

## 4. Landlord — 22 screens

Section `🏢 Landlord Flow [50:5]`. Dashboard shell with the landlord sidebar (`82:236`), **except
LL1**, which has no shell and is built on `AuthLayout` in phase 4.

| #    | Screen                      | 1440    | 768      | 390      |
| ---- | --------------------------- | ------- | -------- | -------- |
| LL1  | Welcome / onboarding        | 13:8    | 109:5561 | 102:3588 |
| LL2  | Dashboard                   | 9:1238  | 109:5597 | 102:3639 |
| LL3  | Dashboard — empty           | 57:284  | 109:6885 | 102:5134 |
| LL4  | List property               | 10:64   | 109:5674 | 102:3716 |
| LL5  | List property — review      | 10:179  | 109:5756 | 102:3788 |
| LL6  | Listing published           | 10:352  | 109:5809 | 102:3834 |
| LL7  | Properties list             | 13:343  | 109:5840 | 102:3864 |
| LL8  | Manage listing              | 57:186  | 109:6807 | 102:5040 |
| LL9  | Applications list           | 6:662   | 109:6033 | 102:4028 |
| LL10 | Applications — empty        | 61:503  | 109:6916 | 102:5211 |
| LL11 | Application review          | 6:743   | 109:6115 | 102:4147 |
| LL12 | Agent invite                | 6:118   | 109:6202 | 102:4243 |
| LL13 | Payout account              | 13:217  | 109:5949 | 102:3947 |
| LL14 | Transaction statement       | 15:572  | 109:6288 | 102:4324 |
| LL15 | Statement — empty           | 61:698  | 109:7010 | 102:5383 |
| LL16 | Payment breakdown           | 56:1851 | 109:6652 | 102:4649 |
| LL17 | Maintenance view            | 56:1398 | 109:6456 | 102:4488 |
| LL18 | Maintenance — empty         | 61:569  | 109:6952 | 102:5271 |
| LL19 | Caution deposits            | 56:1532 | 109:6566 | 102:4570 |
| LL20 | Deposits — empty            | 61:635  | 109:6982 | 102:5327 |
| LL21 | Notification preferences    | 57:2    | 109:6714 | 102:4727 |
| LL22 | Account settings            | 6:154   | 109:6383 | 102:4413 |

## 5. Agent — 6 screens

Section `👤 Agent Flow [50:6]`. Dashboard shell with the agent sidebar (`82:294`), **except AG1**,
which has no shell and is built on `AuthLayout` in phase 4.

| #   | Screen                | 1440    | 768      | 390      |
| --- | --------------------- | ------- | -------- | -------- |
| AG1 | Welcome / onboarding  | 13:43   | 109:7071 | 107:3478 |
| AG2 | Dashboard             | 6:452   | 109:7106 | 107:3530 |
| AG3 | Accept admin invite   | 6:84    | 109:7260 | 107:3706 |
| AG4 | Permissions           | 6:579   | 109:7213 | 107:3624 |
| AG5 | Maintenance queue     | 56:1637 | 109:7287 | 107:3756 |
| AG6 | Inspection scheduling | 56:1773 | 109:7346 | 107:3842 |

## 6. Admin & Super Admin — 7 screens

Section `⚙️ Admin & Super Admin [50:7]`. Sidebars: admin `82:344`, super admin `82:393`.

| #   | Screen                        | 1440    | 768      | 390      |
| --- | ----------------------------- | ------- | -------- | -------- |
| AD1 | Admin dashboard               | 6:286   | 109:7401 | 107:3940 |
| AD2 | Users management              | 56:1993 | 109:7534 | 107:4114 |
| AD3 | Listings management           | 56:2129 | 109:7605 | 107:4238 |
| AD4 | Payments & transactions       | 56:2257 | 109:7688 | 107:4347 |
| AD5 | Platform settings             | 56:2377 | 109:7769 | 107:4442 |
| AD6 | Super admin dashboard         | 15:303  | 109:7469 | 107:4024 |
| AD7 | Super admin financials        | 56:2477 | 109:7833 | 107:4518 |

## 7. Shared — 7 cross-cutting pattern sheets

Not screens. Each defines a pattern reused across every role, so each becomes a shared component
or a set of states on one. They are parked inside the Tenant and Landlord sections in Figma but
belong to no single role.

| #   | Pattern                  | Node    | Becomes                                      |
| --- | ------------------------ | ------- | -------------------------------------------- |
| SH1 | Skeleton — dashboard     | 98:3075 | loading state of the dashboard shell          |
| SH2 | Skeleton — listing cards | 98:3224 | loading state of the listing card grid        |
| SH3 | Skeleton — table         | 98:3300 | `Table` loading state                         |
| SH4 | Toast notifications      | 98:3447 | `components/feedback/toast`                   |
| SH5 | Form validation states   | 98:3586 | `Input` error/helper states (already built)   |
| SH6 | Analytics dashboard      | 98:3791 | chart + `StatCard` composition blocks         |
| SH7 | Confirmation dialogs     | 98:4067 | `Modal` preset compositions                   |

## 8. Email templates — 13

Section `📧 Email Templates [50:8]`. Table-based HTML at 600–640px; a separate rendering path from
the app, so these come last.

| #    | Template                  | Node   | Width |
| ---- | ------------------------- | ------ | ----- |
| EM1  | Verify address            | 16:393 | 640   |
| EM2  | Welcome — tenant          | 16:460 | 600   |
| EM3  | Welcome — landlord        | 16:421 | 600   |
| EM4  | Welcome — agent           | 16:499 | 600   |
| EM5  | Password reset            | 16:231 | 600   |
| EM6  | Application status        | 16:199 | 600   |
| EM7  | Lease signed              | 16:273 | 600   |
| EM8  | Rent reminder             | 16:313 | 640   |
| EM9  | New message               | 16:251 | 600   |
| EM10 | Agent response            | 16:178 | 600   |
| EM11 | Verification approved     | 16:369 | 640   |
| EM12 | Verification rejected     | 16:346 | 640   |
| EM13 | Withdrawal confirmation   | 16:538 | 600   |

`vemra-email-templates-canvas [16:8]` is the presentation board, not a template.

---

## Shared layouts

Four layouts cover all 79 product screens.

1. **`PublicLayout`** — top nav + footer. Covers M1–M7. Full-bleed sections, content capped and
   centred; nav collapses to a hamburger at 768.
2. **`AuthLayout`** — no nav. Two arrangements through one optional `aside` slot: a centred column
   on the page background (AU1–AU3, AU5–AU11 and the three onboarding-complete screens), and a
   **split two-panel** layout with a dark `brand-950` aside at `md`+ for AU4 login. Covers
   AU1–AU11 **and TN1/LL1/AG1**, which carry no dashboard shell — `15:165` is the first frame that
   instantiates `Sidebar / Tenant` (`82:163`).
3. **`DashboardLayout`** — 260px role sidebar + topbar + scrolling content. Covers TN, LL, AG and
   AD — 58 of the 79 screens, TN1/LL1/AG1 excluded per the entry above. The sidebar is the **only**
   part that varies by role, and the design provides all five as separate frames: tenant `82:162`,
   landlord `82:236`, agent `82:294`, admin `82:344`, super admin `82:393`. So this is one layout
   taking a nav-items prop, not five layouts. Below 1024 the sidebar becomes an off-canvas drawer.
4. **`EmailLayout`** — 600/640px table shell. Covers EM1–EM13.

Two recurring intra-page patterns cut across the four layouts and should be built once:

- **Empty state** — 11 of the 79 screens are the empty variant of a sibling screen (TN7, TN9,
  TN15, TN19, TN21, TN23, LL3, LL10, LL15, LL18, LL20, plus M4). One `EmptyState` component with
  icon/title/description/action props, not 12 hand-built screens.
- **Skeleton** — SH1–SH3 are the loading variants of the dashboard, card grid and table.

## Implementation order

Ordered so that each phase unblocks the next and nothing is built twice.

| Phase | Scope                                | Why here                                                                                              |
| ----- | ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| 0     | Design tokens                        | Done. Locked.                                                                                         |
| 1     | Component library                    | Current phase. Every later phase composes these.                                                      |
| 2     | `AuthLayout` + AU1–AU11 + TN1/LL1/AG1 | Simplest shell, no sidebar. Establishes forms, validation and the role routing that gates every dashboard. The three onboarding-complete screens share this shell, not `DashboardLayout`. |
| 3     | `DashboardLayout` + tenant TN1–TN26  | Largest role (26 screens) and the most complete in the design, so it sets the patterns — tables, stat rows, empty states, skeletons — that the other three roles reuse. |
| 4     | Landlord LL1–LL22                    | Same shell, swapped sidebar. Adds the listing-creation flow.                                          |
| 5     | Agent AG1–AG6                        | Same shell. Smallest role.                                                                            |
| 6     | Admin & super admin AD1–AD7          | Same shell. Heaviest tables, so it benefits from the table work landing first.                         |
| 7     | `PublicLayout` + M1–M7               | Independent of every dashboard, so it can run in parallel from phase 2 onward if there is capacity.    |
| 8     | Email EM1–EM13                       | Separate rendering path (table-based HTML), shares only tokens.                                        |

Shared patterns are not a phase. SH1–SH3 land with the screen that first needs them (phase 3),
SH4 and SH7 with phase 1's `Modal`/`Toast`, SH5 is already covered by `Input`, and SH6 lands with
the first analytics screen in phase 3.
