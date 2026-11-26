export type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp';
export type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-accent-strong text-white hover:bg-ink shadow-sm',
  secondary: 'border border-line bg-bg text-ink hover:border-muted hover:bg-surface',
  ghost: 'text-accent-strong hover:bg-accent-soft',
  whatsapp: 'bg-whatsapp text-white hover:bg-whatsapp-hover shadow-sm',
};

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-base',
  lg: 'min-h-13 px-7 text-lg',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}
