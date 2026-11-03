// Stroke icons (24px grid), same family as the app.
const P = {
  arrow: 'M19 12H5M11 6l-6 6 6 6', download: 'M12 4v11M7 10l5 5 5-5M5 20h14', shield: 'M12 3l7.5 3v5.5c0 4.6-3.1 8.2-7.5 9.5-4.4-1.3-7.5-4.9-7.5-9.5V6z',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3', moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z', check: 'M5 12.5l4.5 4.5L19 7.5',
  board: 'M4 5h16v11H4zM8 20h8M12 16v4', users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 20a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5a6 6 0 0 1 3 5.5',
  cap: 'M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6', drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  eye: 'M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6', camoff: 'M3 3l18 18M8 6h7l2 2h3v10M17 20H4V8h2M9.5 10.5a3.5 3.5 0 0 0 4 4',
  headphones: 'M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H4zM17 15h3v5h-3z', layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5', hd: 'M3 6h18v12H3zM7 9v6M7 12h3M10 9v6M14 9h1.5a3 3 0 0 1 0 6H14z',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01', play: 'M8 5v14l11-7z', wallet: 'M4 7h15v12H4zM4 7l11-3v3M15 13h4',
  userplus: 'M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M3 21a7 7 0 0 1 12.5-4.3M19 14v6M16 17h6', exam: 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h3',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2', bell: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
  live: 'M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8',
  apple: 'M15 4c-1 .1-2.2.8-2.8 1.6-.6.7-1 1.8-.9 2.8 1.1 0 2.2-.7 2.8-1.5.6-.8 1-1.8.9-2.9zM17.5 12.8c0-2 1.6-3 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.7 0-1.6-.7-2.6-.7-1.4 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.5 2s1.4-.6 2.6-.6 1.5.6 2.6.6 1.7-1 2.4-2c.7-1.1 1-2.2 1-2.3-.1 0-2-.8-2-3.1z'
};
export function Icon({ name, size = 20, stroke = 1.9 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={name === 'play' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[name] || ''} /></svg>
  );
}
