var Z = Object.defineProperty;
var Q = (n, t, o) => t in n ? Z(n, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : n[t] = o;
var p = (n, t, o) => Q(n, typeof t != "symbol" ? t + "" : t, o);
import { jsx as x } from "react/jsx-runtime";
import { useRef as F, useEffect as L } from "react";
const nn = ["clear", "cloudy", "rain", "snow", "storm", "fog", "wind", "hail"];
function tn(n) {
  return {
    condition: nn.includes(n.condition) ? n.condition : "clear",
    intensity: n.intensity ?? "medium",
    time: n.time ?? "day",
    transitionMs: n.transitionMs ?? 1200,
    fidelity: n.fidelity ?? "subtle"
  };
}
function v(n, t, o) {
  const e = Math.max(0, Math.min(1, o));
  return n + (t - n) * e;
}
function R(n, t, o) {
  return Math.max(t, Math.min(o, n));
}
function on(n) {
  return n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2;
}
function d(n) {
  const t = n.replace("#", "");
  return {
    r: parseInt(t.substring(0, 2), 16),
    g: parseInt(t.substring(2, 4), 16),
    b: parseInt(t.substring(4, 6), 16)
  };
}
function O(n, t, o) {
  return {
    r: Math.round(v(n.r, t.r, o)),
    g: Math.round(v(n.g, t.g, o)),
    b: Math.round(v(n.b, t.b, o))
  };
}
function w(n) {
  return `rgb(${n.r},${n.g},${n.b})`;
}
const en = {
  "clear:day": { top: d("#1a6b9e"), bottom: d("#87ceeb") },
  "clear:night": { top: d("#0a0a2e"), bottom: d("#1a1a4e") },
  "cloudy:day": { top: d("#6b7a8d"), bottom: d("#b0bec5") },
  "cloudy:night": { top: d("#1c2331"), bottom: d("#2d3a4a") },
  "rain:day": { top: d("#3d5166"), bottom: d("#607d8b") },
  "rain:night": { top: d("#1a202c"), bottom: d("#2d3748") },
  "snow:day": { top: d("#b0bec5"), bottom: d("#e8eef4") },
  "snow:night": { top: d("#1a1a3a"), bottom: d("#2d2d50") },
  "storm:day": { top: d("#1a1a2e"), bottom: d("#16213e") },
  "storm:night": { top: d("#0a0a0f"), bottom: d("#11111b") },
  "fog:day": { top: d("#c8cdd2"), bottom: d("#e8eaed") },
  "fog:night": { top: d("#374151"), bottom: d("#4b5563") },
  "wind:day": { top: d("#2563a8"), bottom: d("#93c5fd") },
  "wind:night": { top: d("#1e3a5f"), bottom: d("#1e3a8a") },
  "hail:day": { top: d("#2f3b3a"), bottom: d("#4a5a55") },
  "hail:night": { top: d("#141c1b"), bottom: d("#212e2b") }
};
function E(n) {
  return en[`${n.condition}:${n.time}`];
}
function B(n, t) {
  return {
    r: Math.round(v(n.r, 255, t)),
    g: Math.round(v(n.g, 255, t)),
    b: Math.round(v(n.b, 255, t))
  };
}
function rn(n, t, o = 0) {
  const e = E(t), i = o > 0 ? B(e.top, o * 0.4) : e.top, r = o > 0 ? B(e.bottom, o * 0.4) : e.bottom;
  n.style.background = `linear-gradient(to bottom, ${w(i)}, ${w(r)})`;
}
function sn(n, t, o, e) {
  const i = E(t), r = E(o), s = w(O(i.top, r.top, e)), h = w(O(i.bottom, r.bottom, e));
  n.style.background = `linear-gradient(to bottom, ${s}, ${h})`;
}
let an = Math.random;
function l() {
  return an();
}
const W = [6e-3, 0.022, 0.06], ln = { 0: 4, 1: 5, 2: 6 }, hn = { light: 0.55, medium: 1, heavy: 1.5 }, cn = { light: 0.75, medium: 1, heavy: 1.2 };
function A(n, t) {
  return n.condition === "storm" ? n.time === "night" ? `rgba(26,26,42,${t})` : `rgba(42,42,58,${t})` : n.condition === "hail" ? n.time === "night" ? `rgba(40,52,50,${t})` : `rgba(70,86,82,${t})` : n.condition === "rain" ? n.time === "night" ? `rgba(58,74,90,${t})` : `rgba(106,122,138,${t})` : n.time === "night" ? `rgba(58,74,106,${t})` : `rgba(208,216,224,${t})`;
}
function _(n, t) {
  const o = n.condition === "storm" ? 0.9 : n.condition === "hail" ? 0.85 : n.condition === "rain" ? 0.75 : n.condition === "wind" ? 0.55 : n.condition === "cloudy" ? 0.7 : 0.5;
  return Math.min(0.95, o * (1 - t * 0.12) * cn[n.intensity]);
}
function un(n) {
  return n !== "clear" && n !== "fog";
}
function N(n, t, o) {
  const e = n / 2, i = t / 2, r = e / i, s = Math.max(4, Math.min(9, Math.round(2 + r * 1.8))), h = o ? 2.4 : 1.8, u = h / Math.max(1, s - 1), c = [];
  for (let f = 0; f < s; f++) {
    const a = s === 1 ? 0.5 : f / (s - 1), g = (a - 0.5) * h + (l() * 2 - 1) * u * 0.15, S = 1 - Math.abs(a - 0.5) * 2, M = Math.min(1.1, 0.62 + S * (o ? 0.18 : 0.42) + (l() * 0.3 - 0.15)), k = 1 - M + l() * 0.08 + (l() * 0.2 - 0.1);
    c.push({ dx: g, dy: k, r: M });
  }
  if (!o && s >= 5) {
    const f = l() < 0.5 ? 1 : 2;
    for (let a = 0; a < f; a++) {
      const g = (0.3 + l() * 0.4 - 0.5) * h * 0.8, S = Math.min(1.15, 0.85 + l() * 0.2), C = 1 - S + 0.05 + l() * 0.1;
      c.push({ dx: g, dy: C, r: S, alpha: 0.45 });
    }
  }
  return c;
}
function K(n, t, o) {
  if (!un(n.condition)) return [];
  const e = [], i = hn[n.intensity];
  if (n.condition === "storm") {
    const s = [2, 2, 3];
    for (const h of [0, 1, 2]) {
      const u = Math.max(1, Math.round(s[h] * i)), c = 1 + h * 0.4;
      for (let f = 0; f < u; f++) {
        const a = t * (0.18 + l() * 0.14) * c, m = o * (0.3 + l() * 0.2) * c;
        e.push({
          x: f / u * t * 1.3 - t * 0.15,
          y: o * (h * 0.07 + l() * 0.05) - m * 0.15,
          width: a,
          height: m,
          alpha: _(n, h),
          speed: W[h] * t,
          layer: h,
          lobes: N(a, m, !1)
        });
      }
    }
    return e;
  }
  const r = n.condition === "wind" ? [2] : [0, 1, 2];
  for (const s of r) {
    const h = n.condition === "wind" ? 8 : ln[s], u = Math.max(2, Math.round(h * i));
    for (let c = 0; c < u; c++) {
      const f = n.condition === "wind", a = 1 + s * 0.35, m = f ? t * (0.15 + l() * 0.12) : t * (0.22 + l() * 0.18) * a, g = f ? o * 0.04 : o * (0.12 + l() * 0.08) * a;
      e.push({
        x: c / u * t * 1.4 - t * 0.2,
        y: o * (0.04 + s * 0.18 + l() * 0.08),
        width: m,
        height: g,
        alpha: _(n, s),
        speed: W[s] * (f ? 3 : 1) * t,
        layer: s,
        lobes: f ? [] : N(m, g, l() < 0.35)
      });
    }
  }
  return e;
}
function Y(n, t, o) {
  for (const e of n)
    e.x += e.speed * t, e.x > o + e.width / 2 && (e.x = -e.width / 2);
}
function dn(n, t) {
  const o = n.width / 2, e = n.height / 2, i = Math.max(2, e * 0.12), r = i * 4 + Math.max(e, o * 0.15), s = Math.ceil(n.width + r * 2), h = Math.ceil(n.height + r * 2), u = new OffscreenCanvas(s, h), c = u.getContext("2d"), f = s / 2, a = h / 2;
  if (n.spriteCx = f, n.spriteCy = a, n.lobes.length === 0) {
    c.filter = `blur(${i}px)`, c.translate(f, a), c.scale(o / e, 1);
    const y = c.createRadialGradient(0, 0, 0, 0, 0, e);
    return y.addColorStop(0, A(t, 1)), y.addColorStop(0.4, A(t, 0.6)), y.addColorStop(1, "rgba(0,0,0,0)"), c.fillStyle = y, c.beginPath(), c.arc(0, 0, e, 0, Math.PI * 2), c.fill(), u;
  }
  const m = new OffscreenCanvas(s, h), g = m.getContext("2d");
  g.fillStyle = A(t, 1);
  for (const y of n.lobes) {
    const j = f + y.dx * o, J = a + y.dy * e;
    g.beginPath(), g.arc(j, J, y.r * e, 0, Math.PI * 2), g.fill();
  }
  c.filter = `blur(${i}px)`, c.drawImage(m, 0, 0), c.filter = "none", c.globalCompositeOperation = "source-atop";
  const S = t.time === "day", C = t.condition === "rain" || t.condition === "storm" || t.condition === "hail", M = S ? "rgba(255,244,214,0.22)" : "rgba(190,205,235,0.10)", k = C ? "rgba(0,0,0,0.35)" : S ? "rgba(0,0,0,0.16)" : "rgba(0,0,0,0.28)", P = c.createLinearGradient(0, a - e * 1.1, 0, a + e * 1.1);
  return P.addColorStop(0, M), P.addColorStop(0.5, "rgba(255,255,255,0)"), P.addColorStop(1, k), c.fillStyle = P, c.fillRect(0, 0, s, h), c.globalCompositeOperation = "source-over", u;
}
function I(n, t, o, e) {
  if (t.length !== 0) {
    n.save();
    for (const i of t) {
      const r = `${o.condition}:${o.time}`;
      (!i.sprite || i.spriteKey !== r) && (i.sprite = dn(i, o), i.spriteKey = r), n.globalAlpha = e * i.alpha, n.drawImage(i.sprite, i.x - (i.spriteCx ?? 0), i.y - (i.spriteCy ?? 0));
    }
    n.restore();
  }
}
function fn(n, t, o, e, i) {
  return t + o * Math.sin(n * e + i);
}
const pn = {
  light: 0.45,
  medium: 0.22,
  heavy: 0
};
function bn(n) {
  return n.condition === "cloudy" ? pn[n.intensity] : n.time === "day" && (n.condition === "clear" || n.condition === "wind") || n.time === "night" && n.condition === "clear" ? 1 : 0;
}
function U() {
  return { lightningFlash: 0, lightningTimer: 2e3, boltPoints: null, time: 0, fogPlumes: null, preflicker: 0, boltBranches: null };
}
function G(n, t, o) {
  if (n.time += o, t.condition === "storm") {
    if (n.lightningTimer -= o * 1e3, n.lightningTimer <= 0 && n.preflicker <= 0 && n.lightningFlash <= 0 && (n.preflicker = 1), n.preflicker > 0 && (n.preflicker = Math.max(0, n.preflicker - o * 12), n.preflicker <= 0)) {
      n.lightningFlash = 1;
      const e = t.intensity === "heavy" ? 1500 : t.intensity === "medium" ? 2500 : 4e3;
      n.lightningTimer = e + l() * e;
      const i = mn();
      n.boltPoints = i, n.boltBranches = gn(i);
    }
    n.lightningFlash = Math.max(0, n.lightningFlash - o * 3.5), n.lightningFlash <= 0 && (n.boltPoints = null, n.boltBranches = null);
  } else
    n.lightningFlash = 0, n.lightningTimer = 2e3, n.boltPoints = null, n.preflicker = 0, n.boltBranches = null;
  if (t.condition === "fog") {
    n.fogPlumes || (n.fogPlumes = Array.from({ length: 4 }, (e, i) => ({
      baseX: l(),
      baseY: 0.45 + i * 0.14 + l() * 0.06,
      speed: 0.01 + l() * 0.02,
      bobAmp: 8 + l() * 10,
      bobFreq: 0.15 + l() * 0.15,
      phase: l() * Math.PI * 2
    })));
    for (const e of n.fogPlumes)
      e.baseX += e.speed * o, e.baseX > 1.3 && (e.baseX -= 1.6);
  } else
    n.fogPlumes = null;
}
function T(n, t, o, e, i, r) {
  n.save(), n.globalAlpha = e, t.condition === "fog" && Cn(n, t, o, i, r);
  const s = Math.max(o.lightningFlash, o.preflicker * 0.4);
  if (s > 0 && (n.globalAlpha = e * s * 0.45, n.fillStyle = "rgba(200,220,255,1)", n.fillRect(0, 0, i, r), o.boltPoints && o.lightningFlash > 0 && (H(n, o.boltPoints, e * o.lightningFlash, i, r), o.boltBranches)))
    for (const h of o.boltBranches)
      H(n, h, e * o.lightningFlash * 0.7, i, r);
  if (t.fidelity === "rich" && o.lightningFlash > 0 && t.condition === "storm") {
    n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = e * o.lightningFlash * 0.5;
    const h = n.createLinearGradient(0, 0, 0, r * 0.5);
    h.addColorStop(0, "rgba(150,180,255,0.6)"), h.addColorStop(1, "rgba(150,180,255,0)"), n.fillStyle = h, n.fillRect(0, 0, i, r * 0.5), n.restore();
  }
  n.restore();
}
function z(n, t, o, e, i, r) {
  const s = bn(t);
  s <= 0 || (n.save(), n.globalAlpha = e * s, t.time === "day" ? yn(n, t, o, i, r) : Sn(n, i, r), n.restore());
}
function mn() {
  const n = 0.2 + l() * 0.6, t = [[n, 0.08]];
  let o = n;
  for (let e = 1; e <= 8; e++)
    o += (l() - 0.5) * 0.13, o = Math.max(0.05, Math.min(0.95, o)), t.push([o, 0.08 + 0.52 * e / 8]);
  return t;
}
function gn(n) {
  const t = [], o = 1 + Math.floor(l() * 2);
  for (let e = 0; e < o; e++) {
    const i = 2 + Math.floor(l() * (n.length - 3)), [r, s] = n[i];
    let h = r, u = s;
    const c = [[h, u]], f = l() < 0.5 ? -1 : 1;
    for (let a = 0; a < 3; a++)
      h = Math.max(0.02, Math.min(0.98, h + f * (0.04 + l() * 0.05))), u = Math.min(0.95, u + 0.06 + l() * 0.05), c.push([h, u]);
    t.push(c);
  }
  return t;
}
function H(n, t, o, e, i) {
  n.save(), n.globalAlpha = o, n.lineCap = "round", n.lineJoin = "round";
  const r = () => {
    n.beginPath(), n.moveTo(t[0][0] * e, t[0][1] * i);
    for (let s = 1; s < t.length; s++)
      n.lineTo(t[s][0] * e, t[s][1] * i);
  };
  r(), n.strokeStyle = "rgba(140,180,255,0.5)", n.lineWidth = 10, n.shadowColor = "#90b8ff", n.shadowBlur = 30, n.stroke(), r(), n.strokeStyle = "rgba(200,220,255,0.85)", n.lineWidth = 3.5, n.shadowBlur = 12, n.stroke(), r(), n.strokeStyle = "#ffffff", n.lineWidth = 1.5, n.shadowBlur = 0, n.stroke(), n.restore();
}
function yn(n, t, o, e, i) {
  const r = e * 0.75, s = i * 0.18, h = Math.min(e, i) * 0.08, u = n.createRadialGradient(r, s, h * 0.4, r, s, h * 4);
  if (u.addColorStop(0, "rgba(255,240,180,0.45)"), u.addColorStop(0.5, "rgba(255,240,180,0.12)"), u.addColorStop(1, "rgba(255,240,180,0)"), n.fillStyle = u, n.fillRect(r - h * 4, s - h * 4, h * 8, h * 8), t.fidelity === "rich") {
    n.save(), n.translate(r, s), n.rotate(o.time * 0.05), n.globalAlpha = 0.12, n.strokeStyle = "rgba(255,245,200,1)", n.lineWidth = 2;
    for (let f = 0; f < 12; f++) {
      const a = f / 12 * Math.PI * 2;
      n.beginPath(), n.moveTo(Math.cos(a) * h * 1.3, Math.sin(a) * h * 1.3), n.lineTo(Math.cos(a) * h * 2.6, Math.sin(a) * h * 2.6), n.stroke();
    }
    n.restore();
  }
  const c = n.createRadialGradient(r, s, 0, r, s, h);
  c.addColorStop(0, "#fffde7"), c.addColorStop(1, "#ffe082"), n.fillStyle = c, n.beginPath(), n.arc(r, s, h, 0, Math.PI * 2), n.fill();
}
function Sn(n, t, o) {
  const e = t * 0.75, i = o * 0.18, r = Math.min(t, o) * 0.06, s = n.createRadialGradient(e - r * 0.2, i - r * 0.2, 0, e, i, r);
  s.addColorStop(0, "#fffde7"), s.addColorStop(0.6, "#fff8e1"), s.addColorStop(1, "#ffecb3"), n.fillStyle = s, n.beginPath(), n.arc(e, i, r, 0, Math.PI * 2), n.fill();
  const h = n.createRadialGradient(e, i, r, e, i, r * 2.6);
  h.addColorStop(0, "rgba(220,230,245,0.22)"), h.addColorStop(1, "rgba(220,230,245,0)"), n.fillStyle = h, n.beginPath(), n.arc(e, i, r * 2.6, 0, Math.PI * 2), n.fill(), n.fillStyle = "rgba(180,185,200,0.35)";
  const u = [[-0.3, -0.2, 0.18], [0.25, 0.1, 0.13], [0.05, 0.35, 0.1]];
  for (const [c, f, a] of u)
    n.beginPath(), n.arc(e + c * r, i + f * r, a * r, 0, Math.PI * 2), n.fill();
}
function vn(n, t) {
  const o = Math.ceil(n * 2), e = new OffscreenCanvas(o, o), i = e.getContext("2d"), r = t ? "90,100,112" : "205,210,216", s = i.createRadialGradient(n, n, 0, n, n, n);
  return s.addColorStop(0, `rgba(${r},0.5)`), s.addColorStop(0.5, `rgba(${r},0.22)`), s.addColorStop(1, `rgba(${r},0)`), i.fillStyle = s, i.beginPath(), i.arc(n, n, n, 0, Math.PI * 2), i.fill(), e;
}
function Cn(n, t, o, e, i) {
  if (!o.fogPlumes) return;
  const r = t.time === "night", s = e * 0.4;
  for (const h of o.fogPlumes) {
    (!h.sprite || h.spriteR !== s) && (h.sprite = vn(s, r), h.spriteR = s);
    const u = h.baseX * e - s, c = fn(o.time, h.baseY * i, h.bobAmp, h.bobFreq, h.phase) - s;
    n.drawImage(h.sprite, u, c), h.baseX * e - s > e - s * 2 && n.drawImage(h.sprite, u - e - s * 2, c);
  }
}
class Mn {
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
      const o = this.particles[this.cursor];
      if (this.cursor = (this.cursor + 1) % this.particles.length, !o.active)
        return o.active = !0, o;
    } while (this.cursor !== t);
    return null;
  }
  reset() {
    for (const t of this.particles) t.active = !1;
    this.cursor = 0;
  }
}
const Pn = { light: 0.3, medium: 0.65, heavy: 1 };
function X(n) {
  return Pn[n.intensity];
}
const wn = { subtle: 1, rich: 1.8 };
function kn(n) {
  return wn[n.fidelity];
}
function b(n, t, o) {
  return t + (o - t) * n;
}
const $ = 0.15;
function An(n) {
  return n !== "light";
}
function In(n, t, o) {
  return t * R(n / o, 0, 1);
}
function Tn(n, t) {
  return 1 - R(n / t, 0, 1);
}
function zn(n, t, o, e) {
  return t + o * Math.sin(n * e);
}
function En(n, t) {
  return -n * t;
}
function $n(n, t, o, e) {
  return t >= o || Math.abs(n) < e;
}
const Rn = 900;
class V {
  constructor() {
    p(this, "pool");
    p(this, "spawnAccum", 0);
    p(this, "time", 0);
    p(this, "config", null);
    p(this, "width", 0);
    p(this, "height", 0);
    this.pool = new Mn(Rn);
  }
  init(t, o, e) {
    if (this.config = t, this.width = o, this.height = e, this.pool.reset(), this.spawnAccum = 0, this.time = 0, t.condition === "clear" && t.time === "night") {
      const i = Math.floor(120 * X(t));
      for (let r = 0; r < i; r++) Yn(this.pool, o, e);
    }
  }
  update(t) {
    if (!this.config) return;
    this.time += t;
    const o = this.config, e = X(o) * kn(o), i = this.width, r = this.height, s = o.fidelity === "rich", h = zn(this.time, -20, 12, 0.4);
    for (const a of this.pool.particles)
      if (a.active) {
        if (a.x += a.vx * t, a.y += a.vy * t, a.phase += t, a.kind === "splash") {
          a.phase >= $ && (a.active = !1);
          continue;
        }
        if (a.kind === "droplet") {
          a.vy += 500 * t, a.alpha -= t * 4, (a.alpha <= 0 || a.y > r + 10) && (a.active = !1);
          continue;
        }
        if (a.kind === "leaf" && (a.phase += t * 6), o.condition === "snow" && (a.vx = Math.sin(a.phase * 0.8) * 18), o.condition === "rain" && (a.vx = h * b(a.depth, 0.6, 1)), o.condition === "clear" && o.time === "night" && (a.alpha = 0.5 + 0.5 * Math.sin(a.phase * 2.5 + a.size)), (o.condition === "rain" || o.condition === "storm") && a.kind === "primary" && a.y > r && An(o.intensity)) {
          const m = s ? 0.3 : 0.6;
          a.depth > m && (On(this.pool, a.x, r, s, o.intensity), s && Bn(this.pool, a.x, r, 2 + Math.floor(l() * 3))), a.active = !1;
          continue;
        }
        if (o.condition === "hail" && a.bounces > 0 && (a.vy += 980 * t), o.condition === "hail" && a.kind === "primary" && a.y > r) {
          s && !$n(a.vy, a.bounces, 2, 80) ? (a.y = r, a.vy = En(a.vy, 0.4), a.vx += (l() - 0.5) * 60, a.size *= 0.8, a.bounces += 1) : a.active = !1;
          continue;
        }
        (a.y > r + 20 || a.x < -20 || a.x > i + 20 || a.y < -20) && (a.active = !1);
      }
    const u = {
      rain: 120 * e,
      "storm-rain": 280 * e,
      snow: 30 * e,
      wind: 60 * e,
      hail: 90 * e
    }, c = o.condition === "storm" ? "storm-rain" : o.condition, f = u[c];
    if (f)
      for (this.spawnAccum += f * t; this.spawnAccum >= 1; )
        this.spawnAccum -= 1, o.condition === "rain" ? Wn(this.pool, i) : o.condition === "storm" ? _n(this.pool, i) : o.condition === "snow" ? Nn(this.pool, i) : o.condition === "wind" ? Gn(this.pool, i, r, s) : o.condition === "hail" && Hn(this.pool, i);
  }
  draw(t, o, e) {
    const i = e ?? this.config;
    if (i) {
      t.save();
      for (const r of this.pool.particles)
        r.active && Fn(t, r, i, o);
      t.restore();
    }
  }
}
function Fn(n, t, o, e) {
  if (t.kind === "droplet") {
    n.globalAlpha = e * t.alpha, n.fillStyle = "rgba(180,205,225,1)", n.beginPath(), n.arc(t.x, t.y, t.size, 0, Math.PI * 2), n.fill();
    return;
  }
  if (t.kind === "splash") {
    const i = In(t.phase, t.size, $), r = Tn(t.phase, $), s = o.intensity === "heavy";
    n.globalAlpha = e * r * (s ? 0.9 : 0.75), n.strokeStyle = "rgba(180,205,225,1)", n.lineWidth = s ? 2 : 1.5, n.beginPath(), n.ellipse(t.x, t.y, i, i * 0.35, 0, 0, Math.PI * 2), n.stroke();
    return;
  }
  if (t.kind === "leaf") {
    n.save(), n.globalAlpha = e * t.alpha, n.translate(t.x, t.y), n.rotate(t.phase), n.fillStyle = "rgba(150,170,90,1)", n.beginPath(), n.ellipse(0, 0, t.size, t.size * 0.5, 0, 0, Math.PI * 2), n.fill(), n.restore();
    return;
  }
  if (n.globalAlpha = e * t.alpha, o.condition === "rain" || o.condition === "storm")
    n.strokeStyle = o.condition === "storm" ? "rgba(180,200,220,0.8)" : "rgba(160,190,220,0.7)", n.lineWidth = o.condition === "storm" ? 1.5 : 1, n.beginPath(), n.moveTo(t.x, t.y), n.lineTo(t.x + t.vx * 0.04, t.y + t.length), n.stroke();
  else if (o.condition === "snow") {
    if (t.depth < 0.5) {
      const i = n.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.size);
      i.addColorStop(0, `rgba(255,255,255,${t.alpha})`), i.addColorStop(1, "rgba(255,255,255,0)"), n.fillStyle = i;
    } else
      n.fillStyle = `rgba(255,255,255,${t.alpha})`;
    n.beginPath(), n.arc(t.x, t.y, t.size, 0, Math.PI * 2), n.fill();
  } else if (o.condition === "clear" && o.time === "night") {
    if (n.fillStyle = `rgba(255,255,240,${t.alpha})`, n.beginPath(), n.arc(t.x, t.y, t.size, 0, Math.PI * 2), n.fill(), t.length > 0 && o.fidelity === "rich") {
      n.globalAlpha = e * t.alpha * 0.6, n.strokeStyle = "rgba(255,255,240,1)", n.lineWidth = 0.75;
      const i = t.size * 3;
      n.beginPath(), n.moveTo(t.x - i, t.y), n.lineTo(t.x + i, t.y), n.moveTo(t.x, t.y - i), n.lineTo(t.x, t.y + i), n.stroke();
    }
  } else o.condition === "wind" ? (n.strokeStyle = `rgba(180,210,240,${t.alpha})`, n.lineWidth = 1, n.beginPath(), n.moveTo(t.x, t.y), n.quadraticCurveTo(t.x + t.length * 0.5, t.y - t.length * 0.12, t.x + t.length, t.y), n.stroke()) : o.condition === "hail" && (n.fillStyle = `rgba(225,235,245,${t.alpha})`, n.beginPath(), n.arc(t.x, t.y, t.size, 0, Math.PI * 2), n.fill(), n.globalAlpha = e * t.alpha * 0.5, n.strokeStyle = "rgba(255,255,255,0.9)", n.lineWidth = 0.75, n.beginPath(), n.arc(t.x - t.size * 0.25, t.y - t.size * 0.25, t.size * 0.6, 0, Math.PI * 2), n.stroke());
}
const Ln = { light: 1, medium: 1.4, heavy: 2 };
function On(n, t, o, e, i) {
  const r = n.spawn();
  if (!r) return;
  const s = Ln[i];
  r.x = t, r.y = o - 1, r.vx = 0, r.vy = 0, r.alpha = 1, r.size = (e ? 8 + l() * 5 : 5 + l() * 3) * s, r.length = 0, r.phase = 0, r.depth = 1, r.bounces = 0, r.kind = "splash";
}
function Bn(n, t, o, e) {
  for (let i = 0; i < e; i++) {
    const r = n.spawn();
    if (!r) break;
    r.x = t + (l() - 0.5) * 6, r.y = o - 1, r.vx = (l() - 0.5) * 180, r.vy = -(50 + l() * 100), r.alpha = 0.6 + l() * 0.4, r.size = 1 + l() * 1.5, r.length = 0, r.phase = 0, r.depth = 1, r.bounces = 0, r.kind = "droplet";
  }
}
function Wn(n, t) {
  const o = n.spawn();
  if (!o) return;
  const e = l();
  o.x = l() * (t + 100) - 50, o.y = -10, o.vx = -20 * b(e, 0.6, 1), o.vy = (650 + l() * 200) * b(e, 0.55, 1), o.alpha = (0.4 + l() * 0.4) * b(e, 0.5, 1), o.size = 1, o.length = (14 + l() * 10) * b(e, 0.5, 1), o.phase = 0, o.depth = e, o.bounces = 0, o.kind = "primary";
}
function _n(n, t) {
  const o = n.spawn();
  o && (o.x = l() * (t + 100) - 50, o.y = -10, o.vx = -35, o.vy = 900 + l() * 300, o.alpha = 0.5 + l() * 0.4, o.size = 1, o.length = 20 + l() * 14, o.phase = 0, o.depth = l(), o.bounces = 0, o.kind = "primary");
}
function Nn(n, t) {
  const o = n.spawn();
  if (!o) return;
  const e = l();
  o.x = l() * t, o.y = -10, o.vx = 0, o.vy = (40 + l() * 50) * b(e, 0.5, 1), o.alpha = (0.6 + l() * 0.4) * b(e, 0.5, 1), o.size = (1.5 + l() * 3) * b(e, 0.5, 1), o.length = 0, o.phase = l() * Math.PI * 2, o.depth = e, o.bounces = 0, o.kind = "primary";
}
function Yn(n, t, o) {
  const e = n.spawn();
  if (!e) return;
  const i = l() < 0.12;
  e.x = l() * t, e.y = l() * o * 0.7, e.vx = 0, e.vy = 0, e.alpha = 0.3 + l() * 0.7, e.size = i ? 1.6 + l() * 1.2 : 0.5 + l() * 1.5, e.length = i ? 1 : 0, e.phase = l() * Math.PI * 2, e.depth = 0.5, e.bounces = 0, e.kind = "primary";
}
function Gn(n, t, o, e) {
  const i = n.spawn();
  if (!i) return;
  const r = l(), s = e && l() < 0.12;
  i.x = -20, i.y = l() * o, i.vx = (300 + l() * 200) * b(r, 0.55, 1), i.vy = s ? (l() - 0.5) * 40 : 0, i.alpha = (0.2 + l() * 0.5) * b(r, 0.5, 1), i.size = s ? 3 + l() * 3 : 1, i.length = (30 + l() * 60) * b(r, 0.5, 1), i.phase = l() * Math.PI * 2, i.depth = r, i.bounces = 0, i.kind = s ? "leaf" : "primary";
}
function Hn(n, t) {
  const o = n.spawn();
  if (!o) return;
  const e = l();
  o.x = l() * (t + 60) - 30, o.y = -10, o.vx = -8 * b(e, 0.5, 1), o.vy = (700 + l() * 250) * b(e, 0.55, 1), o.alpha = (0.7 + l() * 0.3) * b(e, 0.5, 1), o.size = (2 + l() * 2.5) * b(e, 0.5, 1), o.length = 0, o.phase = 0, o.depth = e, o.bounces = 0, o.kind = "primary";
}
function Xn(n, t) {
  return { from: n, to: t, elapsed: 0 };
}
function qn(n, t) {
  return {
    ...n,
    elapsed: Math.min(n.elapsed + t * 1e3, n.to.transitionMs)
  };
}
function Dn(n) {
  const t = R(n.elapsed / n.to.transitionMs, 0, 1);
  return on(t);
}
function Kn(n) {
  return n.elapsed >= n.to.transitionMs;
}
function Un(n, t, o) {
  const e = new V();
  return e.init(n, t, o), {
    current: n,
    currentClouds: K(n, t, o),
    currentPS: e,
    currentAtmo: U(),
    transition: null,
    transClouds: null,
    transPS: null,
    transAtmo: null
  };
}
function Vn(n, t, o, e) {
  const i = n.current, r = new V();
  return r.init(t, o, e), {
    ...n,
    transition: Xn(i, t),
    transClouds: K(t, o, e),
    transPS: r,
    transAtmo: U()
  };
}
function q(n, t, o, e) {
  let i = { ...n };
  if (G(i.currentAtmo, i.current, t), i.currentPS.update(t), Y(i.currentClouds, t, o), i.transition) {
    const r = qn(i.transition, t);
    i.transition = r, i.transAtmo && G(i.transAtmo, r.to, t), i.transPS && i.transPS.update(t), i.transClouds && Y(i.transClouds, t, o), Kn(r) && (i = {
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
function D(n, t, o, e, i) {
  if (o.clearRect(0, 0, e, i), n.transition) {
    const r = Dn(n.transition), s = n.transition.from, h = n.transition.to, u = 1 - r;
    sn(t, s, h, r), z(o, s, n.currentAtmo, u, e, i), n.transAtmo && z(o, h, n.transAtmo, r, e, i), I(o, n.currentClouds, s, u), T(o, s, n.currentAtmo, u, e, i), n.currentPS.draw(o, u, s), n.transClouds && I(o, n.transClouds, h, r), n.transAtmo && T(o, h, n.transAtmo, r, e, i), n.transPS && n.transPS.draw(o, r, h);
  } else
    rn(t, n.current, n.currentAtmo.lightningFlash), z(o, n.current, n.currentAtmo, 1, e, i), I(o, n.currentClouds, n.current, 1), T(o, n.current, n.currentAtmo, 1, e, i), n.currentPS.draw(o, 1, n.current);
}
class jn {
  constructor(t, o = {}) {
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
    this.manual = o.manual ?? !1, getComputedStyle(t).position === "static" && (t.style.position = "relative"), t.style.overflow = "hidden", this.skyEl = document.createElement("div"), this.skyEl.style.cssText = "position:absolute;inset:0;", this.canvas = document.createElement("canvas"), this.canvas.style.cssText = "position:absolute;inset:0;", t.appendChild(this.skyEl), t.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d"), this.resizeCanvas(), this.resizeObserver = new ResizeObserver(() => this.resizeCanvas()), this.resizeObserver.observe(t);
  }
  resizeCanvas() {
    const { offsetWidth: t, offsetHeight: o } = this.container;
    this.canvas.width = t, this.canvas.height = o;
  }
  set(t) {
    if (this.destroyed) return;
    const o = tn(t), { offsetWidth: e, offsetHeight: i } = this.container;
    this.engineState ? this.engineState = Vn(this.engineState, o, e, i) : (this.engineState = Un(o, e, i), this.manual || this.startLoop());
  }
  /** Deterministically tick + render N frames at a fixed delta (test hook). */
  advance(t, o = 1 / 60) {
    if (this.destroyed || !this.engineState || !this.ctx) return;
    const e = this.canvas.width, i = this.canvas.height;
    for (let r = 0; r < t; r++)
      this.engineState = q(this.engineState, o, e);
    D(this.engineState, this.skyEl, this.ctx, e, i);
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.stopLoop(), this.resizeObserver.disconnect(), this.skyEl.remove(), this.canvas.remove(), this.engineState = null);
  }
  startLoop() {
    const t = (o) => {
      if (this.destroyed) return;
      const e = this.lastTimestamp != null ? Math.min((o - this.lastTimestamp) / 1e3, 0.1) : 0;
      if (this.lastTimestamp = o, this.engineState && this.ctx) {
        const i = this.canvas.width, r = this.canvas.height;
        this.engineState = q(this.engineState, e, i), D(this.engineState, this.skyEl, this.ctx, i, r);
      }
      this.rafId = requestAnimationFrame(t);
    };
    this.rafId = requestAnimationFrame(t);
  }
  stopLoop() {
    this.rafId != null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.lastTimestamp = null;
  }
}
function xn({
  condition: n,
  intensity: t,
  time: o,
  transitionMs: e,
  className: i,
  style: r
}) {
  const s = F(null), h = F(null);
  return L(() => {
    if (s.current)
      return h.current = new jn(s.current), () => {
        var u;
        (u = h.current) == null || u.destroy(), h.current = null;
      };
  }, []), L(() => {
    var u;
    (u = h.current) == null || u.set({ condition: n, intensity: t, time: o, transitionMs: e });
  }, [n, t, o, e]), /* @__PURE__ */ x("div", { ref: s, className: i, style: r });
}
export {
  xn as WeatherBackground
};
