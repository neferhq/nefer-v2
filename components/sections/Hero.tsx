"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { PALETTE } from "@/lib/palette";
import { disciplines, site } from "@/lib/site";
import { scrollToId } from "@/lib/scroll";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The one orchestrated moment on the page: headline lines rise out of a mask, then the rest settles in. */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.25 } },
};

const rise: Variants = {
  hidden: { y: "112%" },
  show: { y: "0%", transition: { duration: 0.95, ease: EASE } },
};

const settle: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const HEADLINE = [
  { text: "Digital products", gradient: false },
  { text: "designed sharp,", gradient: false },
  { text: "built to ship.", gradient: true },
] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // The light beam dims as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const beamOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center px-4 pb-20 pt-32 sm:px-6"
    >
      <HeroBeam opacity={beamOpacity} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-6xl"
      >
        <motion.div variants={settle}>
          <AvailabilityBadge />
        </motion.div>

        <h1 className="mt-8 font-display text-[clamp(2.5rem,8.4vw,7.25rem)] font-semibold leading-[0.96] tracking-[-0.035em]">
          {HEADLINE.map((line) => (
            // Padding keeps descenders from being cut by the mask; the negative margin gives it back.
            <span key={line.text} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
              <motion.span variants={rise} className="block">
                <span className={line.gradient ? "gradient-text" : undefined}>{line.text}</span>
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          variants={settle}
          className="mt-8 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl dark:text-slate-400"
        >
          Defying the ordinary. NEFER shapes ideas into digital artifacts-sharp, deliberate, and undeniably alive.{site.brand}
          {site.tld}.
        </motion.p>

        <motion.div variants={settle} className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Button href="#projects" size="lg">
              Explore work
              <ArrowDown className="size-[18px]" aria-hidden="true" />
            </Button>
          </Magnetic>
          <Button href="#contact" variant="secondary" size="lg">
            Get in touch
          </Button>
        </motion.div>

        <motion.ul
          variants={settle}
          aria-label="Disciplines"
          className="mt-16 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600 dark:text-slate-400"
        >
          {disciplines.map((d) => (
            <li key={d.label} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{
                  backgroundColor: PALETTE[d.accent],
                  boxShadow: `0 0 12px ${PALETTE[d.accent]}99`,
                }}
              />
              {d.label}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}

/** Pill with a live dot. Hover or focus swaps the label; the wider label sets the width, so nothing jumps. */
function AvailabilityBadge() {
  return (
    <button
      type="button"
      onClick={() => scrollToId("contact")}
      className="group glass inline-flex items-center gap-3 rounded-full py-2 pl-3.5 pr-5 text-sm text-slate-700 transition-colors hover:bg-white/80 dark:text-slate-200 dark:hover:bg-white/10"
    >
      <span className="relative flex size-2.5" aria-hidden="true">
        <span className="absolute inset-0 animate-ping-soft rounded-full bg-brand-emerald motion-reduce:hidden" />
        <span className="relative size-2.5 rounded-full bg-brand-emerald shadow-[0_0_10px_#10B981]" />
      </span>
      <span className="grid">
        <span className="col-start-1 row-start-1 transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-0 group-focus-visible:-translate-y-1 group-focus-visible:opacity-0">
          {site.availability.label}
        </span>
        <span
          aria-hidden="true"
          className="col-start-1 row-start-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          {site.availability.hoverLabel}
        </span>
      </span>
    </button>
  );
}

/** Soft cone of light from the top edge plus a thin lamp line, tinted with the palette. */
function HeroBeam({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 top-0 h-[85%] overflow-hidden"
    >
      <div
        className="absolute left-1/2 top-[-12%] h-[120%] w-[150%] -translate-x-1/2 opacity-[0.28] blur-3xl dark:opacity-60 dark:mix-blend-screen"
        style={{
          backgroundImage: `conic-gradient(from 152deg at 50% 0%, transparent 0deg, ${PALETTE.emerald}66 10deg, ${PALETTE.blue}55 22deg, ${PALETTE.violet}66 34deg, ${PALETTE.crimson}33 44deg, transparent 56deg)`,
          maskImage: "radial-gradient(ellipse 60% 100% at 50% 0%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 100% at 50% 0%, black 30%, transparent 85%)",
        }}
      />
      <div className="absolute left-1/2 top-0 h-px w-[min(46rem,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-emerald to-transparent opacity-70 shadow-[0_0_28px_6px_rgb(16_185_129/0.35)]" />
    </motion.div>
  );
}
