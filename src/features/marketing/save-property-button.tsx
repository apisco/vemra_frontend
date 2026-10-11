"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { saveProperty } from "@/lib/api/actions/properties";

export interface SavePropertyButtonProps {
  propertyId: string;
}

export function SavePropertyButton({ propertyId }: SavePropertyButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        fullWidth
        isLoading={isPending}
        disabled={isPending || isSaved}
        onClick={async () => {
          setIsPending(true);
          setError(null);

          const result = await saveProperty(propertyId);

          if (result.ok) {
            setIsSaved(true);
          } else {
            setError(result.message);
          }

          setIsPending(false);
        }}
      >
        {isSaved ? "Saved" : "Save this home"}
      </Button>
      {error === null ? null : (
        <p role="alert" className="text-center text-caption text-error-600">
          {error}
        </p>
      )}
    </div>
  );
}
