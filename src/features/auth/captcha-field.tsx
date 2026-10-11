"use client";

import { useEffect, useRef, useState } from "react";

import {
  CAPTCHA_CONFIG,
  TURNSTILE_SCRIPT_SRC,
} from "@/config/captcha";

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "flexible" | "compact";
}

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: TurnstileRenderOptions,
  ) => string | undefined;
  remove: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onVemraTurnstileLoad?: () => void;
  }
}

const SCRIPT_ID = "vemra-turnstile-script";

function loadScript(): Promise<TurnstileApi | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }
  if (window.turnstile !== undefined) {
    return Promise.resolve(window.turnstile);
  }

  return new Promise((resolve) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing !== null) {
      existing.addEventListener("load", () =>
        resolve(window.turnstile ?? null),
      );
      existing.addEventListener("error", () => resolve(null));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(window.turnstile ?? null));
    script.addEventListener("error", () => resolve(null));
    document.head.appendChild(script);
  });
}

export interface CaptchaFieldProps {
  onToken: (token: string | null) => void;
  error?: string;
}

export function CaptchaField({ onToken, error }: CaptchaFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!CAPTCHA_CONFIG.isEnabled) {
      return;
    }

    let cancelled = false;

    void loadScript().then((api) => {
      if (cancelled || api === undefined || api === null) {
        if (!cancelled) {
          setFailed(true);
        }
        return;
      }
      const container = containerRef.current;
      if (container === null) {
        return;
      }
      widgetRef.current =
        api.render(container, {
          sitekey: CAPTCHA_CONFIG.siteKey,
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => {
            onTokenRef.current(null);
            setFailed(true);
          },
          size: "flexible",
        }) ?? null;
    });

    return () => {
      cancelled = true;
      const api = window.turnstile;
      const widgetId = widgetRef.current;
      if (api !== undefined && widgetId !== null) {
        api.remove(widgetId);
      }
      widgetRef.current = null;
    };
  }, []);

  if (!CAPTCHA_CONFIG.isEnabled) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div ref={containerRef} />
      {failed ? (
        <p role="alert" className="text-label-sm text-error-600">
          The verification challenge could not load. Refresh the page and try
          again.
        </p>
      ) : null}
      {error === undefined ? null : (
        <p role="alert" className="text-label-sm text-error-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function resetCaptcha(): void {
  if (typeof window !== "undefined" && window.turnstile !== undefined) {
    window.turnstile.reset();
  }
}
