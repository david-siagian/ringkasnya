import { useId } from "react";

interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = "h-11 w-11" }: BrandLogoProps) {
  const gradientId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="9"
          y1="13"
          x2="55"
          y2="49"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      {/* Bentuk Buku Terbuka Tanpa Background */}
      <path
        d="M32 17C25.5 13 15 13 9 16.5V48.5C15 45 25.5 45 32 49C38.5 45 49 45 55 48.5V16.5C49 13 38.5 13 32 17Z"
        stroke={`url(#${gradientId})`}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Lipatan Tengah Buku */}
      <path
        d="M32 17V49"
        stroke={`url(#${gradientId})`}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Baris Halaman Kiri */}
      <path
        d="M16 26H25M16 34H23"
        stroke="#059669"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Simbol Kilat / Intisari Cepat di Halaman Kanan */}
      <path
        d="M44.5 22L38.5 32H43.5L41.5 41L48.5 30.5H43.5L44.5 22Z"
        fill="#0d9488"
      />
    </svg>
  );
}
