# Our Little One — Newborn Baby Website

A soft, pastel-themed website for your newborn built with **React** and **Tailwind CSS**: homepage, photo gallery, milestone tracker, about page, and a family message board.

## Tech stack

- **React 18** — UI components and state
- **React Router 6** — Client-side routing
- **Tailwind CSS 3** — Styling (pastel theme in `tailwind.config.js`)
- **Vite** — Build tool and dev server

## Design

- **Colors:** Cream, beige, blush, and light blue (see `tailwind.config.js` → `theme.extend.colors`)
- **Feel:** Warm, gentle, minimal
- **Fonts:** Cormorant Infant (headings), Nunito (body)

## Pages

| Page       | Route        | Description |
|-----------|--------------|-------------|
| **Home**  | `/`          | Welcome hero and short intro |
| **Gallery** | `/gallery` | Photo grid (add images via `src/pages/Gallery.jsx`) |
| **Milestones** | `/milestones` | Tracker for first smile, steps, etc. (edit `MILESTONES` in `Milestones.jsx`) |
| **About** | `/about`     | Why the site exists; add baby’s name and birth date in `About.jsx` |
| **Messages** | `/messages` | Family message board; messages stored in localStorage |

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Production build:**

```bash
npm run build
npm run preview
```

Output is in `dist/`. Serve that folder with any static host.

## Project structure

```
src/
├── components/
│   ├── Layout.jsx   # Header, nav, footer, outlet
│   └── Nav.jsx      # Nav links with active state
├── pages/
│   ├── Home.jsx
│   ├── Gallery.jsx
│   ├── Milestones.jsx
│   ├── About.jsx
│   └── Messages.jsx
├── App.jsx
├── main.jsx
└── index.css        # Tailwind directives + base styles
```

## Customization

- **Photos:** Put images in `public/images/`, then in `Gallery.jsx` render `<img src="/images/photo1.jpg" alt="..." />` instead of placeholders.
- **Milestones:** Edit the `MILESTONES` array in `src/pages/Milestones.jsx` (dates, titles, notes, `achieved: true/false`).
- **About:** Edit the `BLOCKS` array in `src/pages/About.jsx` to add your baby’s name and birth date.

## Message board

Messages are saved in **localStorage** in the browser. For a shared message board across devices, you’d add a backend (e.g. Firebase, Supabase, or a small API) and replace the `getStoredMessages` / `saveMessages` logic in `Messages.jsx`.

---

Made with love for our little one.
