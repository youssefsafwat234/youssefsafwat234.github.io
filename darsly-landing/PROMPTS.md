# Darsly Landing — Prompts

Use these prompts with any AI coding tool to rebuild, extend or restyle the Darsly landing page.
The page that already exists in `src/` was built from exactly these prompts.
Run them in order. Run **P0** first every time, because the other prompts depend on it.

---

## P0 · Master prompt (stack, rules, design system)

```
Build the marketing landing page for "Darsly" (درسلي), an Egyptian online-teaching platform with 3 roles:
teacher (المحاضر), secretary (السكرتير) and student (الطالب), plus a Darsly admin team.

STACK (mandatory)
- React 19 + Vite. Plain CSS (one styles.css with CSS variables), no Tailwind.
- 3D: three.js through @react-three/fiber v9 + @react-three/drei v10. All 3D models are PROCEDURAL
  (built from geometry in code). No GLB downloads, no HDR files: light with drei <Environment> + <Lightformer>.
- Motion: GSAP 3 + ScrollTrigger (+ @gsap/react useGSAP) for scroll storytelling; Lenis for smooth scroll,
  wired to gsap.ticker and ScrollTrigger.update.
- React Bits components (copy the JS+CSS sources into src/components/reactbits and keep their MIT + Commons Clause
  licence file): Aurora, SplitText, BlurText, RotatingText, ShinyText, DecryptedText, ScrollReveal, GradientText,
  SpotlightCard, Magnet, ClickSpark, StarBorder, CountUp, AnimatedContent, LogoLoop.

LANGUAGE & DIRECTION
- Egyptian Arabic, <html lang="ar" dir="rtl">. Latin names (Chapter 1 · Part 2, AES-256-GCM, INV-2026-10) stay LTR.
- Arabic letters connect: every text animation must split by WORDS, never by characters
  (SplitText splitType="words", BlurText animateBy="words", RotatingText splitBy="words").
  Character effects (DecryptedText) only on Latin strings.
- Put marquees (LogoLoop) inside a dir="ltr" wrapper.

DESIGN SYSTEM «Ink & Cobalt» (same as the apps)
- ink #0B1736, ink-2 #13234A, cobalt #1F4FD8, cobalt-hi #3A6BF0, sky #7FA6FF, tint #EEF2FD, paper #F6F5F1,
  line #E7E4DC, text #14171F / #3D4250 / #5E6372 / #9A9EA9, amber #F2A93B, green #18865B, red #E4704F.
- Fonts (Google Fonts): Alexandria (headings, numbers), IBM Plex Sans Arabic (body), IBM Plex Mono (codes).
- Radii: cards 24–30, buttons 16–18, chips 999. Dark sections = ink background; light sections = paper.

PERFORMANCE & A11Y
- Each <Canvas> sits in a wrapper that uses an IntersectionObserver to switch frameloop between
  'always' and 'never', so only canvases on screen render. dpr [1, 1.75].
- prefers-reduced-motion: no Lenis, no CSS animations.
- Responsive down to 360px: grids collapse to one column, 3D canvases get shorter, scenes scale with viewport.width.
- Every content string lives in src/data/content.js (no copy hard-coded in components).

SECTIONS (one component each, in this order)
Nav · Hero · Marquee · Audience · Journey · Protection · Offline · Toolkit · Facts · Billing · FAQ · Finale · Footer.
Details are in P1–P8. Do not invent numbers about users or revenue; only product facts.
```

---

## P1 · Hero + 3D phone

