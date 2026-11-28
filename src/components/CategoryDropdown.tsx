import { useState, useRef, useEffect, useId, type KeyboardEvent } from "react";
import type { BookCategory } from "@/types/book";
import { Check, ChevronDown } from "lucide-react";

export interface CategoryOption {
  value: BookCategory | "Semua";
  label: string;
  count: number;
}

interface CategoryDropdownProps {
  options: CategoryOption[];
  selectedValue: BookCategory | "Semua";
  onSelect: (value: BookCategory | "Semua") => void;
  listboxAriaLabel?: string;
  className?: string;
}

export default function CategoryDropdown({
  options,
  selectedValue,
  onSelect,
  listboxAriaLabel = "Daftar kategori buku",
  className = "min-w-0 flex-1 sm:flex-initial sm:min-w-[260px]",
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listboxId = useId();

  const isPlaceholder = false;
  const selectedIndex = options.findIndex((opt) => opt.value === selectedValue);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [isOpen, highlightedIndex]);

  const openDropdown = (initialIndex?: number) => {
    setIsOpen(true);
    setHighlightedIndex(
      initialIndex !== undefined
        ? initialIndex
        : selectedIndex >= 0
          ? selectedIndex
          : 0
    );
  };

  const selectOption = (value: BookCategory | "Semua") => {
    onSelect(value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (options.length === 0) return;

    switch (event.key) {
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
          buttonRef.current?.focus();
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          openDropdown(selectedIndex >= 0 ? selectedIndex : 0);
        } else {
          setHighlightedIndex((prev) => (prev + 1) % options.length);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          openDropdown(selectedIndex >= 0 ? selectedIndex : options.length - 1);
        } else {
          setHighlightedIndex(
            (prev) => (prev - 1 + options.length) % options.length
          );
        }
        break;
      case "Home":
        if (isOpen) {
          event.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      case "End":
        if (isOpen) {
          event.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        if (isOpen && highlightedIndex >= 0 && options[highlightedIndex]) {
          event.preventDefault();
          selectOption(options[highlightedIndex].value);
        }
        break;
      case "Tab":
        if (isOpen) {
          setIsOpen(false);
        }
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative ${className}`}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label="Filter kategori"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-surface px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
          isOpen
            ? `border-emerald-500 ring-2 ring-emerald-500/20 ${
                isPlaceholder ? "text-ink-muted" : "text-ink"
              }`
            : isPlaceholder
              ? "border-line text-ink-muted hover:border-line-strong hover:bg-page"
              : "border-line-strong text-ink hover:border-accent-line hover:bg-page/60"
        }`}
      >
        {selectedOption ? (
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate">{selectedOption.label}</span>
            <span className="shrink-0 rounded-full bg-surface-subtle px-2 py-0.5 text-[11px] font-semibold text-ink-subtle">
              {selectedOption.count}
            </span>
          </span>
        ) : (
          <span className="truncate text-ink-muted">Pilih Kategori...</span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-subtle transition-transform duration-200 ${
            isOpen ? "rotate-180 text-accent-strong" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={listboxAriaLabel}
          className="animate-fade-slide absolute left-0 top-full z-40 mt-2 w-full min-w-[260px] overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-xl shadow-slate-900/10 dark:shadow-black/40"
        >
          <div className="max-h-72 space-y-0.5 overflow-y-auto">
            {options.map((option, index) => {
              const isSelected = option.value === selectedValue;
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectOption(option.value)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs sm:text-sm transition-colors ${
                    isSelected
                      ? "bg-accent-soft font-semibold text-accent-text"
                      : isHighlighted
                        ? "bg-surface-subtle font-medium text-ink"
                        : "font-medium text-ink-secondary hover:bg-surface-subtle hover:text-ink"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isSelected
                          ? "bg-accent-tint/80 text-accent-text"
                          : "bg-surface-subtle text-ink-subtle"
                      }`}
                    >
                      {option.count}
                    </span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-accent-strong" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
