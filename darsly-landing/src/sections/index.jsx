import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import SplitText from '../components/reactbits/SplitText.jsx';
import BlurText from '../components/reactbits/BlurText.jsx';
import RotatingText from '../components/reactbits/RotatingText.jsx';
import DecryptedText from '../components/reactbits/DecryptedText.jsx';
import ScrollReveal from '../components/reactbits/ScrollReveal.jsx';
import GradientText from '../components/reactbits/GradientText.jsx';
import SpotlightCard from '../components/reactbits/SpotlightCard.jsx';
import Magnet from '../components/reactbits/Magnet.jsx';
import StarBorder from '../components/reactbits/StarBorder.jsx';
import CountUp from '../components/reactbits/CountUp.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { LogoLoop } from '../components/reactbits/LogoLoop.jsx';

import { NAV, HERO, MARQUEE, AUDIENCE, JOURNEY, PROTECTION, OFFLINE, TOOLKIT, FACTS, BILLING, FAQ } from '../data/content.js';
import { screen, brand, GALLERY } from '../data/screens.js';
import { Icon } from './icons.jsx';

const Scene3D = lazy(() => import('../three/Scene3D.jsx'));
gsap.registerPlugin(ScrollTrigger);

const go = (id) => (e) => { e.preventDefault(); const el = document.getElementById(id); if (!el) return; window.__lenis ? window.__lenis.scrollTo(el, { offset: -70 }) : el.scrollIntoView({ behavior: 'smooth' }); };

function Lazy3D({ className, ...p }) {
  return <Suspense fallback={<div className={`view3d ${className} loading3d`} />}><Scene3D className={className} {...p} /></Suspense>;
}

/** A phone bezel around a real app screen image. */
export function Shot({ code, alt = '', className = '', eager = false }) {
  return (
    <figure className={`shot ${className}`}>
      <img src={screen(code)} alt={alt} width="600" height="1298" loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </figure>
  );
}

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
    <img src={brand('darsly-logo-white')} alt="درسلي Darsly" width="138" height="38" />
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
    gsap.to('.hero-copy', { yPercent: -14, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
  }, { scope: ref });
  return (
    <section id="top" ref={ref} className="hero dark">
      <div className="hero-bg" aria-hidden="true"><i className="g1" /><i className="g2" /><i className="g3" /><div className="hero-grid-lines" /></div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="kicker"><span className="dot" />{HERO.kicker}</span>
          <h1 className="hero-title">
            <SplitText text={HERO.title} tag="span" splitType="words" delay={70} duration={0.9} textAlign="right" className="t1" />
            <span className="t2">{HERO.title2}</span>
          </h1>
          <div className="hero-rot">
            <span>تطبيق واحد</span>
            <RotatingText texts={HERO.rotating} splitBy="words" mainClassName="rot-pill" rotationInterval={2200} />
          </div>
          <BlurText text={HERO.sub} animateBy="words" delay={25} className="hero-sub" direction="bottom" />
          <div className="hero-ctas" id="start">
            <Magnet padding={60} magnetStrength={3}><a className="btn btn-primary" href="#audience" onClick={go('audience')}>{HERO.primary}<Icon name="arrow" size={18} /></a></Magnet>
            <Magnet padding={60} magnetStrength={4}><a className="btn btn-ghost" href="#screens" onClick={go('screens')}><Icon name="download" size={18} />{HERO.secondary}</a></Magnet>
          </div>
          <div className="hero-badges">
            <span><Icon name="shield" size={16} />فيديو محمي باسم الطالب</span>
            <span><Icon name="lock" size={16} />تحميل مشفّر</span>
            <span><Icon name="moon" size={16} />دارك مود</span>
          </div>
        </div>
        <Lazy3D name="hero" className="hero-3d" progress={progress} camera={{ position: [0, 0, 7.4], fov: 35 }} />
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
      <div dir="ltr"><LogoLoop logos={logos} speed={50} direction="right" logoHeight={40} gap={14} pauseOnHover fadeOut fadeOutWidth={0.08} intro={false} ariaLabel="خصائص درسلي" /></div>
    </section>
  );
}

