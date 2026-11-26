import type { LucideIcon } from 'lucide-react';

type IconProps = {
  icon: LucideIcon;
  /** Only two sizes are allowed by the design system. */
  size?: 20 | 24;
  className?: string;
  /** Directional icons (arrows, chevrons) mirror in RTL. */
  directional?: boolean;
};

/** Decorative icon: always aria-hidden. Give the surrounding button/link an accessible label. */
export function Icon({ icon: Glyph, size = 20, className = '', directional = false }: IconProps) {
  return (
    <Glyph
      size={size}
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${directional ? 'rtl:-scale-x-100' : ''} ${className}`}
    />
  );
}
