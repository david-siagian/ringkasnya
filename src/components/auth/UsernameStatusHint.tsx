import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { UsernameAvailabilityStatus } from "@/hooks/useUsernameAvailability";

interface UsernameStatusHintProps {
  status: UsernameAvailabilityStatus;
  message: string | null;
  fallbackHint?: string;
}

export default function UsernameStatusHint({
  status,
  message,
  fallbackHint,
}: UsernameStatusHintProps) {
  if (status === "idle") {
    return fallbackHint ? (
      <p className="mt-1.5 text-xs text-ink-subtle">{fallbackHint}</p>
    ) : null;
  }

  if (status === "checking") {
    return (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
        <span>{message || "Memeriksa ketersediaan..."}</span>
      </p>
    );
  }

  if (status === "available") {
    return (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span>{message || "Username tersedia."}</span>
      </p>
    );
  }

  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{message || "Username tidak tersedia."}</span>
    </p>
  );
}
