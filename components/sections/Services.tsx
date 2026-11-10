"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { PALETTE } from "@/lib/palette";
import { packages, site, trustPoints } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Services() {
  const [openId, setOpenId] = useState<string>(packages[0].id);
  const current = packages.find((p) => p.id === openId) ?? packages[0];
  const accent = PALETTE[current.accent];

  return (
    <section id="services" className="relative scroll-mt-24 px-4 py-24 sm:px-6 lg:py-36">
      <div className="glass relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-14">
        {/* Aura behind the panel takes the colour of the package that is open. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 size-[28rem] rounded-full opacity-25 blur-[110px] transition-[background-color] duration-700 dark:opacity-30"
          style={{ backgroundColor: accent }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 size-[22rem] rounded-full opacity-15 blur-[110px] dark:opacity-20"
          style={{ backgroundColor: PALETTE.violet }}
        />

        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Pitch */}
          <div className="lg:col-span-5">
            <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Let&rsquo;s build together.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              {site.brand}
              {site.tld} is my freelance studio for web development and UI/UX design. You work with
              one person, talk directly, and get a launch date you can plan around.
            </p>

            <ul className="mt-8 space-y-4">
              {trustPoints.map((point, i) => {
                const color = Object.values(PALETTE)[i % 4];
                return (
                  <li key={point} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full"
                      style={{ backgroundColor: `${color}26`, color }}
                    >
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                );
              })}
            </ul>

            <div className="mt-10">
              <Magnetic className="inline-block">
                <Button href={site.businessUrl} size="lg">
                  Start a project with {site.brand}
                  {site.tld}
                  <ArrowUpRight className="size-[18px]" aria-hidden="true" />
                </Button>
              </Magnetic>
            </div>
          </div>

          {/* Packages */}
          <ul className="space-y-3 lg:col-span-7" aria-label="Service packages">
            {packages.map((pkg) => {
              const isOpen = pkg.id === openId;
              const color = PALETTE[pkg.accent];
              const panelId = `package-${pkg.id}`;

              return (
                <li key={pkg.id}>
                  <SpotlightCard
                    color={color}
                    size={360}
                    className={cn(
                      "rounded-2xl border transition-[border-color,background-color] duration-500",
                      isOpen
                        ? "bg-white/70 dark:bg-white/[0.05]"
                        : "border-slate-900/10 bg-white/30 hover:bg-white/60 dark:border-white/10 dark:bg-transparent dark:hover:bg-white/[0.03]",
                    )}
                    style={{ borderColor: isOpen ? `${color}80` : undefined } as CSSProperties}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(pkg.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                    >
                      <span
                        aria-hidden="true"
                        className="size-3 shrink-0 rounded-full transition-shadow duration-500"
                        style={{
                          backgroundColor: color,
                          boxShadow: isOpen ? `0 0 18px 2px ${color}aa` : `0 0 0 0 ${color}00`,
                        }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-xl font-semibold tracking-tight sm:text-2xl">
                          {pkg.title}
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-slate-600 dark:text-slate-400">
                          {pkg.tagline}
                        </span>
                      </span>
                      <span className="hidden shrink-0 rounded-full border border-slate-900/10 px-3 py-1 text-xs text-slate-600 sm:block dark:border-white/10 dark:text-slate-400">
                        {pkg.timeline}
                      </span>
                      <Plus
                        aria-hidden="true"
                        className={cn(
                          "size-5 shrink-0 text-slate-500 transition-transform duration-500 dark:text-slate-400",
                          isOpen && "rotate-[135deg]",
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-label={`${pkg.title} scope`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 sm:px-6">
                            <p className="mb-4 text-sm text-slate-600 sm:hidden dark:text-slate-400">
                              Typical timeline: {pkg.timeline}
                            </p>
                            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                              {pkg.scope.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2.5 text-[15px] leading-snug text-slate-700 dark:text-slate-300"
                                >
                                  <Check
                                    aria-hidden="true"
                                    className="mt-0.5 size-4 shrink-0"
                                    style={{ color }}
                                    strokeWidth={2.5}
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SpotlightCard>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
