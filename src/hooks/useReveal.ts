import { useEffect, useRef } from 'react';

/**
 * Adds `is-visible` to the element (which should carry the `reveal` class) the first time
 * it scrolls into view. With prefers-reduced-motion the CSS shows it immediately.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Fires once when the element comes near the viewport (used to lazy-load the map). */
export function useNearViewport<T extends HTMLElement>(onNear: () => void, rootMargin = '200px') {
  const ref = useRef<T>(null);
  const cb = useRef(onNear);
  useEffect(() => {
    cb.current = onNear;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      cb.current();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          cb.current();
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}
