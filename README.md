# PicZip — Edge-ready image compression

PicZip is a Vite + Vue + Tailwind single-page app that compresses images entirely in the browser. It ships with a gruvbox-dark theme, Cloudflare Pages configuration, and a production-ready structure.

## At a glance
- Client-side only: files never leave the browser
- Supported formats: JPEG, PNG, WebP, AVIF
- Defaults: quality 50%, max dimension 512px (keeps aspect ratio), keeps original format
- Batch zip download powered by JSZip + FileSaver

## Tech stack
- Vite + Vue 3 (script setup)
- Tailwind CSS (custom gruvbox palette)
- JSZip, FileSaver
- Cloudflare Pages config via `wrangler.toml`

## Getting started
```bash
npm install
npm run dev
```
Visit the printed local URL to use the app.

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally

## Usage
1) Drag-and-drop or browse images (JPEG/PNG/WebP/AVIF).
2) Adjust quality, max dimension, and format (default keeps original) in the control panel.
3) Compress; download individual outputs or all as a zip.

## Compression behavior
- Aspect ratio is preserved automatically (single max dimension control).
- Canvas-based compression runs fully in-browser.
- Quality slider: 40–95%; Max dimension slider: 16–4096px (16px steps).

## Theming
- Gruvbox dark palette defined in `tailwind.config.js` under `brand`/`surface` colors.
- Global styles and gradients live in `src/assets/main.css`.

## Project structure
```
piczip/
├─ src/
│  ├─ assets/         # Global styles (Tailwind entry)
│  ├─ components/     # UI building blocks (dropzone, controls, result cards)
│  ├─ composables/    # Stateful logic (image compressor)
│  ├─ pages/          # Top-level page layout
│  ├─ utils/          # Helpers (compression, formatting, ids)
│  └─ main.js         # App bootstrap
├─ public/            # Static assets (includes piczip.svg favicon)
├─ index.html         # HTML entry + metadata
├─ tailwind.config.js # Tailwind setup (gruvbox palette)
├─ wrangler.toml      # Cloudflare Pages config
└─ vite.config.js     # Vite config with alias @ → src
```

## Deploy to Cloudflare Pages
1) Build: `npm run build`
2) Deploy via dashboard: build command `npm run build`, output directory `dist`
3) Deploy via CLI (optional): `wrangler pages deploy dist`


## License
- [MIT](./LICENSE) © weiensong
