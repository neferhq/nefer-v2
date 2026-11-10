"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";

import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type AnchorProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

type NativeProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

export type ButtonProps = AnchorProps | NativeProps;

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-chalk dark:bg-chalk dark:text-ink",
  secondary:
    "glass text-ink hover:bg-white/80 dark:text-slate-100 dark:hover:bg-white/10",
  ghost:
    "text-slate-700 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10",
};

const GLOW =
  "conic-gradient(from 0deg, #10B981, #3B82F6, #8B5CF6, #EF4444, #10B981)";

/**
 * Pill button / link. `href="#id"` scrolls through Lenis, `http(s)` links open in a new tab.
 * The primary variant gets a four-colour glow underlay on hover.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;

  const face = (
    <span
      className={cn(
        "relative z-10 inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap",
        "transition-colors duration-300",
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );

  const glow =
    variant === "primary" ? (
      <span
        aria-hidden="true"
        className="absolute -inset-0.5 z-0 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-70 group-focus-visible:opacity-70"
        style={{ backgroundImage: GLOW }}
      />
    ) : null;

  const outer =
    "group relative inline-flex rounded-full transition-transform duration-200 active:scale-[0.97] focus-visible:outline-offset-4";

  if (props.href !== undefined) {
    const {
      variant: _variant,
      size: _size,
      className: _className,
      children: _children,
      href,
      onClick,
      ...anchor
    } = props;
    const isHash = href.startsWith("#");
    const isExternal = /^https?:\/\//.test(href);

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (isHash && !e.defaultPrevented) {
        e.preventDefault();
        scrollToId(href.slice(1));
      }
    };

    return (
      <a
        {...anchor}
        href={href}
        onClick={handleClick}
        target={isExternal ? "_blank" : anchor.target}
        rel={isExternal ? "noopener noreferrer" : anchor.rel}
        className={outer}
      >
        {glow}
        {face}
      </a>
    );
  }

  const {
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    href: _href,
    type = "button",
    ...native
  } = props;

  return (
    <button {...native} type={type} className={outer}>
      {glow}
      {face}
    </button>
  );
}
