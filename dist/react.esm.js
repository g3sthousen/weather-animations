var T = Object.defineProperty;
var I = (t, n, o) => n in t ? T(t, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[n] = o;
var h = (t, n, o) => I(t, typeof n != "symbol" ? n + "" : n, o);
import { jsx as $ } from "react/jsx-runtime";
import { useRef as b, useEffect as y } from "react";
const E = ["clear", "cloudy", "rain", "snow", "storm", "fog", "wind"];
function R(t) {
  return {
    condition: E.includes(t.condition) ? t.condition : "clear",
    intensity: t.intensity ?? "medium",
    time: t.time ?? "day",
    transitionMs: t.transitionMs ?? 1200
  };
}
function f(t, n, o) {
  const i = Math.max(0, Math.min(1, o));
  return t + (n - t) * i;
}
function z(t, n, o) {
  return Math.max(n, Math.min(o, t));
}
function k(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function l(t) {
  const n = t.replace("#", "");
  return {
    r: parseInt(n.substring(0, 2), 16),
    g: parseInt(n.substring(2, 4), 16),
    b: parseInt(n.substring(4, 6), 16)
  };
}
function S(t, n, o) {
  return {
    r: Math.round(f(t.r, n.r, o)),
    g: Math.round(f(t.g, n.g, o)),
    b: Math.round(f(t.b, n.b, o))
  };
}
function u(t) {
  return `rgb(${t.r},${t.g},${t.b})`;
}
const F = {
  "clear:day": { top: l("#1a6b9e"), bottom: l("#87ceeb") },
  "clear:night": { top: l("#0a0a2e"), bottom: l("#1a1a4e") },
  "cloudy:day": { top: l("#6b7a8d"), bottom: l("#b0bec5") },
  "cloudy:night": { top: l("#1c2331"), bottom: l("#2d3a4a") },
  "rain:day": { top: l("#3d5166"), bottom: l("#607d8b") },
  "rain:night": { top: l("#1a202c"), bottom: l("#2d3748") },
  "snow:day": { top: l("#b0bec5"), bottom: l("#e8eef4") },
  "snow:night": { top: l("#1a1a3a"), bottom: l("#2d2d50") },
  "storm:day": { top: l("#1a1a2e"), bottom: l("#16213e") },
  "storm:night": { top: l("#0a0a0f"), bottom: l("#11111b") },
  "fog:day": { top: l("#c8cdd2"), bottom: l("#e8eaed") },
  "fog:night": { top: l("#374151"), bottom: l("#4b5563") },
  "wind:day": { top: l("#2563a8"), bottom: l("#93c5fd") },
  "wind:night": { top: l("#1e3a5f"), bottom: l("#1e3a8a") }
};
function g(t) {
  return F[`${t.condition}:${t.time}`];
}
function L(t, n) {
  const o = g(n);
  t.style.background = `linear-gradient(to bottom, ${u(o.top)}, ${u(o.bottom)})`;
}
function O(t, n, o, i) {
  const r = g(n), e = g(o), a = u(S(r.top, e.top, i)), s = u(S(r.bottom, e.bottom, i));
  t.style.background = `linear-gradient(to bottom, ${a}, ${s})`;
}
const W = [8e-3, 0.025, 0.055], G = { 0: 4, 1: 5, 2: 6 };
function _(t, n) {
  return t.condition === "storm" ? t.time === "night" ? `rgba(26,26,42,${n})` : `rgba(42,42,58,${n})` : t.condition === "rain" ? t.time === "night" ? `rgba(58,74,90,${n})` : `rgba(106,122,138,${n})` : t.time === "night" ? `rgba(58,74,106,${n})` : `rgba(208,216,224,${n})`;
}
function N(t, n) {
  return (t.condition === "storm" ? 0.9 : t.condition === "rain" ? 0.75 : t.condition === "wind" ? 0.55 : t.condition === "cloudy" ? 0.7 : 0.5) * (1 - n * 0.12);
}
function Y(t) {
  return t !== "clear" && t !== "fog";
}
function C(t, n, o) {
  if (!Y(t.condition)) return [];
  const i = [], r = t.condition === "wind" ? [2] : [0, 1, 2];
  for (const e of r) {
    const a = t.condition === "wind" ? 8 : G[e];
    for (let s = 0; s < a; s++) {
      const d = t.condition === "wind";
      i.push({
        x: s / a * n * 1.4 - n * 0.2,
        y: o * (0.05 + e * 0.12 + Math.random() * 0.08),
        width: d ? n * (0.15 + Math.random() * 0.12) : n * (0.22 + Math.random() * 0.18),
        height: d ? o * 0.04 : o * (0.12 + Math.random() * 0.08),
        alpha: N(t, e),
        speed: W[e] * (d ? 3 : 1) * n,
        layer: e
      });
    }
  }
  return i;
}
function v(t, n, o) {
  for (const i of t)
    i.x += i.speed * n, i.x > o + i.width / 2 && (i.x = -i.width / 2);
}
function m(t, n, o, i) {
  if (n.length !== 0) {
    t.save(), t.globalAlpha = i;
    for (const r of n) {
      t.save(), t.filter = `blur(${r.height * 0.4}px)`;
      const e = t.createRadialGradient(r.x, r.y, 0, r.x, r.y, Math.max(r.width, r.height) * 0.6);
      e.addColorStop(0, _(o, r.alpha)), e.addColorStop(1, "rgba(0,0,0,0)"), t.fillStyle = e, t.beginPath(), t.ellipse(r.x, r.y, r.width / 2, r.height / 2, 0, 0, Math.PI * 2), t.fill(), t.filter = "none", t.restore();
    }
    t.restore();
  }
}
function P() {
  return { lightningFlash: 0, lightningTimer: 2e3 };
}
function w(t, n, o) {
  if (n.condition === "storm") {
    if (t.lightningTimer -= o * 1e3, t.lightningTimer <= 0) {
      t.lightningFlash = 1;
      const i = n.intensity === "heavy" ? 1500 : n.intensity === "medium" ? 2500 : 4e3;
      t.lightningTimer = i + Math.random() * i;
    }
    t.lightningFlash = Math.max(0, t.lightningFlash - o * 4);
  } else
    t.lightningFlash = 0, t.lightningTimer = 2e3;
}
function p(t, n, o, i, r, e) {
  t.save(), t.globalAlpha = i, n.time === "day" && (n.condition === "clear" || n.condition === "wind") && q(t, r, e), n.time === "night" && n.condition === "clear" && D(t, r, e), n.condition === "fog" && H(t, n, r, e), o.lightningFlash > 0 && (t.globalAlpha = i * o.lightningFlash * 0.7, t.fillStyle = "rgba(200,220,255,1)", t.fillRect(0, 0, r, e)), t.restore();
}
function q(t, n, o) {
  const i = n * 0.75, r = o * 0.18, e = Math.min(n, o) * 0.08, a = t.createRadialGradient(i, r, e * 0.5, i, r, e * 3);
  a.addColorStop(0, "rgba(255,240,180,0.4)"), a.addColorStop(1, "rgba(255,240,180,0)"), t.fillStyle = a, t.fillRect(i - e * 3, r - e * 3, e * 6, e * 6);
  const s = t.createRadialGradient(i, r, 0, i, r, e);
  s.addColorStop(0, "#fffde7"), s.addColorStop(1, "#ffe082"), t.fillStyle = s, t.beginPath(), t.arc(i, r, e, 0, Math.PI * 2), t.fill();
}
function D(t, n, o) {
  const i = n * 0.75, r = o * 0.18, e = Math.min(n, o) * 0.06, a = t.createRadialGradient(i - e * 0.2, r - e * 0.2, 0, i, r, e);
  a.addColorStop(0, "#fffde7"), a.addColorStop(0.6, "#fff8e1"), a.addColorStop(1, "#ffecb3"), t.fillStyle = a, t.beginPath(), t.arc(i, r, e, 0, Math.PI * 2), t.fill();
  const s = t.createRadialGradient(i, r, e, i, r, e * 2.5);
  s.addColorStop(0, "rgba(255,248,220,0.2)"), s.addColorStop(1, "rgba(255,248,220,0)"), t.fillStyle = s, t.beginPath(), t.arc(i, r, e * 2.5, 0, Math.PI * 2), t.fill();
}
function H(t, n, o, i) {
  const r = n.time === "night" ? "rgba(80,90,100," : "rgba(200,205,210,", e = 5;
  for (let a = 0; a < e; a++) {
    const s = i / e * a + i * 0.1, d = t.createLinearGradient(0, s, 0, s + i * 0.2);
    d.addColorStop(0, `${r}0)`), d.addColorStop(0.5, `${r}0.18)`), d.addColorStop(1, `${r}0)`), t.fillStyle = d, t.fillRect(0, s, o, i * 0.2);
  }
}
class K {
  constructor(n) {
    h(this, "particles");
    h(this, "cursor", 0);
    this.particles = Array.from({ length: n }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      alpha: 0,
      size: 1,
      length: 1,
      phase: 0,
      active: !1
    }));
  }
  spawn() {
    const n = this.cursor;
    do {
      const o = this.particles[this.cursor];
      if (this.cursor = (this.cursor + 1) % this.particles.length, !o.active)
        return o.active = !0, o;
    } while (this.cursor !== n);
    return null;
  }
  reset() {
    for (const n of this.particles) n.active = !1;
    this.cursor = 0;
  }
}
const j = { light: 0.3, medium: 0.65, heavy: 1 };
function M(t) {
  return j[t.intensity];
}
const B = 600;
class A {
  constructor() {
    h(this, "pool");
    h(this, "spawnAccum", 0);
    h(this, "time", 0);
    h(this, "config", null);
    h(this, "width", 0);
    h(this, "height", 0);
    this.pool = new K(B);
  }
  init(n, o, i) {
    if (this.config = n, this.width = o, this.height = i, this.pool.reset(), this.spawnAccum = 0, this.time = 0, n.condition === "clear" && n.time === "night") {
      const r = Math.floor(120 * M(n));
      for (let e = 0; e < r; e++) Q(this.pool, o, i);
    }
  }
  update(n) {
    if (!this.config) return;
    this.time += n;
    const o = this.config, i = M(o), r = this.width, e = this.height;
    for (const c of this.pool.particles)
      c.active && (c.x += c.vx * n, c.y += c.vy * n, c.phase += n, o.condition === "snow" && (c.vx = Math.sin(c.phase * 0.8) * 18), o.condition === "clear" && o.time === "night" && (c.alpha = 0.5 + 0.5 * Math.sin(c.phase * 2.5 + c.size)), (c.y > e + 20 || c.x < -20 || c.x > r + 20 || c.y < -20) && (c.active = !1));
    const a = {
      rain: 120 * i,
      "storm-rain": 280 * i,
      snow: 30 * i,
      wind: 60 * i
    }, s = o.condition === "storm" ? "storm-rain" : o.condition, d = a[s];
    if (d)
      for (this.spawnAccum += d * n; this.spawnAccum >= 1; )
        this.spawnAccum -= 1, o.condition === "rain" ? V(this.pool, r) : o.condition === "storm" ? Z(this.pool, r) : o.condition === "snow" ? J(this.pool, r) : o.condition === "wind" && X(this.pool, r, e);
  }
  draw(n, o, i) {
    const r = i ?? this.config;
    if (r) {
      n.save();
      for (const e of this.pool.particles)
        e.active && U(n, e, r, o);
      n.restore();
    }
  }
}
function U(t, n, o, i) {
  t.globalAlpha = i * n.alpha, o.condition === "rain" || o.condition === "storm" ? (t.strokeStyle = o.condition === "storm" ? "rgba(180,200,220,0.8)" : "rgba(160,190,220,0.7)", t.lineWidth = o.condition === "storm" ? 1.5 : 1, t.beginPath(), t.moveTo(n.x, n.y), t.lineTo(n.x + n.vx * 0.04, n.y + n.length), t.stroke()) : o.condition === "snow" ? (t.fillStyle = `rgba(255,255,255,${n.alpha})`, t.beginPath(), t.arc(n.x, n.y, n.size, 0, Math.PI * 2), t.fill()) : o.condition === "clear" && o.time === "night" ? (t.fillStyle = `rgba(255,255,240,${n.alpha})`, t.beginPath(), t.arc(n.x, n.y, n.size, 0, Math.PI * 2), t.fill()) : o.condition === "wind" && (t.strokeStyle = `rgba(180,210,240,${n.alpha})`, t.lineWidth = 1, t.beginPath(), t.moveTo(n.x, n.y), t.lineTo(n.x + n.length, n.y), t.stroke());
}
function V(t, n) {
  const o = t.spawn();
  o && (o.x = Math.random() * (n + 100) - 50, o.y = -10, o.vx = -20, o.vy = 650 + Math.random() * 200, o.alpha = 0.4 + Math.random() * 0.4, o.size = 1, o.length = 14 + Math.random() * 10, o.phase = 0);
}
function Z(t, n) {
  const o = t.spawn();
  o && (o.x = Math.random() * (n + 100) - 50, o.y = -10, o.vx = -35, o.vy = 900 + Math.random() * 300, o.alpha = 0.5 + Math.random() * 0.4, o.size = 1, o.length = 20 + Math.random() * 14, o.phase = 0);
}
function J(t, n) {
  const o = t.spawn();
  o && (o.x = Math.random() * n, o.y = -10, o.vx = 0, o.vy = 40 + Math.random() * 50, o.alpha = 0.6 + Math.random() * 0.4, o.size = 1.5 + Math.random() * 3, o.length = 0, o.phase = Math.random() * Math.PI * 2);
}
function Q(t, n, o) {
  const i = t.spawn();
  i && (i.x = Math.random() * n, i.y = Math.random() * o * 0.7, i.vx = 0, i.vy = 0, i.alpha = 0.3 + Math.random() * 0.7, i.size = 0.5 + Math.random() * 1.5, i.length = 0, i.phase = Math.random() * Math.PI * 2);
}
function X(t, n, o) {
  const i = t.spawn();
  i && (i.x = -20, i.y = Math.random() * o, i.vx = 300 + Math.random() * 200, i.vy = 0, i.alpha = 0.2 + Math.random() * 0.5, i.size = 1, i.length = 30 + Math.random() * 60, i.phase = 0);
}
function x(t, n) {
  return { from: t, to: n, elapsed: 0 };
}
function tt(t, n) {
  return {
    ...t,
    elapsed: Math.min(t.elapsed + n * 1e3, t.to.transitionMs)
  };
}
function nt(t) {
  const n = z(t.elapsed / t.to.transitionMs, 0, 1);
  return k(n);
}
function ot(t) {
  return t.elapsed >= t.to.transitionMs;
}
function it(t, n, o) {
  const i = new A();
  return i.init(t, n, o), {
    current: t,
    currentClouds: C(t, n, o),
    currentPS: i,
    currentAtmo: P(),
    transition: null,
    transClouds: null,
    transPS: null,
    transAtmo: null
  };
}
function rt(t, n, o, i) {
  const r = t.current, e = new A();
  return e.init(n, o, i), {
    ...t,
    transition: x(r, n),
    transClouds: C(n, o, i),
    transPS: e,
    transAtmo: P()
  };
}
function et(t, n, o, i) {
  let r = { ...t };
  if (w(r.currentAtmo, r.current, n), r.currentPS.update(n), v(r.currentClouds, n, o), r.transition) {
    const e = tt(r.transition, n);
    r.transition = e, r.transAtmo && w(r.transAtmo, e.to, n), r.transPS && r.transPS.update(n), r.transClouds && v(r.transClouds, n, o), ot(e) && (r = {
      current: e.to,
      currentClouds: r.transClouds,
      currentPS: r.transPS,
      currentAtmo: r.transAtmo,
      transition: null,
      transClouds: null,
      transPS: null,
      transAtmo: null
    });
  }
  return r;
}
function st(t, n, o, i, r) {
  if (o.clearRect(0, 0, i, r), t.transition) {
    const e = nt(t.transition), a = t.transition.from, s = t.transition.to;
    O(n, a, s, e);
    const d = 1 - e;
    m(o, t.currentClouds, a, d), p(o, a, t.currentAtmo, d, i, r), t.currentPS.draw(o, d, a), t.transClouds && m(o, t.transClouds, s, e), t.transAtmo && p(o, s, t.transAtmo, e, i, r), t.transPS && t.transPS.draw(o, e, s);
  } else
    L(n, t.current), m(o, t.currentClouds, t.current, 1), p(o, t.current, t.currentAtmo, 1, i, r), t.currentPS.draw(o, 1, t.current);
}
class at {
  constructor(n) {
    h(this, "destroyed", !1);
    h(this, "skyEl");
    h(this, "canvas");
    h(this, "ctx");
    h(this, "rafId", null);
    h(this, "lastTimestamp", null);
    h(this, "engineState", null);
    h(this, "resizeObserver");
    if (this.container = n, !n) throw new Error("WeatherScene: container element is required");
    n.style.position = "relative", n.style.overflow = "hidden", this.skyEl = document.createElement("div"), this.skyEl.style.cssText = "position:absolute;inset:0;", this.canvas = document.createElement("canvas"), this.canvas.style.cssText = "position:absolute;inset:0;", n.appendChild(this.skyEl), n.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d"), this.resizeCanvas(), this.resizeObserver = new ResizeObserver(() => this.resizeCanvas()), this.resizeObserver.observe(n);
  }
  resizeCanvas() {
    const { offsetWidth: n, offsetHeight: o } = this.container;
    this.canvas.width = n, this.canvas.height = o;
  }
  set(n) {
    if (this.destroyed) return;
    const o = R(n), { offsetWidth: i, offsetHeight: r } = this.container;
    this.engineState ? this.engineState = rt(this.engineState, o, i, r) : (this.engineState = it(o, i, r), this.startLoop());
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.stopLoop(), this.resizeObserver.disconnect(), this.skyEl.remove(), this.canvas.remove(), this.engineState = null);
  }
  startLoop() {
    const n = (o) => {
      if (this.destroyed) return;
      const i = this.lastTimestamp != null ? Math.min((o - this.lastTimestamp) / 1e3, 0.1) : 0;
      if (this.lastTimestamp = o, this.engineState && this.ctx) {
        const r = this.canvas.width, e = this.canvas.height;
        this.engineState = et(this.engineState, i, r), st(this.engineState, this.skyEl, this.ctx, r, e);
      }
      this.rafId = requestAnimationFrame(n);
    };
    this.rafId = requestAnimationFrame(n);
  }
  stopLoop() {
    this.rafId != null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.lastTimestamp = null;
  }
}
function ct({
  condition: t,
  intensity: n,
  time: o,
  transitionMs: i,
  className: r,
  style: e
}) {
  const a = b(null), s = b(null);
  return y(() => {
    if (a.current)
      return s.current = new at(a.current), () => {
        var d;
        (d = s.current) == null || d.destroy(), s.current = null;
      };
  }, []), y(() => {
    var d;
    (d = s.current) == null || d.set({ condition: t, intensity: n, time: o, transitionMs: i });
  }, [t, n, o, i]), /* @__PURE__ */ $("div", { ref: a, className: r, style: e });
}
export {
  ct as WeatherBackground
};
