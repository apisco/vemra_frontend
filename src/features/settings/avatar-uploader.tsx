"use client";

import { useCallback, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createAvatarTicketAction } from "@/lib/api/actions/media";
import { removeAvatarAction, setAvatarAction } from "@/lib/api/actions/identity";
import { acceptAttribute, describeLimits } from "@/lib/media/scopes";
import { useMediaUpload } from "@/lib/media/use-media-upload";

const panel = "rounded-lg border border-neutral-200 bg-white p-4 md:p-5";

export interface AvatarUploaderProps {
  name: string;
  initials: string;
  avatarUrl: string | null;
}

/**
 * The three-step avatar flow from the media guide: request a ticket, upload
 * straight to Cloudinary, then record the delivery URL on the profile.
 */
export function AvatarUploader({
  name,
  initials,
  avatarUrl,
}: AvatarUploaderProps) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState(avatarUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const requestTicket = useCallback(
    (file: File) =>
      createAvatarTicketAction({
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
      }),
    [],
  );
  const upload = useMediaUpload("AVATARS", requestTicket);

  const isBusy = upload.isUploading || isSaving || isRemoving;
  const problem = error ?? upload.error;

  const clearInput = () => {
    if (inputRef.current !== null) {
      inputRef.current.value = "";
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSavedAt(null);

    const asset = await upload.upload(file);
    if (asset === null) {
      clearInput();
      return;
    }

    setIsSaving(true);
    const saved = await setAvatarAction(asset.url);
    setIsSaving(false);
    clearInput();

    if (!saved.ok) {
      setError(saved.message);
      return;
    }

    setCurrent(saved.data.avatarUrl ?? asset.url);
    setSavedAt("Profile photo updated");
    router.refresh();
  };

  const handleRemove = async () => {
    setError(null);
    setSavedAt(null);
    upload.reset();
    setIsRemoving(true);

    const removed = await removeAvatarAction();
    setIsRemoving(false);

    if (!removed.ok) {
      setError(removed.message);
      return;
    }

    setCurrent(null);
    setSavedAt("Profile photo removed");
    router.refresh();
  };

  return (
    <section className={panel} aria-labelledby={`${inputId}-heading`}>
      <h2
        id={`${inputId}-heading`}
        className="font-display text-heading-sm font-semibold text-neutral-900"
      >
        Profile photo
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Avatar
          name={name}
          src={current ?? undefined}
          initials={initials}
          size="lg"
          className="size-16"
        />

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={isBusy}
              isLoading={upload.isUploading || isSaving}
              onClick={() => inputRef.current?.click()}
            >
              {current === null ? "Upload a photo" : "Replace photo"}
            </Button>

            {current === null ? null : (
              <Button
                size="sm"
                variant="ghost"
                disabled={isBusy}
                isLoading={isRemoving}
                onClick={handleRemove}
              >
                Remove
              </Button>
            )}
          </div>

          <p className="text-label-sm text-neutral-700">
            {describeLimits("AVATARS")}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={acceptAttribute("AVATARS")}
        className="sr-only"
        disabled={isBusy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file !== undefined) {
            void handleFile(file);
          }
        }}
      />

      <p aria-live="polite" className="mt-3 min-h-5 text-label-sm">
        {problem !== null ? (
          <span role="alert" className="text-error-600">
            {problem}
          </span>
        ) : upload.isUploading ? (
          <span className="text-brand-700">Uploading {upload.progress}%</span>
        ) : isSaving ? (
          <span className="text-neutral-700">Saving…</span>
        ) : savedAt !== null ? (
          <span className="text-success-600">{savedAt}</span>
        ) : null}
      </p>
    </section>
  );
}
