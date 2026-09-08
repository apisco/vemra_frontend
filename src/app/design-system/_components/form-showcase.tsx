"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { PlaceholderIcon, Row } from "./section";

export function FormShowcase() {
  const [checked, setChecked] = useState(true);
  const [mixed, setMixed] = useState(true);

  return (
    <>
      <Row label="Input — default, helper text, error, disabled" className="items-start">
        <Input
          label="Full name"
          placeholder="Ada Lovelace"
          containerClassName="max-w-xs"
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          helperText="We only use this for lease notifications."
          containerClassName="max-w-xs"
        />
        <Input
          label="Monthly rent"
          defaultValue="0"
          error="Enter an amount greater than ₦0."
          containerClassName="max-w-xs"
        />
        <Input
          label="Tenant ID"
          placeholder="Assigned on approval"
          disabled
          containerClassName="max-w-xs"
        />
      </Row>

      <Row label="Input — icon slots and password toggle" className="items-start">
        <Input
          label="Search properties"
          placeholder="Lekki, Lagos"
          iconLeft={<PlaceholderIcon />}
          containerClassName="max-w-xs"
        />
        <Input
          label="Amount"
          placeholder="0.00"
          iconRight={<PlaceholderIcon />}
          containerClassName="max-w-xs"
        />
        <Input
          label="Password"
          type="password"
          defaultValue="correct-horse"
          showPasswordToggle
          containerClassName="max-w-xs"
        />
        <Input
          label="Hidden label"
          hideLabel
          placeholder="Label is screen-reader only"
          containerClassName="max-w-xs"
        />
      </Row>

      <Row label="Checkbox — unchecked, checked, indeterminate, disabled">
        <Checkbox
          label="Unchecked"
          checked={false}
          onChange={() => undefined}
        />
        <Checkbox
          label="Checked"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
        <Checkbox
          label="Indeterminate"
          indeterminate={mixed}
          checked={false}
          onChange={() => setMixed(false)}
        />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled, checked" disabled checked readOnly />
        <Checkbox label="Label hidden" hideLabel />
      </Row>
    </>
  );
}
