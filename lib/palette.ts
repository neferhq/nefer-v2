/** Core four-colour palette. Single source of truth for the shader, UI accents and Tailwind. */
export const PALETTE = {
  emerald: "#10B981",
  violet: "#8B5CF6",
  crimson: "#EF4444",
  blue: "#3B82F6",
} as const;

export type Accent = keyof typeof PALETTE;
