import type { Accent } from "@/lib/palette";

/**
 * Everything you are likely to edit lives here: brand, links, copy and packages.
 * Components stay free of hard-coded content.
 */
export const site = {
  brand: "Nefer",
  tld: ".id",
  businessUrl: "https://nefer.id",
  email: "hello@nefer.id",
  year: 2026,
  availability: {
    label: "Booking projects for December",
    hoverLabel: "Replies within 24 hours",
  },
  description:
    "Frontend engineer and UI/UX designer building fast, accessible websites and web apps for startups and growing businesses.",
} as const;

/**
 * Set `ready: true` once the section with that id exists in app/page.tsx.
 * Only ready links appear in the navigation, so there are never dead anchors.
 */
export const navLinks = [
  { label: "Skills", id: "skills", ready: false },
  { label: "Work", id: "projects", ready: false },
  { label: "Experience", id: "experience", ready: false },
  { label: "Services", id: "services", ready: true },
  { label: "Contact", id: "contact", ready: true },
] as const;

export const disciplines: { label: string; accent: Accent }[] = [
  { label: "Frontend", accent: "emerald" },
  { label: "Backend", accent: "blue" },
  { label: "UI/UX design", accent: "violet" },
  { label: "Tooling and DevOps", accent: "crimson" },
];

export const socials: { label: string; href: string; accent: Accent }[] = [
  { label: "GitHub", href: "https://github.com/", accent: "violet" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", accent: "blue" },
  { label: "X", href: "https://x.com/", accent: "crimson" },
  { label: "Instagram", href: "https://www.instagram.com/", accent: "emerald" },
];

export interface ServicePackage {
  id: string;
  title: string;
  tagline: string;
  accent: Accent;
  timeline: string;
  scope: string[];
}

export const packages: ServicePackage[] = [
  {
    id: "landing",
    title: "Landing page",
    tagline: "One page, one goal. Launch a product, a campaign or an offer.",
    accent: "emerald",
    timeline: "1 to 2 weeks",
    scope: [
      "Custom design in Figma",
      "Responsive build in Next.js",
      "Copy structure and on-page SEO",
      "Forms and analytics wired up",
      "Deployed to your own domain",
    ],
  },
  {
    id: "website",
    title: "Business website",
    tagline: "A multi-page site your team can edit without calling a developer.",
    accent: "blue",
    timeline: "3 to 5 weeks",
    scope: [
      "Sitemap and design system",
      "Up to 10 designed pages",
      "Headless CMS for your team",
      "Performance and accessibility audit",
      "Launch day and a training call",
    ],
  },
  {
    id: "product",
    title: "Product UI/UX",
    tagline: "From user flows to a clickable prototype, ready for engineering.",
    accent: "violet",
    timeline: "4 to 8 weeks",
    scope: [
      "User flows and wireframes",
      "High-fidelity UI in Figma",
      "Interactive prototype for testing",
      "Reusable component library",
      "Developer handoff, or I build it",
    ],
  },
  {
    id: "support",
    title: "Ongoing support",
    tagline: "A monthly retainer for teams that keep shipping after launch.",
    accent: "crimson",
    timeline: "Monthly",
    scope: [
      "New features and fixes every month",
      "Priority response on issues",
      "Uptime and performance monitoring",
      "Quarterly design review",
    ],
  },
];

export const trustPoints = [
  "Fixed scope and timeline, agreed before work starts",
  "A working demo every week, not a reveal at the end",
  "30 days of post-launch fixes included",
] as const;
