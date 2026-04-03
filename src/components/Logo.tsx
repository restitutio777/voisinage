import { Handshake } from 'lucide-react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <Handshake
      size={size}
      className={className}
      strokeWidth={2}
      color="#45897c"
    />
  );
}
