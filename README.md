<div align="center">

# 🌸 Anime Gallery

**A cozy, pastel-themed Pinterest-style gallery for browsing anime art.**

An endless-scroll discovery feed plus character/anime search, backed by two
purpose-built image APIs, with buttery-smooth motion and an image pipeline
tuned for a masonry feed that never jank-scrolls.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![License: MIT](https://img.shields.io/badge/License-MIT-ec4899?style=flat-square)](LICENSE)

</div>

---

## ✨ Features

- 🖼️ **Pinterest-style masonry gallery** — CSS-column layout that flows
  naturally at any viewport, no grid library required.
- ♾️ **Endless discovery feed** — a random art stream from Nekos API that
  never runs out, deduplicated client-side across batches.
- 🔍 **Character/anime search** — debounced search against Safebooru's tag
  index, seamlessly crossfading from the discovery feed to search results.
- 🛡️ **Forced safe-for-work content** — every request is rating-filtered at
  the API level, plus a server-side tag blocklist (in the `/api/discovery`
  route) as a second gate on top of Nekos' own occasionally-unreliable
  rating classification — unsafe images never reach the browser.
- 💀 **Skeleton loading states** — pastel shimmer tiles with staggered
  heights so the loading state already _looks_ like the masonry grid.
- 🌀 **Blur-up images** — Nekos images fade in from their real dominant
  color; Safebooru images fall back to a generated shimmer placeholder.
- 🎨 **Fully token-driven theme** — every color, radius, and font in the app
  traces back to a single `@theme` block in `globals.css`. Zero hardcoded
  hex values in components.
- 🌗 **Light & dark pastel palettes** — soft pinks and lavender in both
  modes, tuned for contrast, not just vibe.
- 🎬 **Tasteful motion** — card entrances, hover lifts, and a discovery/search
  crossfade via Framer Motion, all defined in one variants file.

## 🛠️ Tech Stack

| Layer           | Choice                                                           |
| --------------- | ---------------------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org) (App Router)                    |
| Language        | TypeScript                                                       |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first `@theme`)  |
| Components      | [shadcn UI](https://ui.shadcn.com) on Base UI                    |
| Data fetching   | [TanStack Query](https://tanstack.com/query)                     |
| Motion          | [Framer Motion](https://www.framer.com/motion)                   |
| Discovery feed  | [Nekos API](https://nekosapi.com) (random tagged anime art)      |
| Search          | [Safebooru](https://safebooru.org) (tag/character indexed booru) |
| Tooling         | ESLint · Prettier · Husky · lint-staged                          |
| Package manager | pnpm                                                             |

## 📁 Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── discovery/route.ts  # Same-origin proxy + normalizer for Nekos API
│   │   └── search/route.ts     # Same-origin proxy + normalizer for Safebooru
│   └── ...                     # Routes, root layout, providers, global theme
├── components/
│   ├── ui/                # shadcn primitives (button, input, badge, skeleton)
│   ├── layout/             # Header, footer
│   ├── search/             # Search bar
│   └── gallery/             # Masonry grid, card, skeleton, empty/error state
├── config/
│   └── motion-variants.ts  # Every Framer Motion variant, one file
├── hooks/                 # use-discovery-feed, use-character-search, use-debounced-value, ...
├── lib/
│   ├── api-paths.ts        # Every API endpoint, centralized
│   ├── content-safety.ts   # NSFW tag blocklist (defense-in-depth, applied server-side)
│   └── image-placeholder.ts
├── services/               # Thin fetch wrappers around our own /api/* routes
└── types/
    └── gallery.ts           # The unified GalleryImage type both APIs normalize into
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 9+

### Installation

```bash
git clone https://github.com/<your-username>/anime-gallery.git
cd anime-gallery
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
pnpm build          # Production build
pnpm start          # Run the production build
pnpm lint           # ESLint
pnpm format         # Prettier, write mode
pnpm format:check   # Prettier, check mode
```

A Husky pre-commit hook runs `lint-staged` automatically, so staged files
are linted and formatted before every commit.

## 🎨 Theming

This project uses Tailwind v4's CSS-first configuration — there's no
`tailwind.config.js`. Every color, radius, and font is defined once as a
CSS variable inside the `@theme` block in
[`src/app/globals.css`](src/app/globals.css), then consumed everywhere
through Tailwind utility classes (`bg-primary`, `text-muted-foreground`,
`rounded-2xl`, etc.). Change a value there and it propagates through the
entire app — no component ever hardcodes a color.

## 🏗️ Architecture: two APIs, one domain type

The discovery feed and search results come from two structurally different
APIs — [Nekos API](https://nekosapi.com) (a random image endpoint with tags
and a rating field) and [Safebooru](https://safebooru.org) (a paginated
booru with tag-based search). Neither sends CORS headers, so the browser
can't call them directly — `src/app/api/discovery/route.ts` and
`src/app/api/search/route.ts` proxy them server-side (where CORS doesn't
apply) and normalize each response into the same
[`GalleryImage`](src/types/gallery.ts) type before it ever reaches the
client. `src/services/*.ts` are thin fetch wrappers around our own routes;
hooks, components, and state management only ever work with
`GalleryImage[]` — swapping either upstream API later means touching one
route handler, nothing else.

The two features are mutually exclusive views, not simultaneous fetches:
[`src/app/page.tsx`](src/app/page.tsx) derives `isSearching` from the
debounced query and only enables the matching React Query hook
(`useDiscoveryFeed` / `useCharacterSearch`), so the idle view's data stays
cached but stops fetching.

## 🙏 Credits

Discovery art is served by [Nekos API](https://nekosapi.com). Search
results are served by [Safebooru](https://safebooru.org), a safe-for-work
anime imageboard. Both are free and require no API key — please be a good
citizen of their infrastructure if you extend this project.

## 📄 License

Licensed under the [MIT License](LICENSE).
