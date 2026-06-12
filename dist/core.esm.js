var P = Object.defineProperty;
var A = (t, n, o) => n in t ? P(t, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[n] = o;
var d = (t, n, o) => A(t, typeof n != "symbol" ? n + "" : n, o);
const T = ["clear", "cloudy", "rain", "snow", "storm", "fog", "wind"];
function I(t) {
  return {
    condition: T.includes(t.condition) ? t.condition : "clear",
    intensity: t.intensity ?? "medium",
    time: t.time ?? "day",
    transitionMs: t.transitionMs ?? 1200
  };
}
function m(t, n, o) {
  const i = Math.max(0, Math.min(1, o));
  return t + (n - t) * i;
}
function $(t, n, o) {
  return Math.max(n, Math.min(o, t));
}
function E(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function s(t) {
  const n = t.replace("#", "");
  return {
    r: parseInt(n.substring(0, 2), 16),
    g: parseInt(n.substring(2, 4), 16),
    b: parseInt(n.substring(4, 6), 16)
  };
}
function b(t, n, o) {
  return {
    r: Math.round(m(t.r, n.r, o)),
    g: Math.round(m(t.g, n.g, o)),
    b: Math.round(m(t.b, n.b, o))
  };
}
function u(t) {
  return `rgb(${t.r},${t.g},${t.b})`;
}
const z = {
  "clear:day": { top: s("#1a6b9e"), bottom: s("#87ceeb") },
  "clear:night": { top: s("#0a0a2e"), bottom: s("#1a1a4e") },
  "cloudy:day": { top: s("#6b7a8d"), bottom: s("#b0bec5") },
  "cloudy:night": { top: s("#1c2331"), bottom: s("#2d3a4a") },
  "rain:day": { top: s("#3d5166"), bottom: s("#607d8b") },
  "rain:night": { top: s("#1a202c"), bottom: s("#2d3748") },
  "snow:day": { top: s("#b0bec5"), bottom: s("#e8eef4") },
  "snow:night": { top: s("#1a1a3a"), bottom: s("#2d2d50") },
  "storm:day": { top: s("#1a1a2e"), bottom: s("#16213e") },
  "storm:night": { top: s("#0a0a0f"), bottom: s("#11111b") },
  "fog:day": { top: s("#c8cdd2"), bottom: s("#e8eaed") },
  "fog:night": { top: s("#374151"), bottom: s("#4b5563") },
  "wind:day": { top: s("#2563a8"), bottom: s("#93c5fd") },
  "wind:night": { top: s("#1e3a5f"), bottom: s("#1e3a8a") }
};
function g(t) {
  return z[`${t.condition}:${t.time}`];
}
function k(t, n) {
  const o = g(n);
  t.style.background = `linear-gradient(to bottom, ${u(o.top)}, ${u(o.bottom)})`;
}
function R(t, n, o, i) {
  const r = g(n), e = g(o), a = u(b(r.top, e.top, i)), l = u(b(r.bottom, e.bottom, i));
  t.style.background = `linear-gradient(to bottom, ${a}, ${l})`;
}
const F = [8e-3, 0.025, 0.055], L = { 0: 4, 1: 5, 2: 6 };
function O(t, n) {
  return t.condition === "storm" ? t.time === "night" ? `rgba(26,26,42,${n})` : `rgba(42,42,58,${n})` : t.condition === "rain" ? t.time === "night" ? `rgba(58,74,90,${n})` : `rgba(106,122,138,${n})` : t.time === "night" ? `rgba(58,74,106,${n})` : `rgba(208,216,224,${n})`;
}
function G(t, n) {
  return (t.condition === "storm" ? 0.9 : t.condition === "rain" ? 0.75 : t.condition === "wind" ? 0.55 : t.condition === "cloudy" ? 0.7 : 0.5) * (1 - n * 0.12);
}
function W(t) {
  return t !== "clear" && t !== "fog";
}
function w(t, n, o) {
  if (!W(t.condition)) return [];
  const i = [], r = t.condition === "wind" ? [2] : [0, 1, 2];
  for (const e of r) {
    const a = t.condition === "wind" ? 8 : L[e];
    for (let l = 0; l < a; l++) {
      const c = t.condition === "wind";
      i.push({
        x: l / a * n * 1.4 - n * 0.2,
        y: o * (0.05 + e * 0.12 + Math.random() * 0.08),
        width: c ? n * (0.15 + Math.random() * 0.12) : n * (0.22 + Math.random() * 0.18),
        height: c ? o * 0.04 : o * (0.12 + Math.random() * 0.08),
        alpha: G(t, e),
        speed: F[e] * (c ? 3 : 1) * n,
        layer: e
      });
    }
  }
  return i;
}
function y(t, n, o) {
  for (const i of t)
    i.x += i.speed * n, i.x > o + i.width / 2 && (i.x = -i.width / 2);
}
function f(t, n, o, i) {
  if (n.length !== 0) {
    t.save(), t.globalAlpha = i;
    for (const r of n) {
      t.save(), t.filter = `blur(${r.height * 0.4}px)`;
      const e = t.createRadialGradient(r.x, r.y, 0, r.x, r.y, Math.max(r.width, r.height) * 0.6);
      e.addColorStop(0, O(o, r.alpha)), e.addColorStop(1, "rgba(0,0,0,0)"), t.fillStyle = e, t.beginPath(), t.ellipse(r.x, r.y, r.width / 2, r.height / 2, 0, 0, Math.PI * 2), t.fill(), t.filter = "none", t.restore();
    }
    t.restore();
  }
}
function M() {
  return { lightningFlash: 0, lightningTimer: 2e3 };
}
function S(t, n, o) {
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
  t.save(), t.globalAlpha = i, n.time === "day" && (n.condition === "clear" || n.condition === "wind") && _(t, r, e), n.time === "night" && n.condition === "clear" && N(t, r, e), n.condition === "fog" && Y(t, n, r, e), o.lightningFlash > 0 && (t.globalAlpha = i * o.lightningFlash * 0.7, t.fillStyle = "rgba(200,220,255,1)", t.fillRect(0, 0, r, e)), t.restore();
}
function _(t, n, o) {
  const i = n * 0.75, r = o * 0.18, e = Math.min(n, o) * 0.08, a = t.createRadialGradient(i, r, e * 0.5, i, r, e * 3);
  a.addColorStop(0, "rgba(255,240,180,0.4)"), a.addColorStop(1, "rgba(255,240,180,0)"), t.fillStyle = a, t.fillRect(i - e * 3, r - e * 3, e * 6, e * 6);
  const l = t.createRadialGradient(i, r, 0, i, r, e);
  l.addColorStop(0, "#fffde7"), l.addColorStop(1, "#ffe082"), t.fillStyle = l, t.beginPath(), t.arc(i, r, e, 0, Math.PI * 2), t.fill();
}
function N(t, n, o) {
  const i = n * 0.75, r = o * 0.18, e = Math.min(n, o) * 0.06, a = t.createRadialGradient(i - e * 0.2, r - e * 0.2, 0, i, r, e);
  a.addColorStop(0, "#fffde7"), a.addColorStop(0.6, "#fff8e1"), a.addColorStop(1, "#ffecb3"), t.fillStyle = a, t.beginPath(), t.arc(i, r, e, 0, Math.PI * 2), t.fill();
  const l = t.createRadialGradient(i, r, e, i, r, e * 2.5);
  l.addColorStop(0, "rgba(255,248,220,0.2)"), l.addColorStop(1, "rgba(255,248,220,0)"), t.fillStyle = l, t.beginPath(), t.arc(i, r, e * 2.5, 0, Math.PI * 2), t.fill();
}
function Y(t, n, o, i) {
  const r = n.time === "night" ? "rgba(80,90,100," : "rgba(200,205,210,", e = 5;
  for (let a = 0; a < e; a++) {
    const l = i / e * a + i * 0.1, c = t.createLinearGradient(0, l, 0, l + i * 0.2);
    c.addColorStop(0, `${r}0)`), c.addColorStop(0.5, `${r}0.18)`), c.addColorStop(1, `${r}0)`), t.fillStyle = c, t.fillRect(0, l, o, i * 0.2);
  }
}
class q {
  constructor(n) {
    d(this, "particles");
    d(this, "cursor", 0);
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
const D = { light: 0.3, medium: 0.65, heavy: 1 };
function v(t) {
  return D[t.intensity];
}
const H = 600;
class C {
  constructor() {
    d(this, "pool");
    d(this, "spawnAccum", 0);
    d(this, "time", 0);
    d(this, "config", null);
    d(this, "width", 0);
    d(this, "height", 0);
    this.pool = new q(H);
  }
  init(n, o, i) {
    if (this.config = n, this.width = o, this.height = i, this.pool.reset(), this.spawnAccum = 0, this.time = 0, n.condition === "clear" && n.time === "night") {
      const r = Math.floor(120 * v(n));
      for (let e = 0; e < r; e++) j(this.pool, o, i);
    }
  }
  update(n) {
    if (!this.config) return;
    this.time += n;
    const o = this.config, i = v(o), r = this.width, e = this.height;
    for (const h of this.pool.particles)
      h.active && (h.x += h.vx * n, h.y += h.vy * n, h.phase += n, o.condition === "snow" && (h.vx = Math.sin(h.phase * 0.8) * 18), o.condition === "clear" && o.time === "night" && (h.alpha = 0.5 + 0.5 * Math.sin(h.phase * 2.5 + h.size)), (h.y > e + 20 || h.x < -20 || h.x > r + 20 || h.y < -20) && (h.active = !1));
    const a = {
      rain: 120 * i,
      "storm-rain": 280 * i,
      snow: 30 * i,
      wind: 60 * i
    }, l = o.condition === "storm" ? "storm-rain" : o.condition, c = a[l];
    if (c)
      for (this.spawnAccum += c * n; this.spawnAccum >= 1; )
        this.spawnAccum -= 1, o.condition === "rain" ? U(this.pool, r) : o.condition === "storm" ? V(this.pool, r) : o.condition === "snow" ? Z(this.pool, r) : o.condition === "wind" && B(this.pool, r, e);
  }
  draw(n, o, i) {
    const r = i ?? this.config;
    if (r) {
      n.save();
      for (const e of this.pool.particles)
        e.active && K(n, e, r, o);
      n.restore();
    }
  }
}
function K(t, n, o, i) {
  t.globalAlpha = i * n.alpha, o.condition === "rain" || o.condition === "storm" ? (t.strokeStyle = o.condition === "storm" ? "rgba(180,200,220,0.8)" : "rgba(160,190,220,0.7)", t.lineWidth = o.condition === "storm" ? 1.5 : 1, t.beginPath(), t.moveTo(n.x, n.y), t.lineTo(n.x + n.vx * 0.04, n.y + n.length), t.stroke()) : o.condition === "snow" ? (t.fillStyle = `rgba(255,255,255,${n.alpha})`, t.beginPath(), t.arc(n.x, n.y, n.size, 0, Math.PI * 2), t.fill()) : o.condition === "clear" && o.time === "night" ? (t.fillStyle = `rgba(255,255,240,${n.alpha})`, t.beginPath(), t.arc(n.x, n.y, n.size, 0, Math.PI * 2), t.fill()) : o.condition === "wind" && (t.strokeStyle = `rgba(180,210,240,${n.alpha})`, t.lineWidth = 1, t.beginPath(), t.moveTo(n.x, n.y), t.lineTo(n.x + n.length, n.y), t.stroke());
}
function U(t, n) {
  const o = t.spawn();
  o && (o.x = Math.random() * (n + 100) - 50, o.y = -10, o.vx = -20, o.vy = 650 + Math.random() * 200, o.alpha = 0.4 + Math.random() * 0.4, o.size = 1, o.length = 14 + Math.random() * 10, o.phase = 0);
}
function V(t, n) {
  const o = t.spawn();
  o && (o.x = Math.random() * (n + 100) - 50, o.y = -10, o.vx = -35, o.vy = 900 + Math.random() * 300, o.alpha = 0.5 + Math.random() * 0.4, o.size = 1, o.length = 20 + Math.random() * 14, o.phase = 0);
}
function Z(t, n) {
  const o = t.spawn();
  o && (o.x = Math.random() * n, o.y = -10, o.vx = 0, o.vy = 40 + Math.random() * 50, o.alpha = 0.6 + Math.random() * 0.4, o.size = 1.5 + Math.random() * 3, o.length = 0, o.phase = Math.random() * Math.PI * 2);
}
function j(t, n, o) {
  const i = t.spawn();
  i && (i.x = Math.random() * n, i.y = Math.random() * o * 0.7, i.vx = 0, i.vy = 0, i.alpha = 0.3 + Math.random() * 0.7, i.size = 0.5 + Math.random() * 1.5, i.length = 0, i.phase = Math.random() * Math.PI * 2);
}
function B(t, n, o) {
  const i = t.spawn();
  i && (i.x = -20, i.y = Math.random() * o, i.vx = 300 + Math.random() * 200, i.vy = 0, i.alpha = 0.2 + Math.random() * 0.5, i.size = 1, i.length = 30 + Math.random() * 60, i.phase = 0);
}
function J(t, n) {
  return { from: t, to: n, elapsed: 0 };
}
function Q(t, n) {
  return {
    ...t,
    elapsed: Math.min(t.elapsed + n * 1e3, t.to.transitionMs)
  };
}
function X(t) {
  const n = $(t.elapsed / t.to.transitionMs, 0, 1);
  return E(n);
}
function x(t) {
  return t.elapsed >= t.to.transitionMs;
}
function tt(t, n, o) {
  const i = new C();
  return i.init(t, n, o), {
    current: t,
    currentClouds: w(t, n, o),
    currentPS: i,
    currentAtmo: M(),
    transition: null,
    transClouds: null,
    transPS: null,
    transAtmo: null
  };
}
function nt(t, n, o, i) {
  const r = t.current, e = new C();
  return e.init(n, o, i), {
    ...t,
    transition: J(r, n),
    transClouds: w(n, o, i),
    transPS: e,
    transAtmo: M()
  };
}
function ot(t, n, o, i) {
  let r = { ...t };
  if (S(r.currentAtmo, r.current, n), r.currentPS.update(n), y(r.currentClouds, n, o), r.transition) {
    const e = Q(r.transition, n);
    r.transition = e, r.transAtmo && S(r.transAtmo, e.to, n), r.transPS && r.transPS.update(n), r.transClouds && y(r.transClouds, n, o), x(e) && (r = {
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
function it(t, n, o, i, r) {
  if (o.clearRect(0, 0, i, r), t.transition) {
    const e = X(t.transition), a = t.transition.from, l = t.transition.to;
    R(n, a, l, e);
    const c = 1 - e;
    f(o, t.currentClouds, a, c), p(o, a, t.currentAtmo, c, i, r), t.currentPS.draw(o, c, a), t.transClouds && f(o, t.transClouds, l, e), t.transAtmo && p(o, l, t.transAtmo, e, i, r), t.transPS && t.transPS.draw(o, e, l);
  } else
    k(n, t.current), f(o, t.currentClouds, t.current, 1), p(o, t.current, t.currentAtmo, 1, i, r), t.currentPS.draw(o, 1, t.current);
}
class et {
  constructor(n) {
    d(this, "destroyed", !1);
    d(this, "skyEl");
    d(this, "canvas");
    d(this, "ctx");
    d(this, "rafId", null);
    d(this, "lastTimestamp", null);
    d(this, "engineState", null);
    d(this, "resizeObserver");
    if (this.container = n, !n) throw new Error("WeatherScene: container element is required");
    n.style.position = "relative", n.style.overflow = "hidden", this.skyEl = document.createElement("div"), this.skyEl.style.cssText = "position:absolute;inset:0;", this.canvas = document.createElement("canvas"), this.canvas.style.cssText = "position:absolute;inset:0;", n.appendChild(this.skyEl), n.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d"), this.resizeCanvas(), this.resizeObserver = new ResizeObserver(() => this.resizeCanvas()), this.resizeObserver.observe(n);
  }
  resizeCanvas() {
    const { offsetWidth: n, offsetHeight: o } = this.container;
    this.canvas.width = n, this.canvas.height = o;
  }
  set(n) {
    if (this.destroyed) return;
    const o = I(n), { offsetWidth: i, offsetHeight: r } = this.container;
    this.engineState ? this.engineState = nt(this.engineState, o, i, r) : (this.engineState = tt(o, i, r), this.startLoop());
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
        this.engineState = ot(this.engineState, i, r), it(this.engineState, this.skyEl, this.ctx, r, e);
      }
      this.rafId = requestAnimationFrame(n);
    };
    this.rafId = requestAnimationFrame(n);
  }
  stopLoop() {
    this.rafId != null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.lastTimestamp = null;
  }
}
export {
  et as WeatherScene
};
