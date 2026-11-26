import manifest from '../data/images.generated.json';
import { asset } from '../lib/paths';

type Manifest = { widths: number[]; images: Record<string, { width: number; height: number; ratio: number }> };
const data = manifest as Manifest;

export type PhotoName = string;

type Props = {
  name: PhotoName;
  /** Empty string = decorative image. */
  alt: string;
  /** `sizes` attribute, e.g. "(min-width: 1024px) 50vw, 100vw" */
  sizes: string;
  className?: string;
  /** Load eagerly with high priority (first carousel slide, hero). */
  priority?: boolean;
};

export const hasPhoto = (name: PhotoName) => name in data.images;

/**
 * Responsive WebP image from public/images/photos (see scripts/fetch-images.mjs).
 * If the photo hasn't been downloaded, a clean light surface is shown instead of a broken image.
 */
export function Photo({ name, alt, sizes, className = '', priority = false }: Props) {
  const info = data.images[name];
  if (!info) return <div className={`bg-surface ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} />;
  const widths = data.widths.filter((w) => w <= info.width || w === Math.min(...data.widths));
  const srcSet = widths.map((w) => `${asset(`images/photos/${name}-${w}.webp`)} ${Math.min(w, info.width)}w`).join(', ');
  const mid = widths[Math.min(1, widths.length - 1)] ?? data.widths[0];
  const width = Math.min(mid ?? 960, info.width);
  return (
    <img
      src={asset(`images/photos/${name}-${mid}.webp`)}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={Math.round(width / info.ratio)}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`bg-surface ${className}`}
    />
  );
}

/** URL of a photo at a given width, for <link rel="preload">. */
export function photoUrl(name: PhotoName, width: number) {
  return asset(`images/photos/${name}-${width}.webp`);
}
