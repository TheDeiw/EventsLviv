import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate,
  random, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import events from './events.json';

// Scene lengths in frames at 30 fps
const A = 96, B = 48, C = 330, D = 135, E = 150;
export const DURATION = A + B + C + D + E; // 759 = 25.3 s

const SPIRES = ['#34a853', '#e5484d', '#f29b30', '#3b8fe0', '#a855c7'];
const BG = '#0b0b0e';
const PAPER = '#f5f3ee';
const URL = 'event.lviv.ua';
const HEAD = 'Six Caps, sans-serif';
const BODY = 'Geologica, sans-serif';
const fit = (t: string, w = 980, max = 400) => Math.min(max, w / (t.length * 0.68));

export const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const fonts = [
      new FontFace('Six Caps', `url(${staticFile('fonts/six-caps-latin-400-normal.woff2')})`),
      new FontFace('Geologica', `url(${staticFile('fonts/geologica-cyrillic-wght-normal.woff2')})`, {
        weight: '100 900', unicodeRange: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116',
      }),
      new FontFace('Geologica', `url(${staticFile('fonts/geologica-latin-wght-normal.woff2')})`, {
        weight: '100 900', unicodeRange: 'U+0000-00FF,U+2000-206F,U+20AC,U+2122',
      }),
    ];
    Promise.all(fonts.map((f) => f.load())).then((l) => {
      l.forEach((f) => document.fonts.add(f));
      continueRender(h);
    }).catch(() => continueRender(h));
  }, [h]);
};

const pop = (frame: number, fps: number, delay = 0, damping = 11) =>
  spring({frame: frame - delay, fps, config: {damping, stiffness: 220, mass: 0.7}});

// ---------- A: the hook ----------
const Hook = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const typing = f < 20;
  const s = pop(f, fps, 20);
  const zoom = interpolate(f, [0, A], [1, 1.12]);
  return (
    <AbsoluteFill style={{background: BG, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{transform: `scale(${zoom})`, width: 880}}>
        <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 40, color: '#a1a1aa', marginBottom: 20, marginLeft: 20}}>
          Друг
        </div>
        {typing ? (
          <div style={{display: 'inline-flex', gap: 14, background: '#26262b', padding: '34px 44px', borderRadius: 60}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: 13, background: '#a1a1aa',
                opacity: 0.4 + 0.6 * Math.abs(Math.sin((f + i * 4) / 4)),
              }} />
            ))}
          </div>
        ) : (
          <div style={{
            transform: `scale(${s}) rotate(${(1 - s) * -4}deg)`, transformOrigin: 'left top',
            background: '#26262b', color: '#e4e4e7', fontFamily: BODY, fontWeight: 700,
            fontSize: 74, lineHeight: 1.15, padding: '48px 56px', borderRadius: '70px 70px 70px 14px',
          }}>
            У Львові нічого не відбувається 🙄
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- B: "Бро. Дивись." ----------
const Bro = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const second = f >= 22;
  const s = pop(f % 22, fps, 0, 9);
  const bg = second ? SPIRES[3] : SPIRES[1];
  const shake = f % 22 < 5 ? Math.sin(f * 9) * 14 : 0;
  return (
    <AbsoluteFill style={{background: bg, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{
        fontFamily: BODY, fontWeight: 900, fontSize: fit(second ? 'ДИВИСЬ' : 'БРО.', 960, 420), color: '#fff', lineHeight: 1,
        transform: `scale(${0.4 + 0.6 * s}) translateX(${shake}px)`,
      }}>
        {second ? 'ДИВИСЬ' : 'БРО.'}
      </div>
    </AbsoluteFill>
  );
};

// ---------- C: counter + pile of 61 cards ----------
// gap between cards shrinks so the pile accelerates
const starts: number[] = [];
{
  let t = 6;
  for (let i = 0; i < events.length; i++) {
    starts.push(Math.round(t));
    t += 8 - 6.4 * (i / (events.length - 1));
  }
}

const Card = ({i, f}: {i: number; f: number}) => {
  const {fps} = useVideoConfig();
  const e = events[i];
  const t = f - starts[i];
  if (t < 0) return null;
  const s = pop(t, fps, 0, 12);
  const w = 330;
  const x = 40 + random(`x${i}`) * (1080 - w - 80);
  const y = 640 + random(`y${i}`) * (1920 - 640 - 440);
  const rot = (random(`r${i}`) - 0.5) * 20;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, background: PAPER, borderRadius: 30, padding: 14,
      boxShadow: '0 18px 50px rgba(0,0,0,.55)', opacity: Math.min(1, t / 2),
      transform: `rotate(${rot + (1 - s) * 12}deg) scale(${0.3 + 0.7 * s})`,
    }}>
      <Img src={staticFile(`covers/${e.id}.${e.ext}`)} style={{width: '100%', height: 300, objectFit: 'cover', borderRadius: 20, display: 'block'}} />
      <div style={{
        fontFamily: BODY, fontWeight: 700, fontSize: 30, color: '#17171a', marginTop: 12,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{e.name}</div>
    </div>
  );
};

