import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Aurora from '../components/reactbits/Aurora.jsx';
import SplitText from '../components/reactbits/SplitText.jsx';
import BlurText from '../components/reactbits/BlurText.jsx';
import RotatingText from '../components/reactbits/RotatingText.jsx';
import ShinyText from '../components/reactbits/ShinyText.jsx';
import DecryptedText from '../components/reactbits/DecryptedText.jsx';
import ScrollReveal from '../components/reactbits/ScrollReveal.jsx';
import GradientText from '../components/reactbits/GradientText.jsx';
import SpotlightCard from '../components/reactbits/SpotlightCard.jsx';
import Magnet from '../components/reactbits/Magnet.jsx';
import StarBorder from '../components/reactbits/StarBorder.jsx';
import CountUp from '../components/reactbits/CountUp.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { LogoLoop } from '../components/reactbits/LogoLoop.jsx';

import { View3D } from '../three/common.jsx';
import { HeroScene, JourneyScene, LockScene, FinaleScene } from '../three/scenes.jsx';
import { NAV, HERO, MARQUEE, AUDIENCE, JOURNEY, PROTECTION, OFFLINE, TOOLKIT, FACTS, BILLING, FAQ } from '../data/content.js';
import { Icon } from './icons.jsx';

gsap.registerPlugin(ScrollTrigger);
const go = (id) => (e) => { e.preventDefault(); const el = document.getElementById(id); if (!el) return; window.__lenis ? window.__lenis.scrollTo(el, { offset: -70 }) : el.scrollIntoView({ behavior: 'smooth' }); };

/** progress ref (0..1) of a section scrolling through the viewport */
function useScrollProgress(ref, opts = {}) {
  const p = useRef(0);
  useGSAP(() => {
    ScrollTrigger.create({ trigger: ref.current, start: opts.start || 'top bottom', end: opts.end || 'bottom top', scrub: true, onUpdate: (s) => { p.current = s.progress; } });
  }, { scope: ref });
  return p;
}

const Logo = () => (
  <a href="#top" className="logo" onClick={go('top')} aria-label="درسلي">
    <span className="logo-mark"><Icon name="cap" size={20} /></span>
    <span className="logo-word">Darsly</span>
  </a>
);

