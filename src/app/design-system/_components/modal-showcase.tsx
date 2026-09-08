"use client";

import { useState } from "react";

import { Modal } from "@/components/feedback/modal";
import { Button } from "@/components/ui/button";
import type { ModalSize } from "@/components/feedback/modal";

import { Row } from "./section";

const SIZES: { size: ModalSize; caption: string }[] = [
  { size: "sm", caption: "Small — 400px" },
  { size: "md", caption: "Medium — 480px (Figma)" },
  { size: "lg", caption: "Large — 640px" },
];

export function ModalShowcase() {
  const [openSize, setOpenSize] = useState<ModalSize | null>(null);

  return (
    <Row label="Small, medium, large — Escape closes, focus is trapped, the page behind is locked">
      {SIZES.map(({ size, caption }) => (
        <Button key={size} variant="secondary" onClick={() => setOpenSize(size)}>
          {caption}
        </Button>
      ))}

      {SIZES.map(({ size, caption }) => (
        <Modal
          key={size}
          size={size}
          isOpen={openSize === size}
          onClose={() => setOpenSize(null)}
          title="End this tenancy?"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setOpenSize(null)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={() => setOpenSize(null)}>
                End tenancy
              </Button>
            </>
          }
        >
          <p>
            {caption}. Ada Lovelace’s lease at 12 Bode Thomas runs until 30 June
            2027. Ending it now starts the caution-deposit return process and
            notifies the tenant by email.
          </p>
        </Modal>
      ))}
    </Row>
  );
}
