import type { ElementType, ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

type Props = { as?: ElementType; className?: string; children: ReactNode; id?: string; 'aria-labelledby'?: string };

/** Section wrapper that fades in and moves up slightly when it enters the viewport. */
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }: Props) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
