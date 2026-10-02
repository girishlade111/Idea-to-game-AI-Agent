# Idea to Game — AI Game Agent

Turn a plain-English idea into a **playable browser game in seconds** — no coding required. Describe your game in natural language, and this app parses your prompt, picks a game template, generates a self-contained HTML game, and drops you into a live workspace where you can tweak, preview, and export it.

## Features

- **Chat to Create** — Describe your game idea in natural language; the built-in prompt parser (`src/engine/promptParser.ts`) extracts genre, difficulty, colors, player/enemy types, environment, speed and size.
- **Template-based game engine** — Genre templates (e.g. platformer) generate complete game code via `src/engine/gameTemplates.ts` and `src/engine/gameGenerator.ts`; modifier passes (`src/engine/gameModifier.ts`) refine the output.
- **Game Workspace** — Live preview of the generated game with edit controls for config (colors, difficulty, speed, size).
- **Game Gallery** — Browse and re-open previously generated games, persisted via the app store (`src/store/gameStore.tsx`).
- **Export to standalone HTML** — `src/engine/exportGame.ts` wraps the generated game in a self-contained HTML file you can share or host anywhere.
- **Chat-style guided flow** — Conversational agent responses (`src/engine/chatResponses.ts`) walk you through creation.
- **Arcade-styled UI** — Retro dark theme with animated terminal hero, built on shadcn/ui, Radix primitives and Tailwind CSS.

## Tech Stack

- **Vite 5** + **React 18** + **TypeScript**
- **react-router-dom** for client-side routing
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- **@tanstack/react-query**, **react-hook-form**, **zod**
- Client-side only — no backend, no API keys, no database; all state in memory/local store

## Quick Start

```sh
# 1. Clone
git clone https://github.com/girishlade111/Idea-to-game-AI-Agent.git
cd Idea-to-game-AI-Agent

# 2. Install (Node.js 18+)
npm install

# 3. Run the dev server
npm run dev
# -> http://localhost:8080

# 4. Build for production
npm run build        # outputs to dist/
npm run preview      # preview the production build
```

## Project Structure

```
Idea-to-game-AI-Agent/
├── index.html                 # Entry HTML
├── vite.config.ts             # Vite config (base path for sub-path hosting)
├── src/
│   ├── main.tsx               # React entry
│   ├── App.tsx                # Router + providers
│   ├── pages/
│   │   ├── Index.tsx          # Landing page (terminal hero, feature cards)
│   │   ├── CreateGame.tsx     # Chat-driven creation flow
│   │   ├── GameWorkspace.tsx  # Live preview + tweaks
│   │   ├── GameGallery.tsx    # Saved games
│   │   └── NotFound.tsx
│   ├── engine/                # The "AI agent" core (all client-side)
│   │   ├── promptParser.ts    # Natural-language -> GameConfig
│   │   ├── gameTemplates.ts   # Genre templates (platformer, ...)
│   │   ├── gameGenerator.ts   # Assembles playable game code
│   │   ├── gameModifier.ts    # Post-generation refinements
│   │   ├── chatResponses.ts   # Conversational agent replies
│   │   ├── exportGame.ts      # Export as standalone HTML
│   │   └── index.ts
│   ├── store/gameStore.tsx    # App state (games, current config)
│   ├── components/            # Header, Terminal, FeatureCard, ui/*
│   └── hooks/ index.css App.css
└── public/                    # favicon, fonts, og-image
```

## How It Works

1. You type an idea, e.g. *"a hard space shooter with a blue ship"*.
2. `promptParser` turns that into a `GameConfig` (genre, colors, difficulty, speed…).
3. `gameGenerator` picks the matching template and emits playable game JavaScript, wrapped as a full HTML document by `wrapGame()`.
4. The workspace renders it in an iframe; you tweak settings or ask the chat agent to modify it.
5. Export the final game as a standalone `.html` file.

## Deployment

Static site — no server needed:

- **GitHub Pages**: production build is published from the `gh-pages` branch to `https://girishlade111.github.io/Idea-to-game-AI-Agent/`.
- The Vite `base` and router `basename` are configured for sub-path hosting, and `404.html` mirrors `index.html` so deep links (e.g. `/create-game`, `/gallery`) work.
- Any static host (Netlify, Cloudflare Pages, Vercel) works: `npm run build` → serve `dist/`.

## Environment Variables

None. The app is fully client-side and calls no external APIs.

## License

Free to use and learn from.

---

Built by Girish Lade — [ladestack.in](https://ladestack.in)
