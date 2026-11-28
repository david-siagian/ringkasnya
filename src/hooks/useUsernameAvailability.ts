import { useEffect, useState } from "react";
import { validateUsername } from "@/lib/auth-helpers";

export type UsernameAvailabilityStatus =
  | "idle"
  | "invalid"
  | "checking"
  | "available"
  | "taken";

interface UseUsernameAvailabilityOptions {
  enabled?: boolean;
  currentUsername?: string | null;
  debounceMs?: number;
}

export function useUsernameAvailability(
  value: string,
  options: UseUsernameAvailabilityOptions = {}
) {
  const { enabled = true, currentUsername = null, debounceMs = 450 } = options;
  const [status, setStatus] = useState<UsernameAvailabilityStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = value.trim().replace(/^@+/, "");
    if (!enabled || !trimmed) {
      setStatus("idle");
      setMessage(null);
      return;
    }

    if (
      currentUsername &&
      trimmed.toLowerCase() === currentUsername.trim().replace(/^@+/, "").toLowerCase()
    ) {
      setStatus("idle");
      setMessage(null);
      return;
    }

    const check = validateUsername(trimmed);
    if (!check.valid) {
      setStatus("invalid");
      setMessage(check.error || "Format username tidak valid.");
      return;
    }

    const controller = new AbortController();
    setStatus("checking");
    setMessage("Memeriksa ketersediaan...");

    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/account/check-username?u=${encodeURIComponent(check.normalized)}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          setStatus("idle");
          setMessage(null);
          return;
        }
        const data = (await res.json()) as {
          valid?: boolean;
          available?: boolean;
          error?: string;
        };
        if (controller.signal.aborted) return;

        if (!data.valid) {
          setStatus("invalid");
          setMessage(data.error || "Format username tidak valid.");
        } else if (data.available) {
          setStatus("available");
          setMessage("Username tersedia.");
        } else {
          setStatus("taken");
          setMessage(data.error || "Username ini sudah digunakan.");
        }
      } catch (error) {
        if ((error as { name?: string }).name === "AbortError") return;
        setStatus("idle");
        setMessage(null);
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value, enabled, currentUsername, debounceMs]);

  return { status, message };
}
