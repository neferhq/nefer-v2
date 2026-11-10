import type Lenis from "lenis";

let instance: Lenis | null = null;

/** Called by <SmoothScroll /> so any component can scroll through Lenis. */
export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll to a section by id, via Lenis when it is running and natively otherwise. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (instance) {
    instance.scrollTo(el, { offset: -96, duration: 1.4 });
  } else {
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }
  history.replaceState(null, "", `#${id}`);
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.4 });
  } else {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }
  history.replaceState(null, "", window.location.pathname);
}