/* ---------------- NAV ---------------- */
export function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => { const f = () => setSolid(window.scrollY > 40); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  return (
    <header className={`nav ${solid ? 'solid' : ''}`}>
      <div className="wrap nav-in">
        <Logo />
        <nav className="nav-links">{NAV.map((n) => <a key={n.id} href={`#${n.id}`} onClick={go(n.id)}>{n.label}</a>)}</nav>
        <StarBorder as="a" href="#start" onClick={go('start')} className="nav-cta" color="#7FA6FF" radius={14} theme="dark" backgroundColor="#13234A" borderColor="rgba(127,166,255,.35)">ابدأ دلوقتي</StarBorder>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
export function Hero() {
  const ref = useRef(null);
  const progress = useRef(0);
  useGSAP(() => {
    ScrollTrigger.create({ trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => { progress.current = s.progress; } });
    gsap.to('.hero-copy', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
  }, { scope: ref });
  return (
    <section id="top" ref={ref} className="hero dark">
      <div className="hero-bg"><Aurora colorStops={['#1F4FD8', '#7FA6FF', '#13234A']} amplitude={1.1} blend={0.6} speed={0.6} /></div>
      <div className="grain" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="kicker"><span className="dot" />{HERO.kicker}</span>
          <h1 className="hero-title">
            <SplitText text={HERO.title} tag="span" splitType="words" delay={90} duration={1.1} textAlign="right" className="t1" />
            <SplitText text={HERO.title2} tag="span" splitType="words" delay={90} duration={1.1} textAlign="right" className="t2" />
          </h1>
          <div className="hero-rot">
            <span>تطبيق واحد</span>
            <RotatingText texts={HERO.rotating} splitBy="words" mainClassName="rot-pill" rotationInterval={2200} staggerDuration={0} />
          </div>
          <BlurText text={HERO.sub} animateBy="words" delay={35} className="hero-sub" direction="bottom" />
          <div className="hero-ctas" id="start">
            <Magnet padding={60} magnetStrength={3}><a className="btn btn-primary" href="#audience" onClick={go('audience')}>{HERO.primary}<Icon name="arrow" size={18} /></a></Magnet>
            <Magnet padding={60} magnetStrength={4}><a className="btn btn-ghost" href="#offline" onClick={go('offline')}><Icon name="download" size={18} />{HERO.secondary}</a></Magnet>
          </div>
          <div className="hero-badges">
            <span><Icon name="shield" size={16} />فيديو محمي باسم الطالب</span>
            <span><Icon name="lock" size={16} />تحميل مشفّر</span>
            <span><Icon name="moon" size={16} />دارك مود</span>
          </div>
        </div>
        <View3D className="hero-3d" camera={{ position: [0, 0, 7.2], fov: 35 }}><HeroScene progress={progress} /></View3D>
      </div>
      <a className="scroll-cue" href="#audience" onClick={go('audience')} aria-label="انزل"><span /></a>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */
export function Marquee() {
  const logos = MARQUEE.map((t, i) => ({ node: <span className={`mq-chip c${i % 4}`}>{t}</span>, title: t }));
  return (
    <section className="marquee dark" aria-label="خصائص درسلي">
      <div dir="ltr"><LogoLoop logos={logos} speed={60} direction="right" logoHeight={40} gap={14} pauseOnHover fadeOut fadeOutWidth={0.08} intro={false} ariaLabel="خصائص درسلي" /></div>
    </section>
  );
}

/* ---------------- AUDIENCE ---------------- */
export function Audience() {
  const icons = { teacher: 'board', secretary: 'users', student: 'cap' };
  return (
    <section id="audience" className="section light">
      <div className="wrap">
        <Heading kicker="لمين؟" title="تلات أدوار، تطبيق واحد" sub="كل واحد بيشوف اللي يخصّه بس، وكل حاجة متسجّلة باسم اللي عملها." />
        <div className="aud-grid">
          {AUDIENCE.map((a, i) => (
            <AnimatedContent key={a.key} distance={60} delay={i * 0.12} duration={0.9}>
              <SpotlightCard className="aud-card" theme="light" spotlightColor="rgba(31,79,216,0.18)">
                <div className="aud-top"><span className={`aud-ico ${a.key}`}><Icon name={icons[a.key]} size={26} /></span><span className="aud-tag">{a.tag}</span></div>
                <h3>{a.title}</h3>
                <ul>{a.points.map((p) => <li key={p}><Icon name="check" size={16} />{p}</li>)}</ul>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- JOURNEY (pinned 3D pipeline) ---------------- */
export function Journey() {
  const ref = useRef(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      ScrollTrigger.create({ trigger: ref.current, start: 'top top', end: '+=2400', pin: true, scrub: 0.6,
        onUpdate: (s) => { progress.current = s.progress; setStep(Math.min(3, Math.floor(s.progress * 4))); } });
    });
    mm.add('(max-width: 899px)', () => {
      ScrollTrigger.create({ trigger: ref.current, start: 'top center', end: 'bottom center', scrub: true,
        onUpdate: (s) => { progress.current = s.progress; setStep(Math.min(3, Math.floor(s.progress * 3.999))); } });
    });
  }, { scope: ref });
  return (
    <section id="journey" ref={ref} className="journey dark">
      <div className="wrap">
        <Heading kicker="رحلة المحاضرة" title="من لينك… لمحاضرة منشورة" sub="المحاضرة مش بتتنشر غير لما الفيديو يجهز فعلاً. الطابور شغّال، وإنت بيوصلك إشعار." dark />
      </div>
      <View3D className="journey-3d" camera={{ position: [1.6, 0.4, 7], fov: 38 }}><JourneyScene progress={progress} /></View3D>
      <div className="wrap journey-steps">
        {JOURNEY.map((j, i) => (
          <div key={j.n} className={`jstep ${i === step ? 'on' : ''} ${i < step ? 'done' : ''}`}>
            <span className="jn">{j.n}</span>
            <h3>{j.title}</h3>
            <p>{j.body}</p>
          </div>
        ))}
      </div>
      <div className="wrap journey-bar"><span style={{ transform: `scaleX(${(step + 1) / 4})` }} /></div>
    </section>
  );
}

/* ---------------- PROTECTION bento ---------------- */
export function Protection() {
  const icons = { watermark: 'drop', views: 'eye', capture: 'camoff', headphones: 'headphones', players: 'layers', quality: 'hd', chapters: 'list', gates: 'lock' };
  return (
    <section id="protection" className="section light">
      <div className="wrap">
        <Heading kicker="حماية الفيديو" title="محتواك بتاعك — ومش هيطلع برّه" />
        <ScrollReveal baseOpacity={0.12} enableBlur blurStrength={5} baseRotation={1} containerClassName="reveal" textClassName="reveal-text">
          الطالب بيشوف الفيديو في مشغّل درسلي بس. مفيش يوتيوب ولا درايف ولا لينك يتنسخ. اسمه على الشاشة، والسكرين شوت مقفول، وإنت محدد كام مرة يتفرج.
        </ScrollReveal>
        <div className="bento">
          {PROTECTION.map((f, i) => (
            <AnimatedContent key={f.k} distance={40} delay={(i % 4) * 0.08} className={f.big ? 'b-big' : ''}>
              <SpotlightCard className={`bento-card ${f.k}`} theme="light" spotlightColor="rgba(31,79,216,0.16)">
                <span className="b-ico"><Icon name={icons[f.k]} size={24} /></span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                {f.k === 'players' && <PlayersViz />}
                {f.k === 'watermark' && <WatermarkViz />}
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
function PlayersViz() {
  return (
    <div className="pviz">
      {['الأساسي', 'البديل', 'النت الضعيف'].map((p, i) => (
        <span key={p} className={`pv pv${i}`}><i />{p}</span>
      ))}
    </div>
  );
}
function WatermarkViz() {
  return (
    <div className="wviz"><span className="wv-play"><Icon name="play" size={22} /></span><span className="wv-mark">عمر أشرف · S-55120</span></div>
  );
}

/* ---------------- OFFLINE (padlock) ---------------- */
export function Offline() {
  const ref = useRef(null);
  const progress = useScrollProgress(ref, { start: 'top 80%', end: 'center center' });
  return (
    <section id="offline" ref={ref} className="section dark offline">
      <div className="wrap off-grid">
        <View3D className="off-3d" camera={{ position: [0, 0.6, 6], fov: 38 }}><LockScene progress={progress} /></View3D>
        <div>
          <span className="kicker"><span className="dot" />أوفلاين مشفّر</span>
          <h2 className="h2">{OFFLINE.title}<br /><GradientText colors={['#7FA6FF', '#F2A93B', '#7FA6FF']} animationSpeed={6} className="grad">{OFFLINE.title2}</GradientText></h2>
          <div className="cipher" dir="ltr"><Icon name="lock" size={18} /><DecryptedText text={OFFLINE.cipher} animateOn="view" sequential revealDirection="start" speed={45} characters="01ABCDEF#$%&" encryptedClassName="enc" /></div>
          <div className="off-points">
            {OFFLINE.points.map((p, i) => (
              <AnimatedContent key={p.t} distance={30} delay={i * 0.1} direction="horizontal" reverse>
                <div className="op"><span className="op-n">{i + 1}</span><div><h4>{p.t}</h4><p>{p.b}</p></div></div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TOOLKIT (stacking cards) ---------------- */
export function Toolkit() {
  const ref = useRef(null);
  useGSAP(() => {
    const cards = gsap.utils.toArray('.stack-card');
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      gsap.to(card, { scale: 0.94 + i * 0.006, ease: 'none',
        scrollTrigger: { trigger: cards[i + 1], start: 'top 60%', end: 'top 20%', scrub: true } });
    });
  }, { scope: ref });
  return (
    <section id="toolkit" ref={ref} className="section light">
      <div className="wrap">
        <Heading kicker="أدوات المحاضر" title="كل اللي بتعمله في السنتر — من موبايلك" sub="الكورس، المجموعات، الطلاب، الفلوس، الامتحانات والتواصل. والسكرتير يقدر يعمل نفس الحاجات بصلاحياتك." />
        <div className="stack">
          {TOOLKIT.map((t, i) => (
            <article key={t.title} className="stack-card" style={{ top: `${110 + i * 14}px` }}>
              <span className="sc-n">{String(i + 1).padStart(2, '0')}</span>
              <div className="sc-body"><h3>{t.title}</h3><p>{t.body}</p><div className="sc-chips">{t.chips.map((c) => <span key={c}>{c}</span>)}</div></div>
              <span className="sc-art"><Icon name={['board', 'wallet', 'userplus', 'exam', 'chart', 'bell', 'live', 'layers'][i]} size={54} /></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FACTS ---------------- */
export function Facts() {
  return (
    <section className="facts dark">
      <div className="wrap facts-grid">
        {FACTS.map((f) => (
          <div key={f.label} className="fact">
            <span className="fact-n" dir="ltr"><CountUp to={f.to} duration={2.2} />{f.suffix}</span>
            <span className="fact-l">{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- BILLING ---------------- */
export function Billing() {
  const total = BILLING.rows.reduce((a, r) => a + r.s, 0);
  return (
    <section className="section light">
      <div className="wrap bill-grid">
        <div>
          <span className="kicker dark-k"><span className="dot" />شفافية</span>
          <h2 className="h2 ink">{BILLING.title}</h2>
          <p className="lead">{BILLING.body}</p>
          <ul className="bill-list">
            <li><Icon name="check" size={16} />النشط والموقوف بيتحسب، والمطرود لأ</li>
            <li><Icon name="check" size={16} />الطالب في أكتر من مجموعة في نفس الكورس = مرة واحدة</li>
            <li><Icon name="check" size={16} />إشعار قبل الميعاد، ومهلة قبل أي قفل</li>
          </ul>
        </div>
        <AnimatedContent distance={80} rotate={-4} duration={1}>
          <div className="invoice">
            <div className="inv-head"><div><span className="inv-k">فاتورة أكتوبر</span><b dir="ltr">INV-2026-10</b></div><span className="inv-st"><ShinyText text="تحويل للمراجعة" color="#9A5B00" shineColor="#FFD27A" speed={2.5} /></span></div>
            {BILLING.rows.map((r) => (
              <div key={r.c} className="inv-row"><span dir="ltr">{r.c}</span><span className="inv-s">{r.s} طالب</span></div>
            ))}
            <div className="inv-row muted"><span>12 طالب مطرود</span><span>مش محسوبين</span></div>
            <div className="inv-total"><span>طلاب محسوبين</span><b dir="ltr"><CountUp to={total} duration={1.6} /></b></div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section light faq">
      <div className="wrap narrow">
        <Heading kicker="أسئلة" title="أسئلة بتتسأل كتير" />
        <div className="faq-list">
          {FAQ.map((f, i) => (
            <div key={f.q} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}><span>{f.q}</span><i /></button>
              <div className="faq-a"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINALE ---------------- */
export function Finale() {
  return (
    <section className="finale dark">
      <View3D className="fin-3d" camera={{ position: [0, 0.3, 6.5], fov: 38 }}><FinaleScene /></View3D>
      <div className="wrap fin-copy">
        <h2 className="h2 center"><SplitText text="جاهز تنقل كورساتك لدرسلي؟" tag="span" splitType="words" delay={80} textAlign="center" /></h2>
        <p className="lead center light-t">ابدأ كمحاضر، ضيف السكرتير، وطلابك ينزّلوا التطبيق ويطلبوا ينضموا — كله في نفس اليوم.</p>
        <div className="hero-ctas center">
          <Magnet padding={70} magnetStrength={3}><a className="btn btn-primary big" href="#top" onClick={go('top')}>ابدأ كمحاضر<Icon name="arrow" size={18} /></a></Magnet>
          <a className="store" href="#top" onClick={go('top')}><Icon name="play" size={18} /><span><small>حمّل من</small>Google Play</span></a>
          <a className="store" href="#top" onClick={go('top')}><Icon name="apple" size={18} /><span><small>حمّل من</small>App Store</span></a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-in">
        <Logo />
        <span>درسلي © 2026 · كل الحقوق محفوظة</span>
        <nav>{NAV.slice(0, 4).map((n) => <a key={n.id} href={`#${n.id}`} onClick={go(n.id)}>{n.label}</a>)}</nav>
      </div>
    </footer>
  );
}

/* ---------------- shared heading ---------------- */
function Heading({ kicker, title, sub, dark }) {
  return (
    <div className={`heading ${dark ? 'on-dark' : ''}`}>
      <span className={`kicker ${dark ? '' : 'dark-k'}`}><span className="dot" />{kicker}</span>
      <h2 className="h2"><SplitText text={title} tag="span" splitType="words" delay={60} duration={0.9} textAlign="right" /></h2>
      {sub && <p className="lead">{sub}</p>}
    </div>
  );
}