```
HERO (dark, full viewport):
- Background: React Bits <Aurora colorStops={['#1F4FD8','#7FA6FF','#13234A']} amplitude 1.1 speed 0.6/> with a radial
  ink vignette and a 6% SVG grain overlay.
- Right column (RTL first): kicker pill «منصة التدريس الأونلاين في مصر»; H1 in two lines with SplitText (words):
  «درّس أونلاين،» / «وسيب الباقي على درسلي» (second line has a white→sky→amber gradient text);
  row «تطبيق واحد» + RotatingText pill [للمحاضر, للسكرتير, للطالب]; BlurText paragraph; two CTAs wrapped in Magnet
  («ابدأ كمحاضر» primary cobalt, «حمّل تطبيق الطالب» glass); badges row (محمي باسم الطالب · تحميل مشفّر · دارك مود).
- Left column: <Canvas> with HeroScene:
  * PHONE MODEL: drei RoundedBox aluminium body (#1B2440, metalness .85) + black glass + a plane with a CanvasTexture.
    The canvas (780×1688) draws the real Darsly lecture-player screen in RTL with ctx.direction='rtl':
    header «Chapter 1 · Part 2», navy video with play button, a MOVING WATERMARK «عمر أشرف · S-55120»
    (position animated with sin/cos), progress bar, chips «تلقائي · 720p», «محمي», «المشغّل الأساسي»,
    chapters card (4 rows with times in IBM Plex Mono), cobalt button «تحميل · بيتحفظ مشفّر».
    Wait for document.fonts.load(...) before the first draw; redraw at 20 fps.
  * Orbiting product icons inside drei <Float>: PlayBadge, Bell, Shield-with-check, Graduation Cap (P8 models).
  * drei <Sparkles> + <ContactShadows>.
  * The rig follows the pointer (damped) and, driven by a ScrollTrigger progress ref, rotates and lifts as the
    hero scrolls away. The copy column parallaxes up and fades.
- Nav: fixed, transparent → blurred ink glass after 40px. Logo = cobalt tile with cap icon + "Darsly".
  Links scroll with lenis.scrollTo(offset -70). CTA = React Bits StarBorder.
- Wrap the whole app in React Bits ClickSpark (colors sky / amber / white).
```

---

## P2 · Marquee + Audience

```
MARQUEE: React Bits LogoLoop (direction right, speed 60, pauseOnHover, fadeOut, intro false) inside dir="ltr".
Items = pill chips of the feature list in content.js (MARQUEE), four colour variants (cobalt / glass / amber / green).

AUDIENCE (light): heading «تلات أدوار، تطبيق واحد». Three React Bits SpotlightCard (theme light, cobalt spotlight)
revealed with AnimatedContent (stagger 0.12s): المحاضر / السكرتير / الطالب, each with an icon tile
(cobalt / amber / green tint), a tag pill and 6 check-marked points from AUDIENCE.
```

---

## P3 · Journey (pinned 3D pipeline)

```
JOURNEY (dark, pinned on ≥900px for +2400px with scrub 0.6; on mobile not pinned, scrubbed by the section):
Story: «من لينك… لمحاضرة منشورة» — the lecture is published only after the Python video service returns the
streaming link.
3D JourneyScene, progress ref 0..1 from ScrollTrigger:
- 4 stations on a CatmullRom curve (RTL: start on the right): ChainLinks (source link) → Gear pair (processor,
  rotating) → Bell (published + notification) → PlayBadge (student watches).
- A thin cobalt TubeGeometry along the curve + an instancedMesh of 70 glowing spheres flowing along it (getPointAt).
- Active station = round(progress*3): scales 0.75→1.2 and spins faster; the camera x is damped from +1.6 to −1.6
  following progress. Scale the whole scene by min(1, viewport.width/7.5) on small screens.
Under the canvas: 4 step cards (01–04 from JOURNEY) — active card highlighted (cobalt glass, lifted), done cards
dimmed less; a progress bar under them (scaleX from the right).
```

---

## P4 · Protection bento

```
PROTECTION (light): heading «محتواك بتاعك — ومش هيطلع برّه», then a React Bits ScrollReveal sentence (blur + fade,
scrubbed) explaining that the student only sees Darsly's player (no YouTube/Drive/link).
Bento grid 4 columns (2 on tablet, 1 on phone) of SpotlightCards from PROTECTION; items with big:true span 2:
- «علامة مائية متحركة» card contains a mini navy video with a play button and the name watermark jumping
  between 3 positions (CSS steps animation).
- «أكتر من مشغّل» card contains 3 player chips (الأساسي / البديل / النت الضعيف): on a 6 s loop the primary turns red
  and struck through while the alternate turns green — the automatic fallback.
Others: عدد مشاهدات، منع تصوير الشاشة، سماعة إجباري، الجودة في إيد الطالب، فصول وأسئلة جوه الفيديو، شروط فتح المحاضرة.
```

---

## P5 · Offline encrypted downloads (3D padlock)

