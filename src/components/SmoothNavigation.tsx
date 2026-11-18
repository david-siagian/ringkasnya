"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const SCROLL_TARGET_KEY = "ringkasnya_scroll_target";

function scrollToElementSmoothly(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export function SmoothScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let targetId: string | null = null;
    try {
      targetId = sessionStorage.getItem(SCROLL_TARGET_KEY);
      if (targetId) {
        sessionStorage.removeItem(SCROLL_TARGET_KEY);
      }
    } catch {
      // ignore storage errors
    }

    if (!targetId && window.location.hash) {
      targetId = window.location.hash.replace(/^#/, "");
    }

    if (!targetId) return;

    const timer = window.setTimeout(() => {
      scrollToElementSmoothly(targetId as string);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}

interface SmoothHashLinkProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
}

export function SmoothHashLink({
  targetId,
  children,
  className,
}: SmoothHashLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (pathname === "/") {
      scrollToElementSmoothly(targetId);
      window.history.replaceState(null, "", `/#${targetId}`);
      return;
    }

    try {
      sessionStorage.setItem(SCROLL_TARGET_KEY, targetId);
    } catch {
      // ignore storage errors
    }
    router.push("/");
  };

  return (
    <Link href={`/#${targetId}`} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
