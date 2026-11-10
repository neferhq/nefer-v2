import { PALETTE } from "@/lib/palette";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const DOTS = [PALETTE.emerald, PALETTE.violet, PALETTE.crimson, PALETTE.blue];

/** Four palette dots as a mark, plus the wordmark. The mark turns a quarter on hover. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="grid size-[22px] grid-cols-2 gap-[3px] transition-transform duration-500 ease-out group-hover:rotate-90"
      >
        {DOTS.map((color) => (
          <span key={color} className="rounded-full" style={{ backgroundColor: color }} />
        ))}
      </span>
      <span className="font-display text-[17px] font-semibold tracking-tight">
        {site.brand}
        <span className="text-slate-500 dark:text-slate-400">{site.tld}</span>
      </span>
    </span>
  );
}
