import React from 'react';
import {
  AbsoluteFill, Img, Sequence, interpolate, random, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import events from './events.json';
import me from './me.json'; // file names inside public/me/, empty = placeholder
import {useFonts} from './Reel1';

export const PAPER_DURATION = 360;

const SPIRES = ['#34a853', '#e5484d', '#f29b30', '#3b8fe0', '#a855c7'];
const INK = '#1b1a17';
const CREAM = '#efe6d2';
const HEAD = 'Six Caps, sans-serif';
const BODY = 'Geologica, sans-serif';

// Paper grain: SVG noise as a tiled background
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .32  0 0 0 0 .25  0 0 0 0 .15  0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;
const paper = (bg = CREAM): React.CSSProperties => ({backgroundColor: bg, backgroundImage: GRAIN});

const fit = (t: string, w: number, max: number) => Math.min(max, w / (t.length * 0.62));

// Hand-cut edge: jagged top and bottom
const torn = (seed: string, n = 30, amp = 8) => {
  const top = Array.from({length: n + 1}, (_, i) => `${((i / n) * 100).toFixed(1)}% ${(random(seed + i) * amp).toFixed(1)}px`);
  const bot = Array.from({length: n + 1}, (_, i) => `${(((n - i) / n) * 100).toFixed(1)}% calc(100% - ${(random(seed + 'b' + i) * amp).toFixed(1)}px)`);
  return `polygon(${[...top, ...bot].join(',')})`;
};

const Bg = () => (
  <AbsoluteFill style={{...paper('#cdb48a')}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(60,40,10,.35))'}} />
  </AbsoluteFill>
);

// ---- Accordion fold: n panels hang from each other by a crease and unfold one after another ----
// Each panel is a face (front content) + a plain paper back; shading deepens the more it is folded.
const Accordion = ({n, w, ph, t, render, tint = CREAM}: {
  n: number; w: number; ph: number; t: number; render: (i: number) => React.ReactNode; tint?: string;
}) => {
  const {fps} = useVideoConfig();
  const panel = (i: number): React.ReactNode => {
    const p = i === 0 ? 1 : spring({frame: t - (i - 1) * 8, fps, config: {damping: 13, stiffness: 75, mass: 0.9}});
    const phi = 172 * (1 - p); // stops short of 180 so stacked faces don't z-fight
    const shade = Math.min(1, Math.abs(phi) / 90) * 0.5;
    return (
      <div style={{
        position: 'absolute', left: 0, top: i === 0 ? 0 : ph, width: w, height: ph,
        transformStyle: 'preserve-3d', transformOrigin: '50% 0',
        transform: i === 0 ? undefined : `rotateX(${(i % 2 ? 1 : -1) * phi}deg)`,
      }}>
        <div style={{
          position: 'absolute', inset: 0, ...paper(tint), backfaceVisibility: 'hidden', overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(40,25,5,.35)', borderRadius: i === 0 ? '10px 10px 0 0' : i === n - 1 ? '0 0 10px 10px' : 0,
        }}>
          {render(i)}
          <div style={{position: 'absolute', inset: 0, background: `rgba(30,15,0,${shade})`}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 26, background: 'linear-gradient(rgba(40,25,5,.18), transparent)'}} />
        </div>
        <div style={{position: 'absolute', inset: 0, ...paper('#e3d6b8'), transform: 'rotateX(180deg)', backfaceVisibility: 'hidden'}} />
        {i < n - 1 && panel(i + 1)}
      </div>
    );
  };
  return <div style={{width: w, height: ph * n, perspective: 2600, perspectiveOrigin: '50% 0'}}><div style={{position: 'relative', width: w, height: ph, transformStyle: 'preserve-3d'}}>{panel(0)}</div></div>;
};

// ---- Page flip: the whole scene lifts and swings up around its top edge ----
const FlipOut = ({start, children}: {start: number; children: React.ReactNode}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const a = interpolate(f, [start, durationInFrames], [0, -105], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{perspective: 2200, perspectiveOrigin: '50% 0'}}>
      <AbsoluteFill style={{transformOrigin: '50% 0', transform: `rotateX(${a}deg)`, backfaceVisibility: 'hidden'}}>
        {children}
        <AbsoluteFill style={{background: `rgba(30,15,0,${Math.abs(a) / 105 * 0.6})`}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---- Scene 1: the hook, a folded sticky note opens ----
const Hook = () => {
  const f = useCurrentFrame();
  const w = 860, ph = 300, n = 3;
  const face = (i: number) => (
    <div style={{position: 'absolute', top: -i * ph, left: 0, width: w, height: n * ph, background: '#f6dc7a', padding: '70px 64px'}}>
      <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 40, color: '#8a6d1a', letterSpacing: 6}}>ДРУГ ПИШЕ:</div>
      <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 96, lineHeight: 1.1, color: INK, marginTop: 24}}>
        У Львові нічого не відбувається
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{position: 'absolute', left: 110, top: 380, transform: `rotate(-3deg) scale(${interpolate(f, [0, 100], [1, 1.06])})`}}>
        <Accordion n={n} w={w} ph={ph} t={f - 6} render={face} tint="#f6dc7a" />
      </div>
    </AbsoluteFill>
  );
};

