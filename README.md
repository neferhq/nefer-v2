# Portfolio v3

Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · Framer Motion · Lenis · next-themes

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Deploy to Netlify

Push the repo to GitHub, then **Add new site → Import from Git** in Netlify. `netlify.toml` already
sets the build command and Node version; Netlify detects Next.js and installs its runtime itself.
CLI alternative: `npx netlify deploy --build --prod`.

## Edit your content

Everything you are likely to change is in `lib/site.ts`: brand, email, availability badge,
nav links, social URLs, service packages and trust points.

When you add a new section to `app/page.tsx` (for example `id="projects"`), flip its `ready`
flag in `navLinks` and the link appears in the nav.

## Structure

```
app/            layout, page, globals.css, icon.svg
components/
  layout/       Header, Footer
  providers/    Providers (theme + motion), SmoothScroll (Lenis)
  sections/     Hero, Services
  ui/           FluidBackground (WebGL), Button, Magnetic, SpotlightCard, ThemeToggle, Logo
lib/            site.ts (content), palette.ts, scroll.ts, utils.ts
```
