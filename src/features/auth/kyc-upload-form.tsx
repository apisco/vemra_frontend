"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useId, useState } from "react";

import { Button, buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createKycUploadGrantAction, submitKycAction } from "@/lib/api/actions/kyc";
import { AuthCard } from "@/features/auth/auth-card";
import { KYC_CHECKS } from "@/features/auth/verification-steps";
import { cn } from "@/lib/cn";
import type { AccountProfile, KycDocumentInput } from "@/types/api/auth";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 60_000;
const ACCEPT = "image/*,application/pdf";

type Phase = "idle" | "uploading" | "submitting" | "done";

interface CloudinaryUpload {
  public_id?: string;
  secure_url?: string;
}

async function uploadToCloudinary(
  file: File,
  checkType: string,
): Promise<string> {
  const grantResult = await createKycUploadGrantAction({
    fileName: file.name,
    contentType: file.type || "application/octet-stream",
    maxSizeBytes: MAX_UPLOAD_BYTES,
  });

  if (!grantResult.ok) {
    throw new Error(grantResult.message);
  }

  const { url, fields } = grantResult.data;
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    body.append(key, value);
  }
  body.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
  }).catch((cause: unknown) => {
    const timedOut =
      cause instanceof DOMException &&
      (cause.name === "TimeoutError" || cause.name === "AbortError");
    throw new Error(
      timedOut
        ? `Upload of ${checkType} timed out. Please try again.`
        : `Upload of ${checkType} could not reach storage. Check your connection and try again.`,
    );
  });

  if (!response.ok) {
    throw new Error(`Upload of ${checkType} failed (${response.status}).`);
  }

  const payload = (await response.json()) as CloudinaryUpload;
  const storagePath = payload.public_id ?? payload.secure_url;
  if (storagePath === undefined || storagePath === "") {
    throw new Error("Upload succeeded but no storage path was returned.");
  }
  return storagePath;
}

export interface KycUploadFormProps {
  account: AccountProfile;
  className?: string;
  skipHref: string;
}

export function KycUploadForm({ account, className, skipHref }: KycUploadFormProps) {
  const router = useRouter();
  const groupId = useId();
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nin, setNin] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);

  const isBusy = phase === "uploading" || phase === "submitting";
  const hasRequiredFile = files.IDENTITY !== undefined && files.IDENTITY !== null;

  const setFile = (checkType: string, file: File | null) => {
    setFiles((current) => ({ ...current, [checkType]: file }));
  };

  const handleSubmit = async () => {
    setError(null);

    const selected = KYC_CHECKS.map((check) => ({
      checkType: check.checkType,
      file: files[check.checkType] ?? null,
    })).filter(
      (entry): entry is { checkType: string; file: File } => entry.file !== null,
    );

    if (selected.length === 0) {
      setError("Attach at least your identity document to continue.");
      return;
    }

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      nin.trim() === "" ||
      dob.trim() === "" ||
      address.trim() === ""
    ) {
      setError(
        "Fill in your first name, last name, NIN (VNIN), date of birth and current address.",
      );
      return;
    }

    const tooLarge = selected.find((entry) => entry.file.size > MAX_UPLOAD_BYTES);
    if (tooLarge !== undefined) {
      setError(
        `${tooLarge.file.name} is larger than 5 MB. Choose a smaller file.`,
      );
      return;
    }

    try {
      setPhase("uploading");
      const documents: KycDocumentInput[] = await Promise.all(
        selected.map(async (entry) => ({
          checkType: entry.checkType,
          storagePath: await uploadToCloudinary(entry.file, entry.checkType),
        })),
      );

      setPhase("submitting");
      const claims: Record<string, string> = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nin: nin.trim(),
        dateOfBirth: dob.trim(),
        currentAddress: address.trim(),
      };
      const trimmedMiddleName = middleName.trim();
      if (trimmedMiddleName !== "") {
        claims.middleName = trimmedMiddleName;
      }
      const result = await submitKycAction({
        documents,
        claims,
      });

      if (!result.ok) {
        setError(result.message);
        setPhase("idle");
        return;
      }

      setPhase("done");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
      setPhase("idle");
    }
  };

  if (phase === "done") {
    return (
      <AuthCard variant="checklist" className={className}>
        <p className="text-body-md font-semibold text-neutral-900">
          Submission received
        </p>
        <p className="text-body-sm text-neutral-700">
          We&apos;re reviewing your documents. You can close this page — we&apos;ll
          email you when it&apos;s done.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard variant="details" className={className}>
      <div className="flex flex-col gap-1">
        <p className="text-label-lg font-semibold text-neutral-900">
          Upload your documents
        </p>
        {account.onboarding.applicantMessage ? (
          <p className="text-body-sm text-neutral-700">
            {account.onboarding.applicantMessage}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="First name" name="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} disabled={isBusy} />
        <Input label="Middle name (optional)" name="middleName" value={middleName} onChange={(event) => setMiddleName(event.target.value)} disabled={isBusy} />
        <Input label="Last name" name="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} disabled={isBusy} />
        <Input label="NIN (VNIN)" name="nin" inputMode="numeric" placeholder="12345678901" value={nin} onChange={(event) => setNin(event.target.value)} disabled={isBusy} />
        <Input label="Date of birth" name="dob" type="date" value={dob} onChange={(event) => setDob(event.target.value)} disabled={isBusy} />
        <Input label="Current address" name="address" value={address} onChange={(event) => setAddress(event.target.value)} disabled={isBusy} />
      </div>

      {KYC_CHECKS.map((check) => {
        const inputId = `${groupId}-${check.checkType}`;
        const file = files[check.checkType] ?? null;
        return (
          <div key={check.checkType} className="flex flex-col gap-2">
            <label
              htmlFor={inputId}
              className="text-label-md font-semibold text-neutral-800"
            >
              {check.title}
            </label>
            <p className="text-label-sm text-neutral-700">{check.description}</p>
            <input
              id={inputId}
              name={check.checkType}
              type="file"
              accept={ACCEPT}
              disabled={isBusy}
              onChange={(event) =>
                setFile(check.checkType, event.target.files?.[0] ?? null)
              }
              className={cn(
                "w-full rounded-md border border-neutral-200 bg-white p-2 text-body-sm text-neutral-800",
                "file:mr-3 file:rounded-sm file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-label-sm file:font-semibold file:text-neutral-900",
                "focus:border-brand-700 focus:outline-1 focus:outline-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-50",
              )}
            />
            {file ? (
              <p className="text-label-sm text-neutral-700">{file.name}</p>
            ) : null}
          </div>
        );
      })}

      <Button
        type="button"
        fullWidth
        isLoading={isBusy}
        disabled={!hasRequiredFile}
        onClick={handleSubmit}
      >
        {phase === "uploading"
          ? "Uploading documents…"
          : phase === "submitting"
            ? "Submitting for review…"
            : "Submit for review"}
      </Button>

      <Link
        href={skipHref}
        className={buttonClasses({ variant: "secondary", fullWidth: true })}
      >
        Skip for now
      </Link>

      {error ? (
        <p role="alert" className="text-center text-label-sm text-error-600">
          {error}
        </p>
      ) : null}
    </AuthCard>
  );
}
