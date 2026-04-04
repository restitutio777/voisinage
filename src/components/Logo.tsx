interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left person — head */}
      <circle cx="16" cy="12" r="5.5" fill="#45897c" />
      {/* Left person — body */}
      <rect x="10" y="19" width="12" height="19" rx="6" fill="#45897c" />

      {/* Right person — head */}
      <circle cx="32" cy="12" r="5.5" fill="#2d5a53" />
      {/* Right person — body */}
      <rect x="26" y="19" width="12" height="19" rx="6" fill="#2d5a53" />

      {/* Connection — warm accent where they meet */}
      <circle cx="24" cy="26" r="4" fill="#e8874a" />
    </svg>
  );
}
