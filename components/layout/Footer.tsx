"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";

import { PALETTE } from "@/lib/palette";
import { site, socials } from "@/lib/site";

/** Compact contact block. The full contact form lands in the next pass; this already works on its own. */
export function Footer() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      // Clipboard can be blocked (insecure context, permissions). Fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = site.email;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  return (
    <footer id="contact" className="relative scroll-mt-24 px-4 pb-10 pt-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 border-t border-slate-900/10 pt-14 lg:grid-cols-12 dark:border-white/10">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Have a project in mind?
            </h2>
            <button
              type="button"
              onClick={copyEmail}
              className="group mt-6 flex max-w-full items-center gap-4 rounded-2xl text-left"
            >
              <span className="break-all font-display text-2xl tracking-tight underline decoration-slate-400/40 decoration-1 underline-offset-8 transition-[text-decoration-color] group-hover:decoration-brand-violet sm:text-4xl">
                {site.email}
              </span>
              <span className="glass grid size-11 shrink-0 place-items-center rounded-full">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "done" : "copy"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    className="grid place-items-center"
                  >
                    {copied ? (
                      <Check className="size-[18px] text-brand-emerald" aria-hidden="true" />
                    ) : (
                      <Copy className="size-[18px]" aria-hidden="true" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? "Email address copied" : "Copy email address"}
              </span>
            </button>
          </div>

          <nav aria-label="Social links" className="lg:col-span-5 lg:justify-self-end">
            <ul className="space-y-1">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ["--c" as string]: PALETTE[s.accent] }}
                    className="group flex items-center justify-between gap-10 border-b border-slate-900/10 py-3 font-display text-xl transition-colors hover:border-[var(--c)] hover:text-[var(--c)] dark:border-white/10"
                  >
                    {s.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-14 text-sm text-slate-500 dark:text-slate-500">
          &copy; {site.year} {site.brand}
          {site.tld}. Designed and built with love.
        </p>
      </div>
    </footer>
  );
}
