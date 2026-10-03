"use client";

import { useCallback, useState } from "react";
import type { FormEvent } from "react";

export type AuthFormValues = Record<string, string | boolean>;

export type AuthFormErrors<TValues extends AuthFormValues> = Partial<
  Record<keyof TValues, string>
>;

export type AuthFormStatus = "idle" | "submitting" | "submitted";

export interface UseAuthFormOptions<TValues extends AuthFormValues> {
  initialValues: TValues;
  validate?: (values: TValues) => AuthFormErrors<TValues>;
  onSubmit?: (values: TValues) => void | Promise<void>;
}

export interface AuthForm<TValues extends AuthFormValues> {
  values: TValues;
  status: AuthFormStatus;
  isSubmitting: boolean;
  isSubmitted: boolean;
  setValue: <TKey extends keyof TValues>(
    field: TKey,
    value: TValues[TKey],
  ) => void;
  errorFor: (field: keyof TValues) => string | undefined;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  reset: () => void;
}

export function useAuthForm<TValues extends AuthFormValues>({
  initialValues,
  validate,
  onSubmit,
}: UseAuthFormOptions<TValues>): AuthForm<TValues> {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<AuthFormErrors<TValues>>({});
  const [hasAttempted, setHasAttempted] = useState(false);
  const [status, setStatus] = useState<AuthFormStatus>("idle");
  const setValue = useCallback(
    <TKey extends keyof TValues>(field: TKey, value: TValues[TKey]) => {
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => {
        if (current[field] === undefined) {
          return current;
        }
        const next = { ...current };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setHasAttempted(true);

      const nextErrors = validate ? validate(values) : {};
      setErrors(nextErrors);

      if (Object.values(nextErrors).some((message) => message !== undefined)) {
        setStatus("idle");
        return;
      }

      setStatus("submitting");
      try {
        await onSubmit?.(values);
        setStatus("submitted");
      } catch {
        setStatus("idle");
      }
    },
    [onSubmit, validate, values],
  );

  const errorFor = useCallback(
    (field: keyof TValues) => (hasAttempted ? errors[field] : undefined),
    [errors, hasAttempted],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setHasAttempted(false);
    setStatus("idle");
  }, [initialValues]);

  return {
    values,
    status,
    isSubmitting: status === "submitting",
    isSubmitted: status === "submitted",
    setValue,
    errorFor,
    handleSubmit,
    reset,
  };
}