const Pile = () => {
  const f = useCurrentFrame();
  const count = starts.filter((t) => t <= f).length;
  const last = starts[count - 1] ?? 0;
  const punch = interpolate(f - last, [0, 4], [1.12, 1], {extrapolateRight: 'clamp'});
  const color = SPIRES[count % 5];
  return (
    <AbsoluteFill style={{background: BG}}>
      {events.map((_, i) => <Card key={i} i={i} f={f} />)}
      <AbsoluteFill style={{
        height: 620, background: `linear-gradient(${BG} 70%, transparent)`,
        alignItems: 'center', justifyContent: 'flex-start',
      }}>
        <div style={{
          fontFamily: HEAD, fontSize: 520, lineHeight: 0.8, color, marginTop: 60,
          transform: `scale(${punch})`, transformOrigin: 'center 40%',
        }}>{count}</div>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 58, letterSpacing: 14, color: '#e4e4e7', marginTop: 96}}>
          ПОДІЙ У ЛЬВОВІ
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- D: five callouts ----------
const SHOW = [
  {id: 'it-arena', tag: 'ТЕХНОЛОГІЇ'},
  {id: 'khvostyk-fest', tag: 'ХВОСТИКИ'},
  {id: 'dyzarium', tag: 'ДИЗАЙН'},
  {id: 'lviv-bookforum', tag: 'КНИГИ'},
  {id: 'craft-beer-and-vinyl-music-festival', tag: 'ВІНІЛ І КРАФТ'},
];
const PER = D / SHOW.length;

const Callouts = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(SHOW.length - 1, Math.floor(f / PER));
  const t = f - k * PER;
  const s = pop(t, fps, 0, 10);
  const item = SHOW[k];
  const name = events.find((e) => e.id === item.id)!.name;
  return (
    <AbsoluteFill style={{background: SPIRES[k], justifyContent: 'center', alignItems: 'center'}}>
      <div style={{
        width: 920, background: PAPER, borderRadius: 56, padding: 28, boxShadow: '0 40px 90px rgba(0,0,0,.4)',
        transform: `translateY(${(1 - s) * 500}px) rotate(${(1 - s) * 8 + (k % 2 ? 2 : -2)}deg)`,
      }}>
        <Img src={staticFile(`covers/${item.id}.webp`)} style={{width: '100%', height: 840, objectFit: 'cover', borderRadius: 36, display: 'block'}} />
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 70, color: '#17171a', margin: '28px 8px 4px', lineHeight: 1.1}}>
          {name.length > 24 ? name.replace(' Music Festival', '') : name}
        </div>
      </div>
      <div style={{
        marginTop: 60, fontFamily: BODY, fontWeight: 900, fontSize: fit(item.tag, 960, 190), color: '#fff', lineHeight: 1,
        transform: `scale(${0.5 + 0.5 * s})`,
      }}>{item.tag}</div>
    </AbsoluteFill>
  );
};

// ---------- E: outro ----------
const Outro = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, fps, 0, 14);
  const up = (d: number) => pop(f, fps, d, 16);
  return (
    <AbsoluteFill style={{background: BG, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{
        width: 380, height: 380, background: '#fff', transform: `scale(${s})`,
        WebkitMask: `url(${staticFile('brand/logo.webp')}) center / contain no-repeat`,
        mask: `url(${staticFile('brand/logo.webp')}) center / contain no-repeat`,
      }} />
      <div style={{fontFamily: HEAD, fontSize: 300, color: '#b3b3b3', lineHeight: 0.8, marginTop: 30, transform: `scale(${up(8)})`}}>
        EVENTS LVIV
      </div>
      <div style={{display: 'flex', gap: 14, marginTop: 40}}>
        {SPIRES.map((c, i) => (
          <div key={c} style={{width: 90, height: 14, borderRadius: 7, background: c, transform: `scaleX(${up(14 + i * 3)})`}} />
        ))}
      </div>
      <div style={{
        fontFamily: BODY, fontWeight: 800, fontSize: 78, color: '#e4e4e7', textAlign: 'center',
        lineHeight: 1.15, marginTop: 70, padding: '0 80px', opacity: up(22), transform: `translateY(${(1 - up(22)) * 40}px)`,
      }}>
        Усі події Львова<br />в одному місці
      </div>
      <div style={{
        marginTop: 60, fontFamily: BODY, fontWeight: 700, fontSize: 54, color: BG, background: SPIRES[2],
        padding: '24px 52px', borderRadius: 60, transform: `scale(${up(34)})`,
      }}>{URL}</div>
      <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 44, color: '#a1a1aa', marginTop: 50, opacity: up(46)}}>
        Збережи, щоб не пропустити 📌
      </div>
    </AbsoluteFill>
  );
};

export const Reel1 = ({voice}: {voice: boolean}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: BG}}>
      <Sequence from={0} durationInFrames={A}><Hook /></Sequence>
      <Sequence from={A} durationInFrames={B}><Bro /></Sequence>
      <Sequence from={A + B} durationInFrames={C}><Pile /></Sequence>
      <Sequence from={A + B + C} durationInFrames={D}><Callouts /></Sequence>
      <Sequence from={A + B + C + D} durationInFrames={E}><Outro /></Sequence>
      {voice && <Audio src={staticFile('voice.mp3')} />}
    </AbsoluteFill>
  );
};
