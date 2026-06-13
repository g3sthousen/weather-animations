var Z = Object.defineProperty;
var Q = (n, t, e) => t in n ? Z(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var p = (n, t, e) => Q(n, typeof t != "symbol" ? t + "" : t, e);
import { jsx as x } from "react/jsx-runtime";
import { useRef as R, useEffect as F } from "react";
const nn = ["clear", "cloudy", "rain", "snow", "storm", "fog", "wind", "hail"], tn = [
  "new",
  "waxing-crescent",
  "first-quarter",
  "waxing-gibbous",
  "full",
  "waning-gibbous",
  "last-quarter",
  "waning-crescent"
];
function en(n) {
  const t = nn.includes(n.condition) ? n.condition : "clear", e = tn.includes(n.moonPhase) ? n.moonPhase : "full";
  return {
    condition: t,
    intensity: n.intensity ?? "medium",
    time: n.time ?? "day",
    transitionMs: n.transitionMs ?? 1200,
    fidelity: n.fidelity ?? "subtle",
    moonPhase: e
  };
}
function P(n, t, e) {
  const o = Math.max(0, Math.min(1, e));
  return n + (t - n) * o;
}
function L(n, t, e) {
  return Math.max(t, Math.min(e, n));
}
function on(n) {
  return n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2;
}
function f(n) {
  const t = n.replace("#", "");
  return {
    r: parseInt(t.substring(0, 2), 16),
    g: parseInt(t.substring(2, 4), 16),
    b: parseInt(t.substring(4, 6), 16)
  };
}
function O(n, t, e) {
  return {
    r: Math.round(P(n.r, t.r, e)),
    g: Math.round(P(n.g, t.g, e)),
    b: Math.round(P(n.b, t.b, e))
  };
}
function C(n) {
  return `rgb(${n.r},${n.g},${n.b})`;
}
const rn = {
  "clear:day": { top: f("#1a6b9e"), bottom: f("#87ceeb") },
  "clear:night": { top: f("#0a0a2e"), bottom: f("#1a1a4e") },
  "cloudy:day": { top: f("#6b7a8d"), bottom: f("#b0bec5") },
  "cloudy:night": { top: f("#1c2331"), bottom: f("#2d3a4a") },
  "rain:day": { top: f("#3d5166"), bottom: f("#607d8b") },
  "rain:night": { top: f("#1a202c"), bottom: f("#2d3748") },
  "snow:day": { top: f("#b0bec5"), bottom: f("#e8eef4") },
  "snow:night": { top: f("#1a1a3a"), bottom: f("#2d2d50") },
  "storm:day": { top: f("#1a1a2e"), bottom: f("#16213e") },
  "storm:night": { top: f("#0a0a0f"), bottom: f("#11111b") },
  "fog:day": { top: f("#c8cdd2"), bottom: f("#e8eaed") },
  "fog:night": { top: f("#374151"), bottom: f("#4b5563") },
  "wind:day": { top: f("#2563a8"), bottom: f("#93c5fd") },
  "wind:night": { top: f("#1e3a5f"), bottom: f("#1e3a8a") },
  "hail:day": { top: f("#2f3b3a"), bottom: f("#4a5a55") },
  "hail:night": { top: f("#141c1b"), bottom: f("#212e2b") }
};
function E(n) {
  return rn[`${n.condition}:${n.time}`];
}
function B(n, t) {
  return {
    r: Math.round(P(n.r, 255, t)),
    g: Math.round(P(n.g, 255, t)),
    b: Math.round(P(n.b, 255, t))
  };
}
function sn(n, t, e = 0) {
  const o = E(t), i = e > 0 ? B(o.top, e * 0.4) : o.top, r = e > 0 ? B(o.bottom, e * 0.4) : o.bottom;
  n.style.background = `linear-gradient(to bottom, ${C(i)}, ${C(r)})`;
}
function an(n, t, e, o) {
  const i = E(t), r = E(e), s = C(O(i.top, r.top, o)), a = C(O(i.bottom, r.bottom, o));
  n.style.background = `linear-gradient(to bottom, ${s}, ${a})`;
}
let ln = Math.random;
function h() {
  return ln();
}
const W = [6e-3, 0.022, 0.06], hn = { 0: 4, 1: 5, 2: 6 }, cn = { light: 0.55, medium: 1, heavy: 1.5 }, un = { light: 0.75, medium: 1, heavy: 1.2 };
function A(n, t) {
  return n.condition === "storm" ? n.time === "night" ? `rgba(26,26,42,${t})` : `rgba(42,42,58,${t})` : n.condition === "hail" ? n.time === "night" ? `rgba(40,52,50,${t})` : `rgba(70,86,82,${t})` : n.condition === "rain" ? n.time === "night" ? `rgba(58,74,90,${t})` : `rgba(106,122,138,${t})` : n.time === "night" ? `rgba(58,74,106,${t})` : `rgba(208,216,224,${t})`;
}
function _(n, t) {
  const e = n.condition === "storm" ? 0.9 : n.condition === "hail" ? 0.85 : n.condition === "rain" ? 0.75 : n.condition === "wind" ? 0.55 : n.condition === "cloudy" ? 0.7 : 0.5;
  return Math.min(0.95, e * (1 - t * 0.12) * un[n.intensity]);
}
function dn(n) {
  return n !== "clear" && n !== "fog";
}
function N(n, t, e) {
  const o = n / 2, i = t / 2, r = o / i, s = Math.max(4, Math.min(9, Math.round(2 + r * 1.8))), a = e ? 2.4 : 1.8, c = a / Math.max(1, s - 1), u = [];
  for (let d = 0; d < s; d++) {
    const l = s === 1 ? 0.5 : d / (s - 1), b = (l - 0.5) * a + (h() * 2 - 1) * c * 0.15, y = 1 - Math.abs(l - 0.5) * 2, M = Math.min(1.1, 0.62 + y * (e ? 0.18 : 0.42) + (h() * 0.3 - 0.15)), k = 1 - M + h() * 0.08 + (h() * 0.2 - 0.1);
    u.push({ dx: b, dy: k, r: M });
  }
  if (!e && s >= 5) {
    const d = h() < 0.5 ? 1 : 2;
    for (let l = 0; l < d; l++) {
      const b = (0.3 + h() * 0.4 - 0.5) * a * 0.8, y = Math.min(1.15, 0.85 + h() * 0.2), v = 1 - y + 0.05 + h() * 0.1;
      u.push({ dx: b, dy: v, r: y, alpha: 0.45 });
    }
  }
  return u;
}
function K(n, t, e) {
  if (!dn(n.condition)) return [];
  const o = [], i = cn[n.intensity];
  if (n.condition === "storm") {
    const s = [2, 2, 3];
    for (const a of [0, 1, 2]) {
      const c = Math.max(1, Math.round(s[a] * i)), u = 1 + a * 0.4;
      for (let d = 0; d < c; d++) {
        const l = t * (0.18 + h() * 0.14) * u, m = e * (0.3 + h() * 0.2) * u;
        o.push({
          x: d / c * t * 1.3 - t * 0.15,
          y: e * (a * 0.07 + h() * 0.05) - m * 0.15,
          width: l,
          height: m,
          alpha: _(n, a),
          speed: W[a] * t,
          layer: a,
          lobes: N(l, m, !1)
        });
      }
    }
    return o;
  }
  const r = n.condition === "wind" ? [2] : [0, 1, 2];
  for (const s of r) {
    const a = n.condition === "wind" ? 8 : hn[s], c = Math.max(2, Math.round(a * i));
    for (let u = 0; u < c; u++) {
      const d = n.condition === "wind", l = 1 + s * 0.35, m = d ? t * (0.15 + h() * 0.12) : t * (0.22 + h() * 0.18) * l, b = d ? e * 0.04 : e * (0.12 + h() * 0.08) * l;
      o.push({
        x: u / c * t * 1.4 - t * 0.2,
        y: e * (0.04 + s * 0.18 + h() * 0.08),
        width: m,
        height: b,
        alpha: _(n, s),
        speed: W[s] * (d ? 3 : 1) * t,
        layer: s,
        lobes: d ? [] : N(m, b, h() < 0.35)
      });
    }
  }
  return o;
}
function q(n, t, e) {
  for (const o of n)
    o.x += o.speed * t, o.x > e + o.width / 2 && (o.x = -o.width / 2);
}
function fn(n, t) {
  const e = n.width / 2, o = n.height / 2, i = Math.max(2, o * 0.12), r = i * 4 + Math.max(o, e * 0.15), s = Math.ceil(n.width + r * 2), a = Math.ceil(n.height + r * 2), c = new OffscreenCanvas(s, a), u = c.getContext("2d"), d = s / 2, l = a / 2;
  if (n.spriteCx = d, n.spriteCy = l, n.lobes.length === 0) {
    u.filter = `blur(${i}px)`, u.translate(d, l), u.scale(e / o, 1);
    const S = u.createRadialGradient(0, 0, 0, 0, 0, o);
    return S.addColorStop(0, A(t, 1)), S.addColorStop(0.4, A(t, 0.6)), S.addColorStop(1, "rgba(0,0,0,0)"), u.fillStyle = S, u.beginPath(), u.arc(0, 0, o, 0, Math.PI * 2), u.fill(), c;
  }
  const m = new OffscreenCanvas(s, a), b = m.getContext("2d");
  b.fillStyle = A(t, 1);
  for (const S of n.lobes) {
    const j = d + S.dx * e, J = l + S.dy * o;
    b.beginPath(), b.arc(j, J, S.r * o, 0, Math.PI * 2), b.fill();
  }
  u.filter = `blur(${i}px)`, u.drawImage(m, 0, 0), u.filter = "none", u.globalCompositeOperation = "source-atop";
  const y = t.time === "day", v = t.condition === "rain" || t.condition === "storm" || t.condition === "hail", M = y ? "rgba(255,244,214,0.22)" : "rgba(190,205,235,0.10)", k = v ? "rgba(0,0,0,0.35)" : y ? "rgba(0,0,0,0.16)" : "rgba(0,0,0,0.28)", w = u.createLinearGradient(0, l - o * 1.1, 0, l + o * 1.1);
  return w.addColorStop(0, M), w.addColorStop(0.5, "rgba(255,255,255,0)"), w.addColorStop(1, k), u.fillStyle = w, u.fillRect(0, 0, s, a), u.globalCompositeOperation = "source-over", c;
}
function I(n, t, e, o) {
  if (t.length !== 0) {
    n.save();
    for (const i of t) {
      const r = `${e.condition}:${e.time}`;
      (!i.sprite || i.spriteKey !== r) && (i.sprite = fn(i, e), i.spriteKey = r), n.globalAlpha = o * i.alpha, n.drawImage(i.sprite, i.x - (i.spriteCx ?? 0), i.y - (i.spriteCy ?? 0));
    }
    n.restore();
  }
}
function pn(n, t, e, o, i) {
  return t + e * Math.sin(n * o + i);
}
const bn = {
  light: 0.45,
  medium: 0.22,
  heavy: 0
};
function mn(n) {
  return n.condition === "cloudy" ? bn[n.intensity] : n.time === "day" && (n.condition === "clear" || n.condition === "wind") || n.time === "night" && n.condition === "clear" ? 1 : 0;
}
function U() {
  return { lightningFlash: 0, lightningTimer: 2e3, boltPoints: null, time: 0, fogPlumes: null, preflicker: 0, boltBranches: null };
}
function G(n, t, e) {
  if (n.time += e, t.condition === "storm") {
    if (n.lightningTimer -= e * 1e3, n.lightningTimer <= 0 && n.preflicker <= 0 && n.lightningFlash <= 0 && (n.preflicker = 1), n.preflicker > 0 && (n.preflicker = Math.max(0, n.preflicker - e * 12), n.preflicker <= 0)) {
      n.lightningFlash = 1;
      const o = t.intensity === "heavy" ? 1500 : t.intensity === "medium" ? 2500 : 4e3;
      n.lightningTimer = o + h() * o;
      const i = gn();
      n.boltPoints = i, n.boltBranches = yn(i);
    }
    n.lightningFlash = Math.max(0, n.lightningFlash - e * 3.5), n.lightningFlash <= 0 && (n.boltPoints = null, n.boltBranches = null);
  } else
    n.lightningFlash = 0, n.lightningTimer = 2e3, n.boltPoints = null, n.preflicker = 0, n.boltBranches = null;
  if (t.condition === "fog") {
    n.fogPlumes || (n.fogPlumes = Array.from({ length: 4 }, (o, i) => ({
      baseX: h(),
      baseY: 0.45 + i * 0.14 + h() * 0.06,
      speed: 0.01 + h() * 0.02,
      bobAmp: 8 + h() * 10,
      bobFreq: 0.15 + h() * 0.15,
      phase: h() * Math.PI * 2
    })));
    for (const o of n.fogPlumes)
      o.baseX += o.speed * e, o.baseX > 1.3 && (o.baseX -= 1.6);
  } else
    n.fogPlumes = null;
}
function T(n, t, e, o, i, r) {
  n.save(), n.globalAlpha = o, t.condition === "fog" && Cn(n, t, e, i, r);
  const s = Math.max(e.lightningFlash, e.preflicker * 0.4);
  if (s > 0 && (n.globalAlpha = o * s * 0.45, n.fillStyle = "rgba(200,220,255,1)", n.fillRect(0, 0, i, r), e.boltPoints && e.lightningFlash > 0 && (Y(n, e.boltPoints, o * e.lightningFlash, i, r), e.boltBranches)))
    for (const a of e.boltBranches)
      Y(n, a, o * e.lightningFlash * 0.7, i, r);
  if (t.fidelity === "rich" && e.lightningFlash > 0 && t.condition === "storm") {
    n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = o * e.lightningFlash * 0.5;
    const a = n.createLinearGradient(0, 0, 0, r * 0.5);
    a.addColorStop(0, "rgba(150,180,255,0.6)"), a.addColorStop(1, "rgba(150,180,255,0)"), n.fillStyle = a, n.fillRect(0, 0, i, r * 0.5), n.restore();
  }
  n.restore();
}
function z(n, t, e, o, i, r) {
  const s = mn(t);
  s <= 0 || (n.save(), n.globalAlpha = o * s, t.time === "day" ? Sn(n, t, e, i, r) : vn(n, t, i, r), n.restore());
}
function gn() {
  const n = 0.2 + h() * 0.6, t = [[n, 0.08]];
  let e = n;
  for (let o = 1; o <= 8; o++)
    e += (h() - 0.5) * 0.13, e = Math.max(0.05, Math.min(0.95, e)), t.push([e, 0.08 + 0.52 * o / 8]);
  return t;
}
function yn(n) {
  const t = [], e = 1 + Math.floor(h() * 2);
  for (let o = 0; o < e; o++) {
    const i = 2 + Math.floor(h() * (n.length - 3)), [r, s] = n[i];
    let a = r, c = s;
    const u = [[a, c]], d = h() < 0.5 ? -1 : 1;
    for (let l = 0; l < 3; l++)
      a = Math.max(0.02, Math.min(0.98, a + d * (0.04 + h() * 0.05))), c = Math.min(0.95, c + 0.06 + h() * 0.05), u.push([a, c]);
    t.push(u);
  }
  return t;
}
function Y(n, t, e, o, i) {
  n.save(), n.globalAlpha = e, n.lineCap = "round", n.lineJoin = "round";
  const r = () => {
    n.beginPath(), n.moveTo(t[0][0] * o, t[0][1] * i);
    for (let s = 1; s < t.length; s++)
      n.lineTo(t[s][0] * o, t[s][1] * i);
  };
  r(), n.strokeStyle = "rgba(140,180,255,0.5)", n.lineWidth = 10, n.shadowColor = "#90b8ff", n.shadowBlur = 30, n.stroke(), r(), n.strokeStyle = "rgba(200,220,255,0.85)", n.lineWidth = 3.5, n.shadowBlur = 12, n.stroke(), r(), n.strokeStyle = "#ffffff", n.lineWidth = 1.5, n.shadowBlur = 0, n.stroke(), n.restore();
}
function Sn(n, t, e, o, i) {
  const r = o * 0.75, s = i * 0.18, a = Math.min(o, i) * 0.08, c = n.createRadialGradient(r, s, a * 0.4, r, s, a * 4);
  if (c.addColorStop(0, "rgba(255,240,180,0.45)"), c.addColorStop(0.5, "rgba(255,240,180,0.12)"), c.addColorStop(1, "rgba(255,240,180,0)"), n.fillStyle = c, n.fillRect(r - a * 4, s - a * 4, a * 8, a * 8), t.fidelity === "rich") {
    n.save(), n.translate(r, s), n.rotate(e.time * 0.05), n.globalAlpha = 0.12, n.strokeStyle = "rgba(255,245,200,1)", n.lineWidth = 2;
    for (let d = 0; d < 12; d++) {
      const l = d / 12 * Math.PI * 2;
      n.beginPath(), n.moveTo(Math.cos(l) * a * 1.3, Math.sin(l) * a * 1.3), n.lineTo(Math.cos(l) * a * 2.6, Math.sin(l) * a * 2.6), n.stroke();
    }
    n.restore();
  }
  const u = n.createRadialGradient(r, s, 0, r, s, a);
  u.addColorStop(0, "#fffde7"), u.addColorStop(1, "#ffe082"), n.fillStyle = u, n.beginPath(), n.arc(r, s, a, 0, Math.PI * 2), n.fill();
}
function vn(n, t, e, o) {
  const i = e * 0.75, r = o * 0.18, s = Math.min(e, o) * 0.06, a = t.moonPhase, c = a === "new";
  if (!c) {
    const b = n.createRadialGradient(i, r, s, i, r, s * 2.6);
    b.addColorStop(0, "rgba(220,230,245,0.22)"), b.addColorStop(1, "rgba(220,230,245,0)"), n.fillStyle = b, n.beginPath(), n.arc(i, r, s * 2.6, 0, Math.PI * 2), n.fill();
  }
  const u = n.createRadialGradient(i - s * 0.15, r - s * 0.2, 0, i, r, s);
  if (u.addColorStop(0, c ? "rgba(155,165,185,0.18)" : "rgba(70,76,92,0.55)"), u.addColorStop(1, c ? "rgba(100,110,130,0.13)" : "rgba(38,44,58,0.6)"), n.fillStyle = u, n.beginPath(), n.arc(i, r, s, 0, Math.PI * 2), n.fill(), c) {
    n.strokeStyle = "rgba(190,200,220,0.14)", n.lineWidth = Math.max(1, s * 0.035), n.beginPath(), n.arc(i, r, s, 0, Math.PI * 2), n.stroke();
    return;
  }
  n.save(), Pn(n, i, r, s, a), n.clip();
  const d = n.createRadialGradient(i - s * 0.2, r - s * 0.2, 0, i, r, s);
  d.addColorStop(0, "#fffde7"), d.addColorStop(0.6, "#fff8e1"), d.addColorStop(1, "#ffecb3"), n.fillStyle = d, n.beginPath(), n.arc(i, r, s, 0, Math.PI * 2), n.fill();
  const l = a === "waxing-crescent" || a === "waning-crescent" ? 0.18 : 0.35;
  n.fillStyle = `rgba(180,185,200,${l})`;
  const m = [[-0.3, -0.2, 0.18], [0.25, 0.1, 0.13], [0.05, 0.35, 0.1]];
  for (const [b, y, v] of m)
    n.beginPath(), n.arc(i + b * s, r + y * s, v * s, 0, Math.PI * 2), n.fill();
  n.restore();
}
function Pn(n, t, e, o, i) {
  const r = Mn(i);
  if (n.beginPath(), r.kind === "full") {
    n.arc(t, e, o, 0, Math.PI * 2);
    return;
  }
  const s = r.side;
  if (n.moveTo(t, e - o), n.arc(t, e, o, -Math.PI / 2, Math.PI / 2, s < 0), r.kind === "quarter")
    n.lineTo(t, e - o);
  else {
    const a = r.kind === "crescent" ? 0.62 : -0.42, c = t + s * o * a;
    n.bezierCurveTo(c, e + o * 0.7, c, e - o * 0.7, t, e - o);
  }
  n.closePath();
}
function Mn(n) {
  switch (n) {
    case "waxing-crescent":
      return { kind: "crescent", side: 1 };
    case "first-quarter":
      return { kind: "quarter", side: 1 };
    case "waxing-gibbous":
      return { kind: "gibbous", side: 1 };
    case "waning-gibbous":
      return { kind: "gibbous", side: -1 };
    case "last-quarter":
      return { kind: "quarter", side: -1 };
    case "waning-crescent":
      return { kind: "crescent", side: -1 };
    case "full":
    case "new":
      return { kind: "full" };
  }
}
function wn(n, t) {
  const e = Math.ceil(n * 2), o = new OffscreenCanvas(e, e), i = o.getContext("2d"), r = t ? "90,100,112" : "205,210,216", s = i.createRadialGradient(n, n, 0, n, n, n);
  return s.addColorStop(0, `rgba(${r},0.5)`), s.addColorStop(0.5, `rgba(${r},0.22)`), s.addColorStop(1, `rgba(${r},0)`), i.fillStyle = s, i.beginPath(), i.arc(n, n, n, 0, Math.PI * 2), i.fill(), o;
}
function Cn(n, t, e, o, i) {
  if (!e.fogPlumes) return;
  const r = t.time === "night", s = o * 0.4;
  for (const a of e.fogPlumes) {
    (!a.sprite || a.spriteR !== s) && (a.sprite = wn(s, r), a.spriteR = s);
    const c = a.baseX * o - s, u = pn(e.time, a.baseY * i, a.bobAmp, a.bobFreq, a.phase) - s;
    n.drawImage(a.sprite, c, u), a.baseX * o - s > o - s * 2 && n.drawImage(a.sprite, c - o - s * 2, u);
  }
}
class kn {
  constructor(t) {
    p(this, "particles");
    p(this, "cursor", 0);
    this.particles = Array.from({ length: t }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      alpha: 0,
      size: 1,
      length: 1,
      phase: 0,
      depth: 0.5,
      bounces: 0,
      kind: "primary",
      active: !1
    }));
  }
  spawn() {
    const t = this.cursor;
    do {
      const e = this.particles[this.cursor];
      if (this.cursor = (this.cursor + 1) % this.particles.length, !e.active)
        return e.active = !0, e;
    } while (this.cursor !== t);
    return null;
  }
  reset() {
    for (const t of this.particles) t.active = !1;
    this.cursor = 0;
  }
}
const An = { light: 0.3, medium: 0.65, heavy: 1 };
function H(n) {
  return An[n.intensity];
}
const In = { subtle: 1, rich: 1.8 };
function Tn(n) {
  return In[n.fidelity];
}
function g(n, t, e) {
  return t + (e - t) * n;
}
const $ = 0.15;
function zn(n) {
  return n !== "light";
}
function En(n, t, e) {
  return t * L(n / e, 0, 1);
}
function $n(n, t) {
  return 1 - L(n / t, 0, 1);
}
function Ln(n, t, e, o) {
  return t + e * Math.sin(n * o);
}
function Rn(n, t) {
  return -n * t;
}
function Fn(n, t, e, o) {
  return t >= e || Math.abs(n) < o;
}
const On = 900;
class V {
  constructor() {
    p(this, "pool");
    p(this, "spawnAccum", 0);
    p(this, "time", 0);
    p(this, "config", null);
    p(this, "width", 0);
    p(this, "height", 0);
    this.pool = new kn(On);
  }
  init(t, e, o) {
    if (this.config = t, this.width = e, this.height = o, this.pool.reset(), this.spawnAccum = 0, this.time = 0, t.condition === "clear" && t.time === "night") {
      const i = Math.floor(120 * H(t));
      for (let r = 0; r < i; r++) Hn(this.pool, e, o);
    }
  }
  update(t) {
    if (!this.config) return;
    this.time += t;
    const e = this.config, o = H(e) * Tn(e), i = this.width, r = this.height, s = e.fidelity === "rich", a = Ln(this.time, -20, 12, 0.4);
    for (const l of this.pool.particles)
      if (l.active) {
        if (l.x += l.vx * t, l.y += l.vy * t, l.phase += t, l.kind === "splash") {
          l.phase >= $ && (l.active = !1);
          continue;
        }
        if (l.kind === "droplet") {
          l.vy += 500 * t, l.alpha -= t * 4, (l.alpha <= 0 || l.y > r + 10) && (l.active = !1);
          continue;
        }
        if (l.kind === "leaf" && (l.phase += t * 6), e.condition === "snow" && (l.vx = Math.sin(l.phase * 0.8) * 18), e.condition === "rain" && (l.vx = a * g(l.depth, 0.6, 1)), e.condition === "clear" && e.time === "night" && (l.alpha = 0.5 + 0.5 * Math.sin(l.phase * 2.5 + l.size)), (e.condition === "rain" || e.condition === "storm") && l.kind === "primary" && l.y > r && zn(e.intensity)) {
          const m = s ? 0.3 : 0.6;
          l.depth > m && (_n(this.pool, l.x, r, s, e.intensity), s && Nn(this.pool, l.x, r, 2 + Math.floor(h() * 3))), l.active = !1;
          continue;
        }
        if (e.condition === "hail" && l.bounces > 0 && (l.vy += 980 * t), e.condition === "hail" && l.kind === "primary" && l.y > r) {
          s && !Fn(l.vy, l.bounces, 2, 80) ? (l.y = r, l.vy = Rn(l.vy, 0.4), l.vx += (h() - 0.5) * 60, l.size *= 0.8, l.bounces += 1) : l.active = !1;
          continue;
        }
        (l.y > r + 20 || l.x < -20 || l.x > i + 20 || l.y < -20) && (l.active = !1);
      }
    const c = {
      rain: 120 * o,
      "storm-rain": 280 * o,
      snow: 30 * o,
      wind: 60 * o,
      hail: 90 * o
    }, u = e.condition === "storm" ? "storm-rain" : e.condition, d = c[u];
    if (d)
      for (this.spawnAccum += d * t; this.spawnAccum >= 1; )
        this.spawnAccum -= 1, e.condition === "rain" ? qn(this.pool, i) : e.condition === "storm" ? Gn(this.pool, i) : e.condition === "snow" ? Yn(this.pool, i) : e.condition === "wind" ? Dn(this.pool, i, r, s) : e.condition === "hail" && Xn(this.pool, i);
  }
  draw(t, e, o) {
    const i = o ?? this.config;
    if (i) {
      t.save();
      for (const r of this.pool.particles)
        r.active && Bn(t, r, i, e);
      t.restore();
    }
  }
}
function Bn(n, t, e, o) {
  if (t.kind === "droplet") {
    n.globalAlpha = o * t.alpha, n.fillStyle = "rgba(180,205,225,1)", n.beginPath(), n.arc(t.x, t.y, t.size, 0, Math.PI * 2), n.fill();
    return;
  }
  if (t.kind === "splash") {
    const i = En(t.phase, t.size, $), r = $n(t.phase, $), s = e.intensity === "heavy";
    n.globalAlpha = o * r * (s ? 0.9 : 0.75), n.strokeStyle = "rgba(180,205,225,1)", n.lineWidth = s ? 2 : 1.5, n.beginPath(), n.ellipse(t.x, t.y, i, i * 0.35, 0, 0, Math.PI * 2), n.stroke();
    return;
  }
  if (t.kind === "leaf") {
    n.save(), n.globalAlpha = o * t.alpha, n.translate(t.x, t.y), n.rotate(t.phase), n.fillStyle = "rgba(150,170,90,1)", n.beginPath(), n.ellipse(0, 0, t.size, t.size * 0.5, 0, 0, Math.PI * 2), n.fill(), n.restore();
    return;
  }
  if (n.globalAlpha = o * t.alpha, e.condition === "rain" || e.condition === "storm")
    n.strokeStyle = e.condition === "storm" ? "rgba(180,200,220,0.8)" : "rgba(160,190,220,0.7)", n.lineWidth = e.condition === "storm" ? 1.5 : 1, n.beginPath(), n.moveTo(t.x, t.y), n.lineTo(t.x + t.vx * 0.04, t.y + t.length), n.stroke();
  else if (e.condition === "snow") {
    if (t.depth < 0.5) {
      const i = n.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.size);
      i.addColorStop(0, `rgba(255,255,255,${t.alpha})`), i.addColorStop(1, "rgba(255,255,255,0)"), n.fillStyle = i;
    } else
      n.fillStyle = `rgba(255,255,255,${t.alpha})`;
    n.beginPath(), n.arc(t.x, t.y, t.size, 0, Math.PI * 2), n.fill();
  } else if (e.condition === "clear" && e.time === "night") {
    if (n.fillStyle = `rgba(255,255,240,${t.alpha})`, n.beginPath(), n.arc(t.x, t.y, t.size, 0, Math.PI * 2), n.fill(), t.length > 0 && e.fidelity === "rich") {
      n.globalAlpha = o * t.alpha * 0.6, n.strokeStyle = "rgba(255,255,240,1)", n.lineWidth = 0.75;
      const i = t.size * 3;
      n.beginPath(), n.moveTo(t.x - i, t.y), n.lineTo(t.x + i, t.y), n.moveTo(t.x, t.y - i), n.lineTo(t.x, t.y + i), n.stroke();
    }
  } else e.condition === "wind" ? (n.strokeStyle = `rgba(180,210,240,${t.alpha})`, n.lineWidth = 1, n.beginPath(), n.moveTo(t.x, t.y), n.quadraticCurveTo(t.x + t.length * 0.5, t.y - t.length * 0.12, t.x + t.length, t.y), n.stroke()) : e.condition === "hail" && (n.fillStyle = `rgba(225,235,245,${t.alpha})`, n.beginPath(), n.arc(t.x, t.y, t.size, 0, Math.PI * 2), n.fill(), n.globalAlpha = o * t.alpha * 0.5, n.strokeStyle = "rgba(255,255,255,0.9)", n.lineWidth = 0.75, n.beginPath(), n.arc(t.x - t.size * 0.25, t.y - t.size * 0.25, t.size * 0.6, 0, Math.PI * 2), n.stroke());
}
const Wn = { light: 1, medium: 1.4, heavy: 2 };
function _n(n, t, e, o, i) {
  const r = n.spawn();
  if (!r) return;
  const s = Wn[i];
  r.x = t, r.y = e - 1, r.vx = 0, r.vy = 0, r.alpha = 1, r.size = (o ? 8 + h() * 5 : 5 + h() * 3) * s, r.length = 0, r.phase = 0, r.depth = 1, r.bounces = 0, r.kind = "splash";
}
function Nn(n, t, e, o) {
  for (let i = 0; i < o; i++) {
    const r = n.spawn();
    if (!r) break;
    r.x = t + (h() - 0.5) * 6, r.y = e - 1, r.vx = (h() - 0.5) * 180, r.vy = -(50 + h() * 100), r.alpha = 0.6 + h() * 0.4, r.size = 1 + h() * 1.5, r.length = 0, r.phase = 0, r.depth = 1, r.bounces = 0, r.kind = "droplet";
  }
}
function qn(n, t) {
  const e = n.spawn();
  if (!e) return;
  const o = h();
  e.x = h() * (t + 100) - 50, e.y = -10, e.vx = -20 * g(o, 0.6, 1), e.vy = (650 + h() * 200) * g(o, 0.55, 1), e.alpha = (0.4 + h() * 0.4) * g(o, 0.5, 1), e.size = 1, e.length = (14 + h() * 10) * g(o, 0.5, 1), e.phase = 0, e.depth = o, e.bounces = 0, e.kind = "primary";
}
function Gn(n, t) {
  const e = n.spawn();
  e && (e.x = h() * (t + 100) - 50, e.y = -10, e.vx = -35, e.vy = 900 + h() * 300, e.alpha = 0.5 + h() * 0.4, e.size = 1, e.length = 20 + h() * 14, e.phase = 0, e.depth = h(), e.bounces = 0, e.kind = "primary");
}
function Yn(n, t) {
  const e = n.spawn();
  if (!e) return;
  const o = h();
  e.x = h() * t, e.y = -10, e.vx = 0, e.vy = (40 + h() * 50) * g(o, 0.5, 1), e.alpha = (0.6 + h() * 0.4) * g(o, 0.5, 1), e.size = (1.5 + h() * 3) * g(o, 0.5, 1), e.length = 0, e.phase = h() * Math.PI * 2, e.depth = o, e.bounces = 0, e.kind = "primary";
}
function Hn(n, t, e) {
  const o = n.spawn();
  if (!o) return;
  const i = h() < 0.12;
  o.x = h() * t, o.y = h() * e * 0.7, o.vx = 0, o.vy = 0, o.alpha = 0.3 + h() * 0.7, o.size = i ? 1.6 + h() * 1.2 : 0.5 + h() * 1.5, o.length = i ? 1 : 0, o.phase = h() * Math.PI * 2, o.depth = 0.5, o.bounces = 0, o.kind = "primary";
}
function Dn(n, t, e, o) {
  const i = n.spawn();
  if (!i) return;
  const r = h(), s = o && h() < 0.12;
  i.x = -20, i.y = h() * e, i.vx = (300 + h() * 200) * g(r, 0.55, 1), i.vy = s ? (h() - 0.5) * 40 : 0, i.alpha = (0.2 + h() * 0.5) * g(r, 0.5, 1), i.size = s ? 3 + h() * 3 : 1, i.length = (30 + h() * 60) * g(r, 0.5, 1), i.phase = h() * Math.PI * 2, i.depth = r, i.bounces = 0, i.kind = s ? "leaf" : "primary";
}
function Xn(n, t) {
  const e = n.spawn();
  if (!e) return;
  const o = h();
  e.x = h() * (t + 60) - 30, e.y = -10, e.vx = -8 * g(o, 0.5, 1), e.vy = (700 + h() * 250) * g(o, 0.55, 1), e.alpha = (0.7 + h() * 0.3) * g(o, 0.5, 1), e.size = (2 + h() * 2.5) * g(o, 0.5, 1), e.length = 0, e.phase = 0, e.depth = o, e.bounces = 0, e.kind = "primary";
}
function Kn(n, t) {
  return { from: n, to: t, elapsed: 0 };
}
function Un(n, t) {
  return {
    ...n,
    elapsed: Math.min(n.elapsed + t * 1e3, n.to.transitionMs)
  };
}
function Vn(n) {
  const t = L(n.elapsed / n.to.transitionMs, 0, 1);
  return on(t);
}
function jn(n) {
  return n.elapsed >= n.to.transitionMs;
}
function Jn(n, t, e) {
  const o = new V();
  return o.init(n, t, e), {
    current: n,
    currentClouds: K(n, t, e),
    currentPS: o,
    currentAtmo: U(),
    transition: null,
    transClouds: null,
    transPS: null,
    transAtmo: null
  };
}
function Zn(n, t, e, o) {
  const i = n.current, r = new V();
  return r.init(t, e, o), {
    ...n,
    transition: Kn(i, t),
    transClouds: K(t, e, o),
    transPS: r,
    transAtmo: U()
  };
}
function D(n, t, e, o) {
  let i = { ...n };
  if (G(i.currentAtmo, i.current, t), i.currentPS.update(t), q(i.currentClouds, t, e), i.transition) {
    const r = Un(i.transition, t);
    i.transition = r, i.transAtmo && G(i.transAtmo, r.to, t), i.transPS && i.transPS.update(t), i.transClouds && q(i.transClouds, t, e), jn(r) && (i = {
      current: r.to,
      currentClouds: i.transClouds,
      currentPS: i.transPS,
      currentAtmo: i.transAtmo,
      transition: null,
      transClouds: null,
      transPS: null,
      transAtmo: null
    });
  }
  return i;
}
function X(n, t, e, o, i) {
  if (e.clearRect(0, 0, o, i), n.transition) {
    const r = Vn(n.transition), s = n.transition.from, a = n.transition.to, c = 1 - r;
    an(t, s, a, r), z(e, s, n.currentAtmo, c, o, i), n.transAtmo && z(e, a, n.transAtmo, r, o, i), I(e, n.currentClouds, s, c), T(e, s, n.currentAtmo, c, o, i), n.currentPS.draw(e, c, s), n.transClouds && I(e, n.transClouds, a, r), n.transAtmo && T(e, a, n.transAtmo, r, o, i), n.transPS && n.transPS.draw(e, r, a);
  } else
    sn(t, n.current, n.currentAtmo.lightningFlash), z(e, n.current, n.currentAtmo, 1, o, i), I(e, n.currentClouds, n.current, 1), T(e, n.current, n.currentAtmo, 1, o, i), n.currentPS.draw(e, 1, n.current);
}
class Qn {
  constructor(t, e = {}) {
    p(this, "destroyed", !1);
    p(this, "skyEl");
    p(this, "canvas");
    p(this, "ctx");
    p(this, "rafId", null);
    p(this, "lastTimestamp", null);
    p(this, "engineState", null);
    p(this, "resizeObserver");
    p(this, "manual");
    if (this.container = t, !t) throw new Error("WeatherScene: container element is required");
    this.manual = e.manual ?? !1, getComputedStyle(t).position === "static" && (t.style.position = "relative"), t.style.overflow = "hidden", this.skyEl = document.createElement("div"), this.skyEl.style.cssText = "position:absolute;inset:0;", this.canvas = document.createElement("canvas"), this.canvas.style.cssText = "position:absolute;inset:0;", t.appendChild(this.skyEl), t.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d"), this.resizeCanvas(), this.resizeObserver = new ResizeObserver(() => this.resizeCanvas()), this.resizeObserver.observe(t);
  }
  resizeCanvas() {
    const { offsetWidth: t, offsetHeight: e } = this.container;
    this.canvas.width = t, this.canvas.height = e;
  }
  set(t) {
    if (this.destroyed) return;
    const e = en(t), { offsetWidth: o, offsetHeight: i } = this.container;
    this.engineState ? this.engineState = Zn(this.engineState, e, o, i) : (this.engineState = Jn(e, o, i), this.manual || this.startLoop());
  }
  /** Deterministically tick + render N frames at a fixed delta (test hook). */
  advance(t, e = 1 / 60) {
    if (this.destroyed || !this.engineState || !this.ctx) return;
    const o = this.canvas.width, i = this.canvas.height;
    for (let r = 0; r < t; r++)
      this.engineState = D(this.engineState, e, o);
    X(this.engineState, this.skyEl, this.ctx, o, i);
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.stopLoop(), this.resizeObserver.disconnect(), this.skyEl.remove(), this.canvas.remove(), this.engineState = null);
  }
  startLoop() {
    const t = (e) => {
      if (this.destroyed) return;
      const o = this.lastTimestamp != null ? Math.min((e - this.lastTimestamp) / 1e3, 0.1) : 0;
      if (this.lastTimestamp = e, this.engineState && this.ctx) {
        const i = this.canvas.width, r = this.canvas.height;
        this.engineState = D(this.engineState, o, i), X(this.engineState, this.skyEl, this.ctx, i, r);
      }
      this.rafId = requestAnimationFrame(t);
    };
    this.rafId = requestAnimationFrame(t);
  }
  stopLoop() {
    this.rafId != null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.lastTimestamp = null;
  }
}
function et({
  condition: n,
  intensity: t,
  time: e,
  transitionMs: o,
  className: i,
  style: r
}) {
  const s = R(null), a = R(null);
  return F(() => {
    if (s.current)
      return a.current = new Qn(s.current), () => {
        var c;
        (c = a.current) == null || c.destroy(), a.current = null;
      };
  }, []), F(() => {
    var c;
    (c = a.current) == null || c.set({ condition: n, intensity: t, time: e, transitionMs: o });
  }, [n, t, e, o]), /* @__PURE__ */ x("div", { ref: s, className: i, style: r });
}
export {
  et as WeatherBackground
};
