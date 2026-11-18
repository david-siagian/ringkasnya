interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = "h-9 w-9" }: BrandLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ringkasnyaLogoBg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#ringkasnyaLogoBg)" />
      {/* Layered distilled book pages */}
      <path
        d="M17 20C17 17.7909 18.7909 16 21 16H36C38.2091 16 40 17.7909 40 20V46L28.5 39.5L17 46V20Z"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      {/* Bookmark / condensed spine accent */}
      <path
        d="M23 23H34M23 29H31"
        stroke="#059669"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Bright insight spark */}
      <path
        d="M47 13L49.2 18.8L55 21L49.2 23.2L47 29L44.8 23.2L39 21L44.8 18.8L47 13Z"
        fill="#FCD34D"
      />
    </svg>
  );
}
