import type { ReactNode } from 'react';

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  align?: 'start' | 'center';
  as?: 'h1' | 'h2';
  id?: string;
  className?: string;
};

export function SectionHeading({ title, subtitle, eyebrow, align = 'start', as: Tag = 'h2', id, className = '' }: Props) {
  const center = align === 'center' ? 'text-center mx-auto' : 'text-start';
  const size = Tag === 'h1' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl lg:text-5xl';
  return (
    <div className={`max-w-3xl ${center} ${className}`}>
      {eyebrow && <p className="mb-3 text-sm font-semibold text-accent-strong">{eyebrow}</p>}
      <Tag id={id} className={`${size} font-bold tracking-tight`}>
        {title}
      </Tag>
      {subtitle && <p className="mt-4 text-lg text-muted sm:text-xl">{subtitle}</p>}
    </div>
  );
}
