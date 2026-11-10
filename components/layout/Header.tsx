"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navLinks, site } from "@/lib/site";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const links = useMemo(() => navLinks.filter((l) => l.ready), []);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Reading progress, drawn as a hairline along the bottom edge of the pill.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Highlight the link of whichever section is crossing the middle of the viewport.
  useEffect(() => {
    const targets = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [links]);

  // Close the mobile menu on Escape or when the viewport grows past the breakpoint.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <motion.nav
        aria-label="Primary"
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className={cn(
          "glass relative flex w-full max-w-3xl items-center justify-between rounded-full py-2 pl-5 pr-2 transition-[background-color,box-shadow] duration-500",
          scrolled && "bg-white/80 dark:bg-ink/70",
        )}
      >
        <a
          href="#top"
          aria-label={`${site.brand}, back to top`}
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            scrollToTop();
          }}
          className="rounded-full"
        >
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.id);
                }}
                aria-current={active === link.id ? "true" : undefined}
                className={cn(
                  "relative block rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  active === link.id
                    ? "text-ink dark:text-white"
                    : "text-slate-600 hover:text-ink dark:text-slate-400 dark:hover:text-white",
                )}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-slate-900/[0.07] dark:bg-white/10"
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="hidden sm:block">
            <Button href={site.businessUrl} size="sm" className="gap-1.5">
              Start a project
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full text-slate-700 hover:bg-slate-900/5 md:hidden dark:text-slate-300 dark:hover:bg-white/10"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="pointer-events-none absolute inset-x-8 -bottom-px h-px origin-left bg-gradient-to-r from-brand-emerald via-brand-violet to-brand-crimson"
        />

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="glass absolute left-0 right-0 top-full mt-2 origin-top rounded-3xl bg-white/90 p-2 md:hidden dark:bg-ink/90"
            >
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(link.id);
                      }}
                      className={cn(
                        "block rounded-2xl px-4 py-3 font-display text-lg",
                        active === link.id
                          ? "bg-slate-900/[0.06] dark:bg-white/10"
                          : "hover:bg-slate-900/5 dark:hover:bg-white/5",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="p-2 pt-3 sm:hidden">
                <Button href={site.businessUrl} className="w-full" size="md">
                  Start a project with {site.brand}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
