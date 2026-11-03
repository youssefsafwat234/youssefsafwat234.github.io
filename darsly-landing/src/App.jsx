import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ClickSpark from './components/reactbits/ClickSpark.jsx';
import { Nav, Hero, Marquee, Audience, Journey, Protection, Offline, Toolkit, Facts, Billing, Faq, Finale, Footer } from './sections/index.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);

  return (
    <ClickSpark sparkColor={['#7FA6FF', '#F2A93B', '#ffffff']} sparkCount={10} sparkRadius={26} glow={0.6}>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Audience />
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
    </ClickSpark>
  );
}
