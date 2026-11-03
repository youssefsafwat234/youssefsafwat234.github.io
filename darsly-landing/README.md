# Darsly — Landing page

The marketing landing page for Darsly (درسلي), built with:
- React 19 + Vite
- three.js (React Three Fiber + drei), with procedural 3D models
- GSAP ScrollTrigger and Lenis for scrolling
- React Bits components

## Run it

```bash
cd darsly-landing
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to ../darsly  → served by GitHub Pages at /darsly/
```

## Structure

```
src/
  data/content.js          all Arabic copy (edit text here)
  sections/index.jsx       Nav, Hero, Marquee, Audience, Screens, Journey, Protection, Offline, Toolkit, Facts, Billing, FAQ, Finale, Footer
  sections/icons.jsx       stroke icons
  three/common.jsx         View3D (renders only while on screen), studio lighting, palette
  three/models.jsx         procedural models: PlayBadge, Bell, Shield, Cap, Padlock, Gear, ChainLinks
  three/Phone.jsx          phone model that shows a real app screen as its texture
  three/scenes.jsx         HeroScene, JourneyScene (pinned pipeline), LockScene, FinaleScene
  three/Scene3D.jsx        lazy entry point, so three.js loads in its own chunk after the text
  data/screens.js          real screen codes for the gallery, plus helpers for the logo and screen paths
  components/reactbits/    React Bits components (see LICENSE-react-bits.md)
  styles.css               Ink & Cobalt design tokens and all section styles
public/
  brand/                   official Darsly logo and icon (plus white versions for dark backgrounds)
  screens/*.webp           real app screens exported from the design canvas (ST = student, L = teacher, A = admin)
```

`PROMPTS.md` holds the prompts the page was built from. You can use them to rebuild or extend the page with any AI coding tool.

## Notes

- **Arabic text:** text animations split by words, never by letters, because splitting by letter breaks the joined Arabic letters.
- **Licence:** React Bits is MIT + Commons Clause. You can use the components inside this site, but you can't resell the components themselves.
- **Performance:**
  - No full-screen WebGL background; the hero glow is CSS only.
  - The 3D code is split into its own file.
  - Textures are static.
  - The shadows are drawn once.
  - Each canvas renders only while it's on screen.
- **Store buttons:** they point back to the top of the page until the store links exist.
