"use client";

import { useState } from "react";

import { updateNotificationPreferencesAction } from "@/lib/api/actions/engagement";
import type { NotificationPreferences } from "@/lib/api/schemas";

const TOGGLES = [
  {
    key: "emailEnabled",
    label: "Email notifications",
    description: "Rent reminders, application updates and account notices by email.",
  },
  {
    key: "inAppEnabled",
    label: "In-app notifications",
    description: "Updates in your Vemra notification inbox.",
  },
] as const satisfies readonly {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
}[];

export interface NotificationPreferencesFormProps {
  preferences: NotificationPreferences;
}

export function NotificationPreferencesForm({
  preferences,
}: NotificationPreferencesFormProps) {
  const [emailEnabled, setEmailEnabled] = useState(preferences.emailEnabled);
  const [inAppEnabled, setInAppEnabled] = useState(preferences.inAppEnabled);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const values = { emailEnabled, inAppEnabled };

  const persist = async (next: {
    emailEnabled: boolean;
    inAppEnabled: boolean;
  }) => {
    setIsSaving(true);
    setError(null);

    const result = await updateNotificationPreferencesAction(
      next.emailEnabled,
      next.inAppEnabled,
    );

    if (result.ok) {
      setIsSaved(true);
    } else {
      setEmailEnabled(preferences.emailEnabled);
      setInAppEnabled(preferences.inAppEnabled);
      setIsSaved(false);
      setError(result.message);
    }

    setIsSaving(false);
  };

  return (
    <section className="flex flex-col gap-1 rounded-lg border border-neutral-200 bg-white p-4 md:p-5">
      <div className="divide-y divide-neutral-100">
        {TOGGLES.map((toggle) => {
          const isOn = values[toggle.key] as boolean;

          return (
            <div
              key={toggle.key}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-body-sm font-semibold text-neutral-900">
                  {toggle.label}
                </p>
                <p className="text-body-sm text-neutral-700">
                  {toggle.description}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isOn}
                aria-label={toggle.label}
                disabled={isSaving}
                onClick={() => {
                  const next =
                    toggle.key === "emailEnabled"
                      ? { emailEnabled: !isOn, inAppEnabled }
                      : { emailEnabled, inAppEnabled: !isOn };
                  setEmailEnabled(next.emailEnabled);
                  setInAppEnabled(next.inAppEnabled);
                  void persist(next);
                }}
                className={`relative h-5 w-8 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
                  isOn ? "bg-brand-700" : "bg-neutral-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
                    isOn ? "translate-x-3.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <p aria-live="polite" className="min-h-5 text-label-sm">
        {error !== null ? (
          <span role="alert" className="text-error-600">
            {error}
          </span>
        ) : isSaving ? (
          <span className="text-neutral-700">Saving…</span>
        ) : isSaved ? (
          <span className="text-success-600">Saved</span>
        ) : null}
      </p>
    </section>
  );
}
