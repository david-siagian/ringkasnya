import React, { useEffect, useState } from "react";

const SCROLL_TARGET_KEY = "ringkasnya_scroll_target";
const NAVBAR_OFFSET = 80;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function smoothScrollToY(targetY: number, duration = 680) {
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) return;

  let startTime: number | null = null;

  const step = (timestamp: number) => {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo({
      top: startY + distance * eased,
      behavior: "instant" as ScrollBehavior,
    });

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

export function smoothScrollToElement(id: string, duration = 680) {
  const el = document.getElementById(id);
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  const targetY = Math.max(0, window.scrollY + rect.top - NAVBAR_OFFSET);
  smoothScrollToY(targetY, duration);
  return true;
}

export function SmoothScrollHandler() {
  useEffect(() => {
    if (window.location.pathname !== "/") return;

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
      smoothScrollToElement(targetId as string, 700);
    }, 140);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}

export function PageTransitionWrapper({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsLeaving(false);
    const handlePageShow = () => setIsLeaving(false);
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    const root = document.getElementById("page-transition-root");
    if (!root) return;
    if (isLeaving) {
      root.classList.remove("animate-page-enter", "opacity-100", "translate-y-0");
      root.classList.add("opacity-0", "translate-y-1.5");
    } else {
      root.classList.remove("opacity-0", "translate-y-1.5");
      root.classList.add("animate-page-enter", "opacity-100", "translate-y-0");
    }
  }, [isLeaving]);

  // Intercept internal link clicks in capture phase for smooth exit -> navigate -> enter
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      if (anchor.hasAttribute("download") || anchor.target === "_blank") return;

      const currentPathname = window.location.pathname;
      if (anchor.dataset.smoothHash === "true" && currentPathname === "/") {
        return;
      }

      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      // Same-page hash link
      if (url.pathname === currentPathname && url.hash) {
        e.preventDefault();
        e.stopPropagation();
        const id = url.hash.replace(/^#/, "");
        smoothScrollToElement(id, 680);
        window.history.replaceState(null, "", `${url.pathname}${url.hash}`);
        return;
      }

      // Same exact URL
      if (url.pathname === currentPathname && !url.hash) {
        e.preventDefault();
        e.stopPropagation();
        smoothScrollToY(0, 600);
        return;
      }

      // Route change: fade out smoothly then navigate
      e.preventDefault();
      e.stopPropagation();

      if (url.hash && url.pathname === "/") {
        try {
          sessionStorage.setItem(
            SCROLL_TARGET_KEY,
            url.hash.replace(/^#/, "")
          );
        } catch {
          // ignore
        }
      }

      setIsLeaving(true);
      const destination =
        url.pathname + url.search + (url.pathname === "/" ? "" : url.hash);
      window.setTimeout(() => {
        window.location.assign(destination);
      }, 190);
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () =>
      document.removeEventListener("click", handleDocumentClick, true);
  }, []);

  if (!children) {
    return null;
  }

  return (
    <div
      className={`flex-1 transition-all duration-300 ease-out ${
        isLeaving
          ? "opacity-0 translate-y-1.5"
          : "animate-page-enter opacity-100 translate-y-0"
      }`}
    >
      {children}
    </div>
  );
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
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      return;
    }
    e.preventDefault();
    smoothScrollToElement(targetId, 680);
    window.history.replaceState(null, "", `/#${targetId}`);
  };

  return (
    <a
      href={`/#${targetId}`}
      data-smooth-hash="true"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
