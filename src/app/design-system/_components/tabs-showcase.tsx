"use client";

import { useState } from "react";

import { Tabs } from "@/components/ui/tabs";

import { Row } from "./section";

export function TabsShowcase() {
  const [pill, setPill] = useState("all");

  const items = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <p className="text-body-md text-neutral-800">
          Panel content for Overview. Arrow keys move between tabs; Home and End
          jump to either end.
        </p>
      ),
    },
    {
      id: "documents",
      label: "Documents",
      content: (
        <p className="text-body-md text-neutral-800">
          Panel content for Documents.
        </p>
      ),
    },
    {
      id: "history",
      label: "History",
      content: (
        <p className="text-body-md text-neutral-800">
          Panel content for History.
        </p>
      ),
    },
    { id: "archived", label: "Archived", disabled: true, content: null },
  ];

  return (
    <>
      <Row label="Underline — with panels, one disabled tab" className="block">
        <Tabs items={items} label="Application sections" />
      </Row>

      <Row label="Pill — controlled, no panels" className="block">
        <Tabs
          variant="pill"
          label="Listing filters"
          value={pill}
          onValueChange={setPill}
          items={[
            { id: "all", label: "All" },
            { id: "live", label: "Live" },
            { id: "draft", label: "Draft" },
            { id: "archived", label: "Archived", disabled: true },
          ]}
        />
      </Row>
    </>
  );
}