```
OFFLINE (dark, 2 columns): left = LockScene canvas, right = copy.
3D LockScene:
- PADLOCK model: chrome shackle (half torus + 2 cylinders), cobalt RoundedBox body, ink keyhole (cylinder + box).
- The shackle is open at first and CLOSES as you scroll in (progress ref from ScrollTrigger 'top 80%'→'center center',
  smoothstep 0.15–0.55, damped).
- 90 instanced "encrypted bits" (small glowing cubes) orbit the lock at random radii/heights; a thin glowing ring.
- Pointer-follow rotation, Float, ContactShadows.
Copy: kicker «أوفلاين مشفّر», H2 «نزّل وتفرّج من غير نت —» + GradientText line «والملف ميتفتحش برّه درسلي»,
a mono pill with DecryptedText "AES-256-GCM" (animateOn view, sequential, chars 01ABCDEF#$%&),
4 numbered points (OFFLINE.points) revealed with AnimatedContent (horizontal).
Facts to keep exact: AES-256 per file; key wrapped in Android Keystore / iOS Keychain; decrypted only while
playing, never written decrypted; teacher sets offline days (or open) and max downloads per student per course.
```

---

## P6 · Teacher toolkit (stacking cards)

```
TOOLKIT (light): heading «كل اللي بتعمله في السنتر — من موبايلك».
8 sticky cards (position: sticky, top 110px + i*14px) from TOOLKIT, colour cycle white / ink / cobalt / amber-tint.
Each card: big mono index 01–08, title, body, 3 chips, a large icon tile (hidden on mobile).
GSAP: while the next card scrolls from 'top 60%' to 'top 20%', the previous card scales to 0.94 (+0.006*i). Never
fade or blur the covered card — the cards are opaque and simply stack.
```

---

## P7 · Facts, Billing, FAQ

```
FACTS (dark band): 4 CountUp numbers in Alexandria 900 with a white→sky gradient, white-space nowrap:
5 «جودات فيديو + تلقائي», 3 «مشغّلات بتتبادل لوحدها», 256-bit «تشفير للتنزيلات», 30 «ثانية والعلامة المائية بتغيّر مكانها».

BILLING (light, 2 columns): «بتدفع على طلابك الفعليين بس» + rules list (active & suspended billed, expelled listed not
billed, a student in several groups of one course counted once, reminder + grace before any lock).
Visual: an invoice card rotated −2° (AnimatedContent rotate −4 → 0): header «فاتورة أكتوبر» INV-2026-10, a status pill
with ShinyText «تحويل للمراجعة» (pill background on a wrapper span, not on ShinyText itself), 3 course rows with
student counts, a muted row «12 طالب مطرود · مش محسوبين», total box with CountUp.

FAQ (light): accordion of 6 questions from FAQ; one open at a time; animated with grid-template-rows 0fr→1fr;
the plus icon turns into a minus on a cobalt tile.
```

---

## P8 · Finale + 3D models library

```
FINALE (dark): FinaleScene canvas — a liquid cobalt orb (icosahedron + drei MeshDistortMaterial distort .35),
the Graduation Cap floating on top, PlayBadge and Shield floating on the sides, white Sparkles.
Under it: SplitText H2 «جاهز تنقل كورساتك لدرسلي؟», lead line, Magnet CTA «ابدأ كمحاضر» + Google Play and
App Store buttons. Footer: logo, «درسلي © 2026», section links.

3D MODEL LIBRARY (src/three/models.jsx), all procedural, MeshPhysicalMaterial clearcoat ~1, roughness ~.25:
- PlayBadge: RoundedBox tile 0.9×0.9×0.22 radius .22 + extruded white triangle (bevel).
- Bell: LatheGeometry profile (9 points) + sphere clapper + red notification dot.
- Shield: Shape with bezier curves → ExtrudeGeometry (bevel) + white TubeGeometry check mark.
- Cap: rotated square board (box), open cylinder crown, gold button, swinging tassel (useFrame sin).
- Padlock: half-torus shackle + legs (metal), RoundedBox body, keyhole.
- Gear: Shape with N teeth + centre hole → ExtrudeGeometry, rotates in useFrame.
- ChainLinks: two closed CatmullRom TubeGeometry loops, one metal one cobalt, interlocked.
- Phone: see P1.
```

---

## P9 · Extras you can ask for next

```
- Add a "screens" gallery section: a horizontal GSAP-pinned scroll of 6 phone mock-ups (student player, downloads,
  exams, teacher L47 processing, invoices, admin dashboard) rendered with the same CanvasTexture phone.
- Add an English version (/en) with dir="ltr" by reading the copy from content.en.js.
- Replace the store buttons with real links when the apps are published.
- Add Open Graph image: render the hero 3D scene to a PNG at build time.
```