/* ---------------- AUDIENCE ---------------- */
export function Audience() {
  const icons = { teacher: 'board', secretary: 'users', student: 'cap' };
  const shots = { teacher: 'L47.3', secretary: 'L45.1', student: 'ST1.4' };
  return (
    <section id="audience" className="section light">
      <div className="wrap">
        <Heading kicker="لمين؟" title="تلات أدوار، تطبيق واحد" sub="كل واحد بيشوف اللي يخصّه بس، وكل حاجة متسجّلة باسم اللي عملها." />
        <div className="aud-grid">
          {AUDIENCE.map((a, i) => (
            <AnimatedContent key={a.key} distance={50} delay={i * 0.1} duration={0.8}>
              <SpotlightCard className="aud-card" theme="light" spotlightColor="rgba(31,79,216,0.16)">
                <div className="aud-top"><span className={`aud-ico ${a.key}`}><Icon name={icons[a.key]} size={26} /></span><span className="aud-tag">{a.tag}</span></div>
                <h3>{a.title}</h3>
                <ul>{a.points.map((p) => <li key={p}><Icon name="check" size={16} />{p}</li>)}</ul>
                <div className="aud-peek"><Shot code={shots[a.key]} alt={a.title} /></div>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SCREENS gallery (real app screens) ---------------- */
export function Screens() {
  const [tab, setTab] = useState('student');
  const rail = useRef(null);
  const tabs = [['student', 'تطبيق الطالب'], ['teacher', 'المحاضر والسكرتير'], ['admin', 'الأدمن']];
  const scroll = (dir) => rail.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  useEffect(() => { rail.current?.scrollTo({ left: 0 }); }, [tab]);
  return (
    <section id="screens" className="section dark screens">
      <div className="wrap">
        <Heading kicker="جوه التطبيق" title="ده شكل درسلي بجد" sub="شاشات حقيقية من التطبيق — من غير تزويق." dark />
        <div className="scr-bar">
          <div className="scr-tabs" role="tablist">{tabs.map(([k, t]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{t}</button>)}</div>
          <div className="scr-arrows"><button aria-label="السابق" onClick={() => scroll(1)}><Icon name="arrow" size={18} /></button><button aria-label="التالي" onClick={() => scroll(-1)} className="flip"><Icon name="arrow" size={18} /></button></div>
        </div>
      </div>
      <div className="scr-rail" ref={rail} key={tab}>
        {GALLERY[tab].map(([c, t], i) => (
          <div key={c} className="scr-item" style={{ '--d': `${i * 50}ms` }}>
            <Shot code={c} alt={t} />
            <span className="scr-cap"><b dir="ltr">{c}</b>{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- JOURNEY (pinned, 3D pipeline behind real screens) ---------------- */
const JOURNEY_SHOTS = ['L47.1', 'L47.2', 'L47.4', 'ST6.1'];
export function Journey() {
  const ref = useRef(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const upd = (s) => { progress.current = s.progress; const n = Math.min(3, Math.floor(s.progress * 4)); setStep((o) => (o === n ? o : n)); };
    mm.add('(min-width: 900px)', () => { ScrollTrigger.create({ trigger: ref.current, start: 'top top', end: '+=2000', pin: true, scrub: 0.5, onUpdate: upd }); });
    mm.add('(max-width: 899px)', () => { ScrollTrigger.create({ trigger: ref.current, start: 'top center', end: 'bottom center', scrub: true, onUpdate: upd }); });
  }, { scope: ref });
  return (
    <section id="journey" ref={ref} className="journey dark">
      <Lazy3D name="journey" className="journey-3d" progress={progress} camera={{ position: [1.6, 0.4, 7], fov: 38 }} />
      <div className="wrap journey-grid">
        <div>
          <Heading kicker="رحلة المحاضرة" title="من لينك… لمحاضرة منشورة" sub="المحاضرة مش بتتنشر غير لما الفيديو يجهز فعلاً. المعالجة شغّالة في الطابور، وإنت بيوصلك إشعار." dark />
          <div className="journey-steps">
            {JOURNEY.map((j, i) => (
              <div key={j.n} className={`jstep ${i === step ? 'on' : ''} ${i < step ? 'done' : ''}`}>
                <span className="jn">{j.n}</span>
                <div><h3>{j.title}</h3><p>{j.body}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="journey-phone">
          {JOURNEY_SHOTS.map((c, i) => <Shot key={c} code={c} className={i === step ? 'on' : ''} alt={JOURNEY[i].title} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PROTECTION bento (with real screens) ---------------- */
const PROT_SHOTS = { players: 'ST6.17', capture: 'ST6.11', quality: 'ST6.3', headphones: 'ST6.10', chapters: 'ST6.1', gates: 'ST5.1' };
export function Protection() {
  const icons = { watermark: 'drop', views: 'eye', capture: 'camoff', headphones: 'headphones', players: 'layers', quality: 'hd', chapters: 'list', gates: 'lock' };
  return (
    <section id="protection" className="section light">
      <div className="wrap">
        <Heading kicker="حماية الفيديو" title="محتواك بتاعك — ومش هيطلع برّه" />
        <ScrollReveal baseOpacity={0.15} enableBlur={false} baseRotation={0} containerClassName="reveal" textClassName="reveal-text">
          الطالب بيشوف الفيديو في مشغّل درسلي بس. مفيش يوتيوب ولا درايف ولا لينك يتنسخ. اسمه على الشاشة، والسكرين شوت مقفول، وإنت محدد كام مرة يتفرج.
        </ScrollReveal>
        <div className="bento">
          {PROTECTION.map((f, i) => (
            <AnimatedContent key={f.k} distance={30} delay={(i % 4) * 0.06} className={f.big ? 'b-big' : ''}>
              <SpotlightCard className={`bento-card ${f.k} ${PROT_SHOTS[f.k] ? 'has-shot' : ''}`} theme="light" spotlightColor="rgba(31,79,216,0.14)">
                <div className="b-txt">
                  <span className="b-ico"><Icon name={icons[f.k]} size={24} /></span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                  {f.k === 'watermark' && <WatermarkViz />}
                </div>
                {PROT_SHOTS[f.k] && <div className="b-shot"><Shot code={PROT_SHOTS[f.k]} alt={f.title} /></div>}
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
function WatermarkViz() {
  return <div className="wviz"><span className="wv-play"><Icon name="play" size={22} /></span><span className="wv-mark">عمر أشرف · S-55120</span></div>;
}

/* ---------------- OFFLINE (padlock + real download screens) ---------------- */
export function Offline() {
  const ref = useRef(null);
  const progress = useScrollProgress(ref, { start: 'top 80%', end: 'center center' });
  return (
    <section id="offline" ref={ref} className="section dark offline">
      <div className="wrap off-grid">
        <div className="off-visual">
          <Lazy3D name="lock" className="off-3d" progress={progress} camera={{ position: [0, 0.6, 6], fov: 38 }} />
          <Shot code="ST6.15" className="off-shot a" alt="تحميل المحاضرة" />
          <Shot code="ST7.6" className="off-shot b" alt="تشغيل من غير نت" />
        </div>
        <div>
          <span className="kicker"><span className="dot" />أوفلاين مشفّر</span>
          <h2 className="h2">{OFFLINE.title}<br /><GradientText colors={['#7FA6FF', '#F2A93B', '#7FA6FF']} animationSpeed={6} className="grad">{OFFLINE.title2}</GradientText></h2>
          <div className="cipher" dir="ltr"><Icon name="lock" size={18} /><DecryptedText text={OFFLINE.cipher} animateOn="view" sequential revealDirection="start" speed={45} characters="01ABCDEF#$%&" encryptedClassName="enc" /></div>
          <div className="off-points">
            {OFFLINE.points.map((p, i) => (
              <div key={p.t} className="op"><span className="op-n">{i + 1}</span><div><h4>{p.t}</h4><p>{p.b}</p></div></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TOOLKIT (stacking cards with real screens) ---------------- */
const TOOL_SHOTS = ['ST4.1', 'L45.3', 'ST11.4', 'ST9.3', 'ST12.1', 'ST13.1', 'ST10.7', 'L47.3'];
export function Toolkit() {
  const ref = useRef(null);
  useGSAP(() => {
    const cards = gsap.utils.toArray('.stack-card');
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      gsap.to(card, { scale: 0.94 + i * 0.006, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 60%', end: 'top 20%', scrub: true } });
    });
  }, { scope: ref });
  return (
    <section id="toolkit" ref={ref} className="section light">
      <div className="wrap">
        <Heading kicker="أدوات المحاضر" title="كل اللي بتعمله في السنتر — من موبايلك" sub="الكورس، المجموعات، الطلاب، الفلوس، الامتحانات والتواصل. والسكرتير يقدر يعمل نفس الحاجات بصلاحياتك." />
        <div className="stack">
          {TOOLKIT.map((t, i) => (
            <article key={t.title} className="stack-card" style={{ top: `${100 + i * 12}px` }}>
              <div className="sc-body"><span className="sc-n">{String(i + 1).padStart(2, '0')}</span><h3>{t.title}</h3><p>{t.body}</p><div className="sc-chips">{t.chips.map((c) => <span key={c}>{c}</span>)}</div></div>
              <div className="sc-art"><Shot code={TOOL_SHOTS[i]} alt={t.title} /></div>
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
            <span className="fact-n" dir="ltr"><CountUp to={f.to} duration={2} />{f.suffix}</span>
            <span className="fact-l">{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- BILLING (real invoice screens) ---------------- */
export function Billing() {
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
        <div className="bill-shots">
          <AnimatedContent distance={60} rotate={-3} duration={0.9}><Shot code="L45.1" className="bs a" alt="الفواتير" /></AnimatedContent>
          <AnimatedContent distance={90} rotate={4} duration={0.9} delay={0.12}><Shot code="L45.3" className="bs b" alt="طلاب الكورس في الفاتورة" /></AnimatedContent>
        </div>
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
      <Lazy3D name="finale" className="fin-3d" camera={{ position: [0, 0.3, 6.5], fov: 38 }} />
      <div className="wrap fin-copy">
        <img className="fin-icon" src={brand('darsly-icon-white')} alt="" width="64" height="62" />
        <h2 className="h2 center"><SplitText text="جاهز تنقل كورساتك لدرسلي؟" tag="span" splitType="words" delay={70} textAlign="center" /></h2>
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

function Heading({ kicker, title, sub, dark }) {
  return (
    <div className={`heading ${dark ? 'on-dark' : ''}`}>
      <span className={`kicker ${dark ? '' : 'dark-k'}`}><span className="dot" />{kicker}</span>
      <h2 className="h2"><SplitText text={title} tag="span" splitType="words" delay={50} duration={0.8} textAlign="right" /></h2>
      {sub && <p className="lead">{sub}</p>}
    </div>
  );
}
