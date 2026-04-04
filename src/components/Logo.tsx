interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left person */}
      <circle cx="23" cy="15" r="6.5" fill="#45897c" />
      <path
        d="M14 52 C14 38, 18 28, 23 23 C28 28, 31 38, 31 52"
        fill="#45897c"
      />
      {/* Right person */}
      <circle cx="41" cy="15" r="6.5" fill="#2a9d8f" />
      <path
        d="M33 52 C33 38, 36 28, 41 23 C46 28, 50 38, 50 52"
        fill="#2a9d8f"
      />
      {/* Connection — warm dot where bodies overlap */}
      <circle cx="32" cy="40" r="4.5" fill="#e8874a" />
    </svg>
  );
}
