import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Nav, Hero, Marquee, Audience, Screens, Journey, Protection, Offline, Toolkit, Facts, Billing, Faq, Finale, Footer } from './sections/index.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Light smoothing only (lerp), native touch scrolling on phones.
    const lenis = new Lenis({ lerp: 0.14, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(500, 33);
    window.__lenis = lenis;
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Audience />
        <Screens />
        <Journey />
        <Protection />
        <Offline />
        <Toolkit />
        <Facts />
        <Billing />
        <Faq />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
