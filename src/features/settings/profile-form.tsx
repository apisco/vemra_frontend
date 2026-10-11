"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileAction } from "@/lib/api/actions/identity";

const panel = "rounded-lg border border-neutral-200 bg-white p-4 md:p-5";

export interface ProfileFormProps {
  displayName: string;
  email: string;
  phone: string;
  handle: string;
}

export function ProfileForm({
  displayName,
  email,
  phone,
  handle,
}: ProfileFormProps) {
  const [name, setName] = useState(displayName);
  const [phoneNumber, setPhoneNumber] = useState(phone);
  const [userHandle, setUserHandle] = useState(handle);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  return (
    <form
      className={panel}
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setError(null);
        setFieldErrors({});
        setIsSaved(false);

        const result = await updateProfileAction({
          displayName: name.trim() === "" ? null : name.trim(),
          phone: phoneNumber.trim() === "" ? null : phoneNumber.trim(),
          handle: userHandle.trim() === "" ? null : userHandle.trim(),
        });

        if (result.ok) {
          setIsSaved(true);
        } else {
          setError(result.message);
          setFieldErrors({ ...(result.fieldErrors ?? {}) });
        }

        setIsSaving(false);
      }}
    >
      <h2 className="font-display text-heading-sm font-semibold text-neutral-900">
        Profile
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Input
          label="Full name"
          name="displayName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.displayName}
          autoComplete="name"
        />
        <Input
          label="Email address"
          name="email"
          type="email"
          value={email}
          readOnly
          disabled
          helperText="Email changes are handled by Vemra support."
        />
        <Input
          label="Phone number"
          name="phone"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          error={fieldErrors.phone}
          autoComplete="tel"
        />
        <Input
          label="Handle"
          name="handle"
          value={userHandle}
          onChange={(event) => setUserHandle(event.target.value)}
          error={fieldErrors.handle}
          autoComplete="off"
        />
      </div>

      <Button
        type="submit"
        size="sm"
        className="mt-4"
        isLoading={isSaving}
        disabled={isSaving}
      >
        Save changes
      </Button>

      <p aria-live="polite" className="mt-3 min-h-5 text-label-sm">
        {error !== null ? (
          <span role="alert" className="text-error-600">
            {error}
          </span>
        ) : isSaved ? (
          <span className="text-success-600">Profile updated</span>
        ) : null}
      </p>
    </form>
  );
}