// ---- Scene 2: leporello of events ----
const SHOW = [
  {id: 'it-arena', tag: 'ТЕХНОЛОГІЇ'}, {id: 'khvostyk-fest', tag: 'ХВОСТИКИ'},
  {id: 'dyzarium', tag: 'ДИЗАЙН'}, {id: 'lviv-bookforum', tag: 'КНИГИ'},
];
const Leporello = () => {
  const f = useCurrentFrame();
  const w = 900, ph = 410;
  const card = (i: number) => {
    const e = events.find((x) => x.id === SHOW[i].id)!;
    return (
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: 26, gap: 30}}>
        <Img src={staticFile(`covers/${e.id}.${e.ext}`)} style={{width: 358, height: 358, objectFit: 'cover', borderRadius: 18, flex: 'none'}} />
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{display: 'inline-block', background: SPIRES[i], color: '#fff', fontFamily: BODY, fontWeight: 800, fontSize: 30, padding: '8px 22px', borderRadius: 6, transform: 'rotate(-2deg)'}}>
            {SHOW[i].tag}
          </div>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: fit(e.name, 440, 76), lineHeight: 1.05, color: INK, marginTop: 22}}>{e.name}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{position: 'absolute', left: 90, top: 120}}>
        <Accordion n={SHOW.length} w={w} ph={ph} t={f - 4} render={card} />
      </div>
    </AbsoluteFill>
  );
};

// ---- Scene 3: outro with a photo sticker ----
const Outro = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = (d: number) => spring({frame: f - d, fps, config: {damping: 11, stiffness: 200, mass: 0.7}});
  const photo = me[0] as string | undefined;
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{
          width: 330, height: 330, background: INK, transform: `scale(${pop(4)})`,
          WebkitMask: `url(${staticFile('brand/logo.webp')}) center / contain no-repeat`,
          mask: `url(${staticFile('brand/logo.webp')}) center / contain no-repeat`,
        }} />
        <div style={{fontFamily: HEAD, fontSize: 250, lineHeight: 0.85, color: INK, marginTop: 24, transform: `scale(${pop(10)})`}}>EVENTS LVIV</div>
        {/* photo sticker: white paper border + tape; placeholder until a real photo is added to public/me */}
        <div style={{marginTop: 60, transform: `rotate(${4 - (1 - pop(16)) * 25}deg) scale(${pop(16)})`}}>
          <div style={{position: 'relative', background: '#fff', padding: 22, boxShadow: '0 22px 40px rgba(40,25,5,.4)', borderRadius: 6}}>
            <div style={{position: 'absolute', top: -26, left: 190, width: 190, height: 56, background: 'rgba(240,210,120,.8)', transform: 'rotate(-4deg)'}} />
            {photo ? (
              <Img src={staticFile(`me/${photo}`)} style={{width: 520, height: 520, objectFit: 'cover', display: 'block'}} />
            ) : (
              <div style={{
                width: 520, height: 520, ...paper('#e6dac0'), display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', border: '4px dashed #b5a47c', fontFamily: BODY, fontWeight: 800, fontSize: 52, color: '#9a8a62',
              }}>ТУТ БУДЕ<br />ТВОЄ ФОТО</div>
            )}
          </div>
        </div>
        <div style={{filter: 'drop-shadow(0 10px 14px rgba(40,25,5,.45))', marginTop: 56, transform: `rotate(-2deg) scale(${pop(24)})`}}>
          <div style={{background: SPIRES[2], clipPath: torn('url'), padding: '34px 64px', fontFamily: BODY, fontWeight: 800, fontSize: 52, color: INK}}>
            event.lviv.ua
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PaperDraft = () => {
  useFonts();
  // later sequences paint on top, so the scene that flips away goes last
  return (
    <AbsoluteFill style={{background: '#cdb48a'}}>
      <Sequence from={250}><Outro /></Sequence>
      <Sequence from={86} durationInFrames={178}><FlipOut start={150}><Leporello /></FlipOut></Sequence>
      <Sequence from={0} durationInFrames={100}><FlipOut start={80}><Hook /></FlipOut></Sequence>
    </AbsoluteFill>
  );
};
