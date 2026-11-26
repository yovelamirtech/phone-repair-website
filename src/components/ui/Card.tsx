import type { ElementType, ReactNode } from 'react';

type Props = { as?: ElementType; className?: string; lift?: boolean; children: ReactNode };

export function Card({ as: Tag = 'div', className = '', lift = false, children }: Props) {
  return <Tag className={`card ${lift ? 'card-lift' : ''} ${className}`}>{children}</Tag>;
}
