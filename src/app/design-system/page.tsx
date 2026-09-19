import type { Metadata } from "next";

import { Skeleton } from "@/components/feedback/skeleton";
import { Spinner } from "@/components/feedback/spinner";
import { NavItem } from "@/components/navigation/nav-item";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import type { BadgeVariant } from "@/components/ui/badge";
import type { ButtonVariant } from "@/components/ui/button";

import { FormShowcase } from "./_components/form-showcase";
import { ModalShowcase } from "./_components/modal-showcase";
import { PlaceholderIcon, Row, Section } from "./_components/section";
import { TableShowcase } from "./_components/table-showcase";
import { TabsShowcase } from "./_components/tabs-showcase";

export const metadata: Metadata = {
  title: "Design system — Vemra",
  description:
    "Every component in the Vemra component library, in every documented state.",
};

const BUTTON_VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "ghost",
  "destructive",
];

const BADGE_VARIANTS: BadgeVariant[] = [
  "success",
  "warning",
  "danger",
  "info",
  "neutral",
];

const SAMPLE_PHOTO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><rect width='48' height='48' fill='%230e96ac'/><circle cx='24' cy='18' r='8' fill='white'/><path d='M7 48c0-9 7-15 17-15s17 6 17 15z' fill='white'/></svg>";

const SECTIONS = [
  ["button", "Button"],
  ["input", "Input"],
  ["checkbox", "Checkbox"],
  ["badge", "Badge"],
  ["avatar", "Avatar"],
  ["stat-card", "Stat card"],
  ["tabs", "Tabs"],
  ["table", "Table"],
  ["modal", "Modal"],
  ["navigation", "Navigation"],
  ["primitives", "Loading primitives"],
] as const;

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-heading-xl font-bold text-neutral-900">
          Component library
        </h1>
        <p className="max-w-3xl text-body-md text-neutral-700">
          Every component below is built only from the tokens in{" "}
          <code className="rounded-sm bg-neutral-100 px-1 text-body-sm">
            globals.css
          </code>{" "}
          — no arbitrary colours, no Tailwind default shadows, no arbitrary radii.
          Hover, focus and active states are live rather than pictured: tab
          through the page to see focus rings, and hover the samples to see the
          hover treatments.
        </p>
        <nav aria-label="Sections" className="flex flex-wrap gap-2">
          {SECTIONS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full bg-white px-3 py-1 text-label-sm font-semibold text-brand-700 shadow-elevation-1 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <Section
        id="button"
        title="Button"
        figma="68:12"
        description="Five variants, three sizes, and default / hover / active / disabled / loading states. Disabled is a state applied over any variant, matching the design's single Disabled frame."
      >
        <Row label="Variants">
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant[0].toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </Row>
        <Row label="Sizes — sm (40px), md (44px, Figma), lg (48px)">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="Disabled — every variant">
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} disabled>
              Disabled
            </Button>
          ))}
        </Row>
        <Row label="Loading — keeps its label so the layout cannot shift">
          <Button isLoading>Saving</Button>
          <Button variant="secondary" isLoading>
            Saving
          </Button>
          <Button variant="destructive" isLoading>
            Deleting
          </Button>
          <Button size="sm" isLoading>
            Small
          </Button>
        </Row>
        <Row label="Icon slots">
          <Button iconLeft={<PlaceholderIcon />}>Leading</Button>
          <Button variant="secondary" iconRight={<PlaceholderIcon />}>
            Trailing
          </Button>
          <Button
            variant="ghost"
            iconLeft={<PlaceholderIcon />}
            iconRight={<PlaceholderIcon />}
          >
            Both
          </Button>
        </Row>
        <Row label="Full width" className="block max-w-sm">
          <Button fullWidth>Continue</Button>
        </Row>
      </Section>

      <Section
        id="input"
        title="Input"
        figma="68:48"
        description="Label, helper text, error, disabled, icon slots and a password toggle. The focused state is a 1px border plus a 1px outline, which reproduces the design's 2px edge without reflowing the content."
      >
        <FormShowcase />
      </Section>

      <Section
        id="checkbox"
        title="Checkbox"
        figma="68:100"
        description="A native checkbox with appearance-none, so the space key, form submission and label association come from the platform. The tick is the design's own ✓ glyph."
      >
        <p className="text-body-sm text-neutral-700">
          Rendered with the Input section above — both need live state, so they
          share one client island.
        </p>
      </Section>

      <Section
        id="badge"
        title="Badge"
        figma="68:30"
        description="Five variants in two sizes. Info and Neutral currently share a background because the design's Info tint collapses onto brand-50 — see the docs for the one-token fix."
      >
        <Row label="Medium — the Figma size">
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant[0].toUpperCase() + variant.slice(1)}
            </Badge>
          ))}
        </Row>
        <Row label="Small">
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant} size="sm">
              {variant[0].toUpperCase() + variant.slice(1)}
            </Badge>
          ))}
        </Row>
      </Section>

      <Section
        id="avatar"
        title="Avatar"
        figma="68:19"
        description="Photo, initials, then a neutral placeholder — in that order. xs is derived for dense rows such as table cells."
      >
        <Row label="Initials — xs (24px), sm (32px), md (40px), lg (48px)">
          <Avatar name="Ada Lovelace" size="xs" />
          <Avatar name="Ada Lovelace" size="sm" />
          <Avatar name="Ada Lovelace" size="md" />
          <Avatar name="Ada Lovelace" size="lg" />
        </Row>
        <Row label="Photo">
          <Avatar name="Ada Lovelace" src={SAMPLE_PHOTO} size="sm" />
          <Avatar name="Ada Lovelace" src={SAMPLE_PHOTO} size="md" />
          <Avatar name="Ada Lovelace" src={SAMPLE_PHOTO} size="lg" />
        </Row>
        <Row label="Overridden initials, and the fallback when there is no name">
          <Avatar name="Vemra Property Group" initials="VP" />
          <Avatar name="Unknown tenant" initials="" />
        </Row>
      </Section>

      <Section
        id="stat-card"
        title="Stat card"
        figma="68:49"
        description="Fluid rather than the frame's fixed 260px, so the parent grid controls the width. Icon, trend and loading are required by the brief and absent from the design; the trend pairs colour with an arrow so direction is never carried by colour alone."
      >
        <div className="grid grid-cols-1 gap-4 border-t border-neutral-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Rent collected" value="₦0.00" />
          <StatCard
            title="Rent collected"
            value="₦4,820,000"
            subtitle="Across 14 active leases"
          />
          <StatCard
            title="Rent collected"
            value="₦4,820,000"
            icon={<PlaceholderIcon />}
            trend={{ direction: "up", label: "12% vs last month" }}
          />
          <StatCard
            title="Arrears"
            value="₦310,000"
            trend={{ direction: "down", label: "4% vs last month" }}
          />
          <StatCard
            title="Occupancy"
            value="92%"
            trend={{ direction: "flat", label: "Unchanged" }}
          />
          <StatCard title="Rent collected" value="₦0.00" isLoading />
        </div>
      </Section>

      <Section
        id="tabs"
        title="Tabs"
        figma="68:95"
        description="Underline and pill styles. One tab stop for the list, arrow keys to move, Home/End to jump, and selection follows focus."
      >
        <TabsShowcase />
      </Section>

      <Section
        id="table"
        title="Table"
        figma="68:78"
        description="A composed set — Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell — plus TableActionsMenu. Below 768px the header is dropped and each row becomes a labelled card, in CSS alone."
      >
        <TableShowcase />
      </Section>

      <Section
        id="modal"
        title="Modal"
        figma="68:79"
        description="Native <dialog> + showModal(), so the focus trap and top layer come from the browser. Escape closes; the backdrop deliberately does not."
      >
        <ModalShowcase />
      </Section>

      <Section
        id="navigation"
        title="Navigation"
        figma="68:62"
        description="One component, three shapes. The design's 40%-alpha icon rectangles are placeholder shorthand, so real icons inherit currentColor at full strength."
      >
        <Row label="Sidebar — default, active, and a collapsed rail" className="items-start">
          <nav
            aria-label="Sidebar sample"
            className="flex w-56 flex-col gap-1 rounded-lg border border-neutral-200 p-2"
          >
            <NavItem
              href="#navigation"
              label="Dashboard"
              icon={<PlaceholderIcon />}
              isActive
            />
            <NavItem
              href="#navigation"
              label="Properties"
              icon={<PlaceholderIcon />}
            />
            <NavItem
              href="#navigation"
              label="Applications"
              icon={<PlaceholderIcon />}
            />
            <NavItem href="#navigation" label="Payouts" icon={<PlaceholderIcon />} />
          </nav>
          <nav
            aria-label="Collapsed sidebar sample"
            className="flex w-fit flex-col gap-1 rounded-lg border border-neutral-200 p-2"
          >
            <NavItem
              href="#navigation"
              label="Dashboard"
              icon={<PlaceholderIcon />}
              isActive
              isCollapsed
            />
            <NavItem
              href="#navigation"
              label="Properties"
              icon={<PlaceholderIcon />}
              isCollapsed
            />
            <NavItem
              href="#navigation"
              label="Applications"
              icon={<PlaceholderIcon />}
              isCollapsed
            />
          </nav>
        </Row>
        <Row label="Top nav" className="block">
          <nav
            aria-label="Top nav sample"
            className="flex w-full flex-wrap items-center gap-1 rounded-lg border border-neutral-200 p-2"
          >
            <NavItem href="#navigation" label="Browse" variant="top" isActive />
            <NavItem href="#navigation" label="How it works" variant="top" />
            <NavItem href="#navigation" label="For landlords" variant="top" />
            <NavItem href="#navigation" label="Support" variant="top" />
          </nav>
        </Row>
        <Row label="Mobile bar" className="block">
          <nav
            aria-label="Mobile nav sample"
            className="flex w-full max-w-sm items-stretch rounded-lg border border-neutral-200 p-2"
          >
            <NavItem
              href="#navigation"
              label="Home"
              variant="mobile"
              icon={<PlaceholderIcon />}
              isActive
            />
            <NavItem
              href="#navigation"
              label="Rentals"
              variant="mobile"
              icon={<PlaceholderIcon />}
            />
            <NavItem
              href="#navigation"
              label="Saved"
              variant="mobile"
              icon={<PlaceholderIcon />}
            />
            <NavItem
              href="#navigation"
              label="Account"
              variant="mobile"
              icon={<PlaceholderIcon />}
            />
          </nav>
        </Row>
      </Section>

      <Section
        id="primitives"
        title="Loading primitives"
        figma="derived — no source frame"
        description="Neither is in the design, but Button and StatCard need them. Spinner borrows currentColor so it names no colour; Skeleton uses neutral-100, the documented divider tint."
      >
        <Row label="Spinner — inherits the colour of its context">
          <span className="text-brand-700">
            <Spinner label="Loading" />
          </span>
          <span className="text-neutral-700">
            <Spinner className="size-5" label="Loading" />
          </span>
          <span className="text-error-600">
            <Spinner className="size-8" label="Loading" />
          </span>
        </Row>
        <Row label="Skeleton" className="block max-w-sm space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </Row>
      </Section>
    </main>
  );
}
