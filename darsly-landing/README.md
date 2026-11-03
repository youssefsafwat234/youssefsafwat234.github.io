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
  sections/index.jsx       Nav, Hero, Marquee, Audience, Journey, Protection, Offline, Toolkit, Facts, Billing, FAQ, Finale, Footer
  sections/icons.jsx       stroke icons
  three/common.jsx         View3D (renders only while on screen), studio lighting, palette
  three/models.jsx         procedural models: PlayBadge, Bell, Shield, Cap, Padlock, Gear, ChainLinks
  three/Phone.jsx          phone model with the live Darsly player screen (CanvasTexture)
  three/scenes.jsx         HeroScene, JourneyScene (pinned pipeline), LockScene, FinaleScene
  components/reactbits/    React Bits components (see LICENSE-react-bits.md)
  styles.css               Ink & Cobalt design tokens and all section styles
```

`PROMPTS.md` holds the prompts the page was built from. You can use them to rebuild or extend the page with any AI coding tool.

## Notes

- **Arabic text:** text animations split by words, never by letters, because splitting by letter breaks the joined Arabic letters.
- **Licence:** React Bits is MIT + Commons Clause. You can use the components inside this site, but you can't resell the components themselves.
- **Store buttons:** they point back to the top of the page until the store links exist.
