var tn = Object.defineProperty;
var en = (n, t, e) => t in n ? tn(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var b = (n, t, e) => en(n, typeof t != "symbol" ? t + "" : t, e);
const on = ["clear", "cloudy", "rain", "snow", "storm", "fog", "wind", "hail"], rn = ["none", "sunrise", "sunset", "moonrise", "moonset"], sn = [
  "new",
  "waxing-crescent",
  "first-quarter",
  "waxing-gibbous",
  "full",
  "waning-gibbous",
  "last-quarter",
  "waning-crescent"
];
function an(n) {
  const t = on.includes(n.condition) ? n.condition : "clear", e = sn.includes(n.moonPhase) ? n.moonPhase : "full", o = rn.includes(n.celestialEvent) ? n.celestialEvent : "none", i = n.celestialProgress ?? 0.5, r = Math.min(1, Math.max(0, Number.isFinite(i) ? i : 0.5));
  return {
    condition: t,
    intensity: n.intensity ?? "medium",
    time: n.time ?? "day",
    transitionMs: n.transitionMs ?? 1200,
    fidelity: n.fidelity ?? "subtle",
    moonPhase: e,
    celestialEvent: o,
    celestialProgress: r
  };
}
function C(n, t, e) {
  const o = Math.max(0, Math.min(1, e));
  return n + (t - n) * o;
}
function L(n, t, e) {
  return Math.max(t, Math.min(e, n));
}
function ln(n) {
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
function F(n, t, e) {
  return {
    r: Math.round(C(n.r, t.r, e)),
    g: Math.round(C(n.g, t.g, e)),
    b: Math.round(C(n.b, t.b, e))
  };
}
function w(n) {
  return `rgb(${n.r},${n.g},${n.b})`;
}
const cn = {
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
function R(n) {
  return cn[`${n.condition}:${n.time}`];
}
function N(n, t) {
  return {
    r: Math.round(C(n.r, 255, t)),
    g: Math.round(C(n.g, 255, t)),
    b: Math.round(C(n.b, 255, t))
  };
}
function hn(n, t, e = 0) {
  const o = R(t), i = e > 0 ? N(o.top, e * 0.4) : o.top, r = e > 0 ? N(o.bottom, e * 0.4) : o.bottom;
  n.style.background = `linear-gradient(to bottom, ${w(i)}, ${w(r)})`;
}
function un(n, t, e, o) {
  const i = R(t), r = R(e), s = w(F(i.top, r.top, o)), a = w(F(i.bottom, r.bottom, o));
  n.style.background = `linear-gradient(to bottom, ${s}, ${a})`;
}
let dn = Math.random;
function c() {
  return dn();
}
const B = [6e-3, 0.022, 0.06], fn = { 0: 4, 1: 5, 2: 6 }, pn = { light: 0.55, medium: 1, heavy: 1.5 }, bn = { light: 0.75, medium: 1, heavy: 1.2 };
function k(n, t) {
  return n.condition === "storm" ? n.time === "night" ? `rgba(26,26,42,${t})` : `rgba(42,42,58,${t})` : n.condition === "hail" ? n.time === "night" ? `rgba(40,52,50,${t})` : `rgba(70,86,82,${t})` : n.condition === "rain" ? n.time === "night" ? `rgba(58,74,90,${t})` : `rgba(106,122,138,${t})` : n.time === "night" ? `rgba(58,74,106,${t})` : `rgba(208,216,224,${t})`;
}
function W(n, t) {
  const e = n.condition === "storm" ? 0.9 : n.condition === "hail" ? 0.85 : n.condition === "rain" ? 0.75 : n.condition === "wind" ? 0.55 : n.condition === "cloudy" ? 0.7 : 0.5;
  return Math.min(0.95, e * (1 - t * 0.12) * bn[n.intensity]);
}
function mn(n) {
  return n !== "clear" && n !== "fog";
}
function G(n, t, e) {
  const o = n / 2, i = t / 2, r = o / i, s = Math.max(4, Math.min(9, Math.round(2 + r * 1.8))), a = e ? 2.4 : 1.8, u = a / Math.max(1, s - 1), h = [];
  for (let d = 0; d < s; d++) {
    const l = s === 1 ? 0.5 : d / (s - 1), m = (l - 0.5) * a + (c() * 2 - 1) * u * 0.15, g = 1 - Math.abs(l - 0.5) * 2, P = Math.min(1.1, 0.62 + g * (e ? 0.18 : 0.42) + (c() * 0.3 - 0.15)), A = 1 - P + c() * 0.08 + (c() * 0.2 - 0.1);
    h.push({ dx: m, dy: A, r: P });
  }
  if (!e && s >= 5) {
    const d = c() < 0.5 ? 1 : 2;
    for (let l = 0; l < d; l++) {
      const m = (0.3 + c() * 0.4 - 0.5) * a * 0.8, g = Math.min(1.15, 0.85 + c() * 0.2), S = 1 - g + 0.05 + c() * 0.1;
      h.push({ dx: m, dy: S, r: g, alpha: 0.45 });
    }
  }
  return h;
}
function K(n, t, e) {
  if (!mn(n.condition)) return [];
  const o = [], i = pn[n.intensity];
  if (n.condition === "storm") {
    const s = [2, 2, 3];
    for (const a of [0, 1, 2]) {
      const u = Math.max(1, Math.round(s[a] * i)), h = 1 + a * 0.4;
      for (let d = 0; d < u; d++) {
        const l = t * (0.18 + c() * 0.14) * h, p = e * (0.3 + c() * 0.2) * h;
        o.push({
          x: d / u * t * 1.3 - t * 0.15,
          y: e * (a * 0.07 + c() * 0.05) - p * 0.15,
          width: l,
          height: p,
          alpha: W(n, a),
          speed: B[a] * t,
          layer: a,
          lobes: G(l, p, !1)
        });
      }
    }
    return o;
  }
  const r = n.condition === "wind" ? [2] : [0, 1, 2];
  for (const s of r) {
    const a = n.condition === "wind" ? 8 : fn[s], u = Math.max(2, Math.round(a * i));
    for (let h = 0; h < u; h++) {
      const d = n.condition === "wind", l = 1 + s * 0.35, p = d ? t * (0.15 + c() * 0.12) : t * (0.22 + c() * 0.18) * l, m = d ? e * 0.04 : e * (0.12 + c() * 0.08) * l;
      o.push({
        x: h / u * t * 1.4 - t * 0.2,
        y: e * (0.04 + s * 0.18 + c() * 0.08),
        width: p,
        height: m,
        alpha: W(n, s),
        speed: B[s] * (d ? 3 : 1) * t,
        layer: s,
        lobes: d ? [] : G(p, m, c() < 0.35)
      });
    }
  }
  return o;
}
function Y(n, t, e) {
  for (const o of n)
    o.x += o.speed * t, o.x > e + o.width / 2 && (o.x = -o.width / 2);
}
function gn(n, t) {
  const e = n.width / 2, o = n.height / 2, i = Math.max(2, o * 0.12), r = i * 4 + Math.max(o, e * 0.15), s = Math.ceil(n.width + r * 2), a = Math.ceil(n.height + r * 2), u = new OffscreenCanvas(s, a), h = u.getContext("2d"), d = s / 2, l = a / 2;
  if (n.spriteCx = d, n.spriteCy = l, n.lobes.length === 0) {
    h.filter = `blur(${i}px)`, h.translate(d, l), h.scale(e / o, 1);
    const v = h.createRadialGradient(0, 0, 0, 0, 0, o);
    return v.addColorStop(0, k(t, 1)), v.addColorStop(0.4, k(t, 0.6)), v.addColorStop(1, "rgba(0,0,0,0)"), h.fillStyle = v, h.beginPath(), h.arc(0, 0, o, 0, Math.PI * 2), h.fill(), u;
  }
  const p = new OffscreenCanvas(s, a), m = p.getContext("2d");
  m.fillStyle = k(t, 1);
  for (const v of n.lobes) {
    const x = d + v.dx * e, nn = l + v.dy * o;
    m.beginPath(), m.arc(x, nn, v.r * o, 0, Math.PI * 2), m.fill();
  }
  h.filter = `blur(${i}px)`, h.drawImage(p, 0, 0), h.filter = "none", h.globalCompositeOperation = "source-atop";
  const g = t.time === "day", S = t.condition === "rain" || t.condition === "storm" || t.condition === "hail", P = g ? "rgba(255,244,214,0.22)" : "rgba(190,205,235,0.10)", A = S ? "rgba(0,0,0,0.35)" : g ? "rgba(0,0,0,0.16)" : "rgba(0,0,0,0.28)", M = h.createLinearGradient(0, l - o * 1.1, 0, l + o * 1.1);
  return M.addColorStop(0, P), M.addColorStop(0.5, "rgba(255,255,255,0)"), M.addColorStop(1, A), h.fillStyle = M, h.fillRect(0, 0, s, a), h.globalCompositeOperation = "source-over", u;
}
function I(n, t, e, o) {
  if (t.length !== 0) {
    n.save();
    for (const i of t) {
      const r = `${e.condition}:${e.time}`;
      (!i.sprite || i.spriteKey !== r) && (i.sprite = gn(i, e), i.spriteKey = r), n.globalAlpha = o * i.alpha, n.drawImage(i.sprite, i.x - (i.spriteCx ?? 0), i.y - (i.spriteCy ?? 0));
    }
    n.restore();
  }
}
function yn(n, t, e, o, i) {
  return t + e * Math.sin(n * o + i);
}
const Sn = { x: 0.75, y: 0.18 }, vn = 0.5, O = 0.68, Pn = 0.32, Z = 0.5, q = { y: O - Z };
function $(n, t) {
  if (n === "none") return Sn;
  const e = Math.min(1, Math.max(0, t)), i = n === "sunrise" || n === "moonrise" ? e * 0.5 : 0.5 + e * 0.5, r = Math.PI - Math.PI * i;
  return {
    x: Number((vn + Math.cos(r) * Pn).toFixed(4)),
    y: Number((O - Math.sin(r) * Z).toFixed(4))
  };
}
function J(n) {
  return Math.max(0, Math.min(1, (n.y - q.y) / (O - q.y)));
}
const Cn = {
  light: 0.45,
  medium: 0.22,
  heavy: 0
};
function Mn(n) {
  return n.celestialEvent !== "none" ? 1 : n.condition === "cloudy" ? Cn[n.intensity] : n.time === "day" && (n.condition === "clear" || n.condition === "wind") || n.time === "night" && n.condition === "clear" ? 1 : 0;
}
function j() {
  return { lightningFlash: 0, lightningTimer: 2e3, boltPoints: null, time: 0, fogPlumes: null, preflicker: 0, boltBranches: null };
}
function H(n, t, e) {
  if (n.time += e, t.condition === "storm") {
    if (n.lightningTimer -= e * 1e3, n.lightningTimer <= 0 && n.preflicker <= 0 && n.lightningFlash <= 0 && (n.preflicker = 1), n.preflicker > 0 && (n.preflicker = Math.max(0, n.preflicker - e * 12), n.preflicker <= 0)) {
      n.lightningFlash = 1;
      const o = t.intensity === "heavy" ? 1500 : t.intensity === "medium" ? 2500 : 4e3;
      n.lightningTimer = o + c() * o;
      const i = kn();
      n.boltPoints = i, n.boltBranches = In(i);
    }
    n.lightningFlash = Math.max(0, n.lightningFlash - e * 3.5), n.lightningFlash <= 0 && (n.boltPoints = null, n.boltBranches = null);
  } else
    n.lightningFlash = 0, n.lightningTimer = 2e3, n.boltPoints = null, n.preflicker = 0, n.boltBranches = null;
  if (t.condition === "fog") {
    n.fogPlumes || (n.fogPlumes = Array.from({ length: 4 }, (o, i) => ({
      baseX: c(),
      baseY: 0.45 + i * 0.14 + c() * 0.06,
      speed: 0.01 + c() * 0.02,
      bobAmp: 8 + c() * 10,
      bobFreq: 0.15 + c() * 0.15,
      phase: c() * Math.PI * 2
    })));
    for (const o of n.fogPlumes)
      o.baseX += o.speed * e, o.baseX > 1.3 && (o.baseX -= 1.6);
  } else
    n.fogPlumes = null;
}
function E(n, t, e, o, i, r) {
  n.save(), n.globalAlpha = o, An(n, t, o, i, r), t.condition === "fog" && On(n, t, e, i, r);
  const s = Math.max(e.lightningFlash, e.preflicker * 0.4);
  if (s > 0 && (n.globalAlpha = o * s * 0.45, n.fillStyle = "rgba(200,220,255,1)", n.fillRect(0, 0, i, r), e.boltPoints && e.lightningFlash > 0 && (X(n, e.boltPoints, o * e.lightningFlash, i, r), e.boltBranches)))
    for (const a of e.boltBranches)
      X(n, a, o * e.lightningFlash * 0.7, i, r);
  if (t.fidelity === "rich" && e.lightningFlash > 0 && t.condition === "storm") {
    n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = o * e.lightningFlash * 0.5;
    const a = n.createLinearGradient(0, 0, 0, r * 0.5);
    a.addColorStop(0, "rgba(150,180,255,0.6)"), a.addColorStop(1, "rgba(150,180,255,0)"), n.fillStyle = a, n.fillRect(0, 0, i, r * 0.5), n.restore();
  }
  n.restore();
}
function T(n, t, e, o, i, r) {
  const s = Mn(t);
  s <= 0 || (n.save(), n.globalAlpha = o * s, _(t.celestialEvent) || t.celestialEvent === "none" && t.time === "day" ? En(n, t, e, i, r) : Tn(n, t, i, r), n.restore());
}
function _(n) {
  return n === "sunrise" || n === "sunset";
}
function wn(n) {
  return n === "moonrise" || n === "moonset";
}
function An(n, t, e, o, i) {
  if (t.celestialEvent === "none") return;
  const r = $(t.celestialEvent, t.celestialProgress), s = J(r);
  if (n.save(), _(t.celestialEvent)) {
    n.globalAlpha = e * (0.35 + s * 0.25);
    const a = n.createLinearGradient(0, 0, 0, i);
    a.addColorStop(0, "rgba(70,95,155,0.10)"), a.addColorStop(0.58, "rgba(255,132,92,0.14)"), a.addColorStop(1, "rgba(255,190,92,0.42)"), n.fillStyle = a, n.fillRect(0, 0, o, i), n.globalAlpha = e * (0.2 + s * 0.28);
    const u = o * r.x, h = i * r.y, d = Math.max(o, i) * (0.38 + s * 0.16), l = n.createRadialGradient(u, h, 0, u, h, d);
    l.addColorStop(0, "rgba(255,190,90,0.5)"), l.addColorStop(0.45, "rgba(255,150,90,0.22)"), l.addColorStop(1, "rgba(255,120,80,0)"), n.fillStyle = l, n.fillRect(0, 0, o, i);
  } else if (wn(t.celestialEvent)) {
    n.globalAlpha = e * (0.18 + s * 0.14);
    const a = n.createLinearGradient(0, 0, 0, i);
    a.addColorStop(0, "rgba(50,70,130,0)"), a.addColorStop(0.65, "rgba(95,120,170,0.08)"), a.addColorStop(1, "rgba(120,145,190,0.24)"), n.fillStyle = a, n.fillRect(0, 0, o, i), n.globalAlpha = e * (0.15 + s * 0.12);
    const u = n.createRadialGradient(o * r.x, i * 0.92, 0, o * r.x, i * 0.92, o * 0.4);
    u.addColorStop(0, "rgba(150,175,220,0.35)"), u.addColorStop(1, "rgba(150,175,220,0)"), n.fillStyle = u, n.fillRect(0, i * 0.5, o, i * 0.5);
  }
  n.restore();
}
function kn() {
  const n = 0.2 + c() * 0.6, t = [[n, 0.08]];
  let e = n;
  for (let o = 1; o <= 8; o++)
    e += (c() - 0.5) * 0.13, e = Math.max(0.05, Math.min(0.95, e)), t.push([e, 0.08 + 0.52 * o / 8]);
  return t;
}
function In(n) {
  const t = [], e = 1 + Math.floor(c() * 2);
  for (let o = 0; o < e; o++) {
    const i = 2 + Math.floor(c() * (n.length - 3)), [r, s] = n[i];
    let a = r, u = s;
    const h = [[a, u]], d = c() < 0.5 ? -1 : 1;
    for (let l = 0; l < 3; l++)
      a = Math.max(0.02, Math.min(0.98, a + d * (0.04 + c() * 0.05))), u = Math.min(0.95, u + 0.06 + c() * 0.05), h.push([a, u]);
    t.push(h);
  }
  return t;
}
function X(n, t, e, o, i) {
  n.save(), n.globalAlpha = e, n.lineCap = "round", n.lineJoin = "round";
  const r = () => {
    n.beginPath(), n.moveTo(t[0][0] * o, t[0][1] * i);
    for (let s = 1; s < t.length; s++)
      n.lineTo(t[s][0] * o, t[s][1] * i);
  };
  r(), n.strokeStyle = "rgba(140,180,255,0.5)", n.lineWidth = 10, n.shadowColor = "#90b8ff", n.shadowBlur = 30, n.stroke(), r(), n.strokeStyle = "rgba(200,220,255,0.85)", n.lineWidth = 3.5, n.shadowBlur = 12, n.stroke(), r(), n.strokeStyle = "#ffffff", n.lineWidth = 1.5, n.shadowBlur = 0, n.stroke(), n.restore();
}
function En(n, t, e, o, i) {
  const r = $(t.celestialEvent, t.celestialProgress), s = o * r.x, a = i * r.y, h = _(t.celestialEvent) ? J(r) : 0, d = Math.min(o, i) * (0.08 + h * 0.02), l = n.createRadialGradient(s, a, d * 0.4, s, a, d * (4 + h * 2));
  l.addColorStop(0, `rgba(255,220,150,${0.45 + h * 0.2})`), l.addColorStop(0.5, `rgba(255,170,110,${0.12 + h * 0.12})`), l.addColorStop(1, "rgba(255,240,180,0)");
  const p = d * (4 + h * 2);
  if (n.fillStyle = l, n.fillRect(s - p, a - p, p * 2, p * 2), t.fidelity === "rich") {
    n.save(), n.translate(s, a), n.rotate(e.time * 0.05), n.globalAlpha = 0.12, n.strokeStyle = "rgba(255,245,200,1)", n.lineWidth = 2;
    for (let g = 0; g < 12; g++) {
      const S = g / 12 * Math.PI * 2;
      n.beginPath(), n.moveTo(Math.cos(S) * d * 1.3, Math.sin(S) * d * 1.3), n.lineTo(Math.cos(S) * d * 2.6, Math.sin(S) * d * 2.6), n.stroke();
    }
    n.restore();
  }
  const m = n.createRadialGradient(s, a, 0, s, a, d);
  m.addColorStop(0, "#fffde7"), m.addColorStop(1, "#ffe082"), n.fillStyle = m, n.beginPath(), n.arc(s, a, d, 0, Math.PI * 2), n.fill();
}
function Tn(n, t, e, o) {
  const i = $(t.celestialEvent, t.celestialProgress), r = e * i.x, s = o * i.y, a = Math.min(e, o) * 0.06, u = t.moonPhase, h = u === "new";
  if (!h) {
    const g = n.createRadialGradient(r, s, a, r, s, a * 2.6);
    g.addColorStop(0, "rgba(220,230,245,0.22)"), g.addColorStop(1, "rgba(220,230,245,0)"), n.fillStyle = g, n.beginPath(), n.arc(r, s, a * 2.6, 0, Math.PI * 2), n.fill();
  }
  const d = n.createRadialGradient(r - a * 0.15, s - a * 0.2, 0, r, s, a);
  if (d.addColorStop(0, h ? "rgba(155,165,185,0.18)" : "rgba(70,76,92,0.55)"), d.addColorStop(1, h ? "rgba(100,110,130,0.13)" : "rgba(38,44,58,0.6)"), n.fillStyle = d, n.beginPath(), n.arc(r, s, a, 0, Math.PI * 2), n.fill(), h) {
    n.strokeStyle = "rgba(190,200,220,0.14)", n.lineWidth = Math.max(1, a * 0.035), n.beginPath(), n.arc(r, s, a, 0, Math.PI * 2), n.stroke();
    return;
  }
  n.save(), Rn(n, r, s, a, u), n.clip();
  const l = n.createRadialGradient(r - a * 0.2, s - a * 0.2, 0, r, s, a);
  l.addColorStop(0, "#fffde7"), l.addColorStop(0.6, "#fff8e1"), l.addColorStop(1, "#ffecb3"), n.fillStyle = l, n.beginPath(), n.arc(r, s, a, 0, Math.PI * 2), n.fill();
  const p = u === "waxing-crescent" || u === "waning-crescent" ? 0.18 : 0.35;
  n.fillStyle = `rgba(180,185,200,${p})`;
  const m = [[-0.3, -0.2, 0.18], [0.25, 0.1, 0.13], [0.05, 0.35, 0.1]];
  for (const [g, S, P] of m)
    n.beginPath(), n.arc(r + g * a, s + S * a, P * a, 0, Math.PI * 2), n.fill();
  n.restore();
}
function Rn(n, t, e, o, i) {
  const r = zn(i);
  if (n.beginPath(), r.kind === "full") {
    n.arc(t, e, o, 0, Math.PI * 2);
    return;
  }
  const s = r.side;
  if (n.moveTo(t, e - o), n.arc(t, e, o, -Math.PI / 2, Math.PI / 2, s < 0), r.kind === "quarter")
    n.lineTo(t, e - o);
  else {
    const a = r.kind === "crescent" ? 0.62 : -0.42, u = t + s * o * a;
    n.bezierCurveTo(u, e + o * 0.7, u, e - o * 0.7, t, e - o);
  }
  n.closePath();
}
function zn(n) {
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
function Ln(n, t) {
  const e = Math.ceil(n * 2), o = new OffscreenCanvas(e, e), i = o.getContext("2d"), r = t ? "90,100,112" : "205,210,216", s = i.createRadialGradient(n, n, 0, n, n, n);
  return s.addColorStop(0, `rgba(${r},0.5)`), s.addColorStop(0.5, `rgba(${r},0.22)`), s.addColorStop(1, `rgba(${r},0)`), i.fillStyle = s, i.beginPath(), i.arc(n, n, n, 0, Math.PI * 2), i.fill(), o;
}
function On(n, t, e, o, i) {
  if (!e.fogPlumes) return;
  const r = t.time === "night", s = o * 0.4;
  for (const a of e.fogPlumes) {
    (!a.sprite || a.spriteR !== s) && (a.sprite = Ln(s, r), a.spriteR = s);
    const u = a.baseX * o - s, h = yn(e.time, a.baseY * i, a.bobAmp, a.bobFreq, a.phase) - s;
    n.drawImage(a.sprite, u, h), a.baseX * o - s > o - s * 2 && n.drawImage(a.sprite, u - o - s * 2, h);
  }
}
class $n {
  constructor(t) {
    b(this, "particles");
    b(this, "cursor", 0);
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
const _n = { light: 0.3, medium: 0.65, heavy: 1 };
function D(n) {
  return _n[n.intensity];
}
const Fn = { subtle: 1, rich: 1.8 };
function Nn(n) {
  return Fn[n.fidelity];
}
function y(n, t, e) {
  return t + (e - t) * n;
}
const z = 0.15;
function Bn(n) {
  return n !== "light";
}
function Wn(n, t, e) {
  return t * L(n / e, 0, 1);
}
function Gn(n, t) {
  return 1 - L(n / t, 0, 1);
}
function Yn(n, t, e, o) {
  return t + e * Math.sin(n * o);
}
function qn(n, t) {
  return -n * t;
}
function Hn(n, t, e, o) {
  return t >= e || Math.abs(n) < o;
}
const Xn = 900;
class Q {
  constructor() {
    b(this, "pool");
    b(this, "spawnAccum", 0);
    b(this, "time", 0);
    b(this, "config", null);
    b(this, "width", 0);
    b(this, "height", 0);
    this.pool = new $n(Xn);
  }
  init(t, e, o) {
    if (this.config = t, this.width = e, this.height = o, this.pool.reset(), this.spawnAccum = 0, this.time = 0, t.condition === "clear" && t.time === "night") {
      const i = Math.floor(120 * D(t));
      for (let r = 0; r < i; r++) Qn(this.pool, e, o);
    }
  }
  update(t) {
    if (!this.config) return;
    this.time += t;
    const e = this.config, o = D(e) * Nn(e), i = this.width, r = this.height, s = e.fidelity === "rich", a = Yn(this.time, -20, 12, 0.4);
    for (const l of this.pool.particles)
      if (l.active) {
        if (l.x += l.vx * t, l.y += l.vy * t, l.phase += t, l.kind === "splash") {
          l.phase >= z && (l.active = !1);
          continue;
        }
        if (l.kind === "droplet") {
          l.vy += 500 * t, l.alpha -= t * 4, (l.alpha <= 0 || l.y > r + 10) && (l.active = !1);
          continue;
        }
        if (l.kind === "leaf" && (l.phase += t * 6), e.condition === "snow" && (l.vx = Math.sin(l.phase * 0.8) * 18), e.condition === "rain" && (l.vx = a * y(l.depth, 0.6, 1)), e.condition === "clear" && e.time === "night" && (l.alpha = 0.5 + 0.5 * Math.sin(l.phase * 2.5 + l.size)), (e.condition === "rain" || e.condition === "storm") && l.kind === "primary" && l.y > r && Bn(e.intensity)) {
          const p = s ? 0.3 : 0.6;
          l.depth > p && (Vn(this.pool, l.x, r, s, e.intensity), s && Kn(this.pool, l.x, r, 2 + Math.floor(c() * 3))), l.active = !1;
          continue;
        }
        if (e.condition === "hail" && l.bounces > 0 && (l.vy += 980 * t), e.condition === "hail" && l.kind === "primary" && l.y > r) {
          s && !Hn(l.vy, l.bounces, 2, 80) ? (l.y = r, l.vy = qn(l.vy, 0.4), l.vx += (c() - 0.5) * 60, l.size *= 0.8, l.bounces += 1) : l.active = !1;
          continue;
        }
        (l.y > r + 20 || l.x < -20 || l.x > i + 20 || l.y < -20) && (l.active = !1);
      }
    const u = {
      rain: 120 * o,
      "storm-rain": 280 * o,
      snow: 30 * o,
      wind: 60 * o,
      hail: 90 * o
    }, h = e.condition === "storm" ? "storm-rain" : e.condition, d = u[h];
    if (d)
      for (this.spawnAccum += d * t; this.spawnAccum >= 1; )
        this.spawnAccum -= 1, e.condition === "rain" ? Zn(this.pool, i) : e.condition === "storm" ? Jn(this.pool, i) : e.condition === "snow" ? jn(this.pool, i) : e.condition === "wind" ? xn(this.pool, i, r, s) : e.condition === "hail" && nt(this.pool, i);
  }
  draw(t, e, o) {
    const i = o ?? this.config;
    if (i) {
      t.save();
      for (const r of this.pool.particles)
        r.active && Dn(t, r, i, e);
      t.restore();
    }
  }
}
function Dn(n, t, e, o) {
  if (t.kind === "droplet") {
    n.globalAlpha = o * t.alpha, n.fillStyle = "rgba(180,205,225,1)", n.beginPath(), n.arc(t.x, t.y, t.size, 0, Math.PI * 2), n.fill();
    return;
  }
  if (t.kind === "splash") {
    const i = Wn(t.phase, t.size, z), r = Gn(t.phase, z), s = e.intensity === "heavy";
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
const Un = { light: 1, medium: 1.4, heavy: 2 };
function Vn(n, t, e, o, i) {
  const r = n.spawn();
  if (!r) return;
  const s = Un[i];
  r.x = t, r.y = e - 1, r.vx = 0, r.vy = 0, r.alpha = 1, r.size = (o ? 8 + c() * 5 : 5 + c() * 3) * s, r.length = 0, r.phase = 0, r.depth = 1, r.bounces = 0, r.kind = "splash";
}
function Kn(n, t, e, o) {
  for (let i = 0; i < o; i++) {
    const r = n.spawn();
    if (!r) break;
    r.x = t + (c() - 0.5) * 6, r.y = e - 1, r.vx = (c() - 0.5) * 180, r.vy = -(50 + c() * 100), r.alpha = 0.6 + c() * 0.4, r.size = 1 + c() * 1.5, r.length = 0, r.phase = 0, r.depth = 1, r.bounces = 0, r.kind = "droplet";
  }
}
function Zn(n, t) {
  const e = n.spawn();
  if (!e) return;
  const o = c();
  e.x = c() * (t + 100) - 50, e.y = -10, e.vx = -20 * y(o, 0.6, 1), e.vy = (650 + c() * 200) * y(o, 0.55, 1), e.alpha = (0.4 + c() * 0.4) * y(o, 0.5, 1), e.size = 1, e.length = (14 + c() * 10) * y(o, 0.5, 1), e.phase = 0, e.depth = o, e.bounces = 0, e.kind = "primary";
}
function Jn(n, t) {
  const e = n.spawn();
  e && (e.x = c() * (t + 100) - 50, e.y = -10, e.vx = -35, e.vy = 900 + c() * 300, e.alpha = 0.5 + c() * 0.4, e.size = 1, e.length = 20 + c() * 14, e.phase = 0, e.depth = c(), e.bounces = 0, e.kind = "primary");
}
function jn(n, t) {
  const e = n.spawn();
  if (!e) return;
  const o = c();
  e.x = c() * t, e.y = -10, e.vx = 0, e.vy = (40 + c() * 50) * y(o, 0.5, 1), e.alpha = (0.6 + c() * 0.4) * y(o, 0.5, 1), e.size = (1.5 + c() * 3) * y(o, 0.5, 1), e.length = 0, e.phase = c() * Math.PI * 2, e.depth = o, e.bounces = 0, e.kind = "primary";
}
function Qn(n, t, e) {
  const o = n.spawn();
  if (!o) return;
  const i = c() < 0.12;
  o.x = c() * t, o.y = c() * e * 0.7, o.vx = 0, o.vy = 0, o.alpha = 0.3 + c() * 0.7, o.size = i ? 1.6 + c() * 1.2 : 0.5 + c() * 1.5, o.length = i ? 1 : 0, o.phase = c() * Math.PI * 2, o.depth = 0.5, o.bounces = 0, o.kind = "primary";
}
function xn(n, t, e, o) {
  const i = n.spawn();
  if (!i) return;
  const r = c(), s = o && c() < 0.12;
  i.x = -20, i.y = c() * e, i.vx = (300 + c() * 200) * y(r, 0.55, 1), i.vy = s ? (c() - 0.5) * 40 : 0, i.alpha = (0.2 + c() * 0.5) * y(r, 0.5, 1), i.size = s ? 3 + c() * 3 : 1, i.length = (30 + c() * 60) * y(r, 0.5, 1), i.phase = c() * Math.PI * 2, i.depth = r, i.bounces = 0, i.kind = s ? "leaf" : "primary";
}
function nt(n, t) {
  const e = n.spawn();
  if (!e) return;
  const o = c();
  e.x = c() * (t + 60) - 30, e.y = -10, e.vx = -8 * y(o, 0.5, 1), e.vy = (700 + c() * 250) * y(o, 0.55, 1), e.alpha = (0.7 + c() * 0.3) * y(o, 0.5, 1), e.size = (2 + c() * 2.5) * y(o, 0.5, 1), e.length = 0, e.phase = 0, e.depth = o, e.bounces = 0, e.kind = "primary";
}
function tt(n, t) {
  return { from: n, to: t, elapsed: 0 };
}
function et(n, t) {
  return {
    ...n,
    elapsed: Math.min(n.elapsed + t * 1e3, n.to.transitionMs)
  };
}
function ot(n) {
  const t = L(n.elapsed / n.to.transitionMs, 0, 1);
  return ln(t);
}
function it(n) {
  return n.elapsed >= n.to.transitionMs;
}
function rt(n, t, e) {
  const o = new Q();
  return o.init(n, t, e), {
    current: n,
    currentClouds: K(n, t, e),
    currentPS: o,
    currentAtmo: j(),
    transition: null,
    transClouds: null,
    transPS: null,
    transAtmo: null
  };
}
function st(n, t, e, o) {
  const i = n.current, r = new Q();
  return r.init(t, e, o), {
    ...n,
    transition: tt(i, t),
    transClouds: K(t, e, o),
    transPS: r,
    transAtmo: j()
  };
}
function U(n, t, e, o) {
  let i = { ...n };
  if (H(i.currentAtmo, i.current, t), i.currentPS.update(t), Y(i.currentClouds, t, e), i.transition) {
    const r = et(i.transition, t);
    i.transition = r, i.transAtmo && H(i.transAtmo, r.to, t), i.transPS && i.transPS.update(t), i.transClouds && Y(i.transClouds, t, e), it(r) && (i = {
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
function V(n, t, e, o, i) {
  if (e.clearRect(0, 0, o, i), n.transition) {
    const r = ot(n.transition), s = n.transition.from, a = n.transition.to, u = 1 - r;
    un(t, s, a, r), T(e, s, n.currentAtmo, u, o, i), n.transAtmo && T(e, a, n.transAtmo, r, o, i), I(e, n.currentClouds, s, u), E(e, s, n.currentAtmo, u, o, i), n.currentPS.draw(e, u, s), n.transClouds && I(e, n.transClouds, a, r), n.transAtmo && E(e, a, n.transAtmo, r, o, i), n.transPS && n.transPS.draw(e, r, a);
  } else
    hn(t, n.current, n.currentAtmo.lightningFlash), T(e, n.current, n.currentAtmo, 1, o, i), I(e, n.currentClouds, n.current, 1), E(e, n.current, n.currentAtmo, 1, o, i), n.currentPS.draw(e, 1, n.current);
}
class lt {
  constructor(t, e = {}) {
    b(this, "destroyed", !1);
    b(this, "skyEl");
    b(this, "canvas");
    b(this, "ctx");
    b(this, "rafId", null);
    b(this, "lastTimestamp", null);
    b(this, "engineState", null);
    b(this, "resizeObserver");
    b(this, "manual");
    if (this.container = t, !t) throw new Error("WeatherScene: container element is required");
    this.manual = e.manual ?? !1, getComputedStyle(t).position === "static" && (t.style.position = "relative"), t.style.overflow = "hidden", this.skyEl = document.createElement("div"), this.skyEl.style.cssText = "position:absolute;inset:0;", this.canvas = document.createElement("canvas"), this.canvas.style.cssText = "position:absolute;inset:0;", t.appendChild(this.skyEl), t.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d"), this.resizeCanvas(), this.resizeObserver = new ResizeObserver(() => this.resizeCanvas()), this.resizeObserver.observe(t);
  }
  resizeCanvas() {
    const { offsetWidth: t, offsetHeight: e } = this.container;
    this.canvas.width = t, this.canvas.height = e;
  }
  set(t) {
    if (this.destroyed) return;
    const e = an(t), { offsetWidth: o, offsetHeight: i } = this.container;
    this.engineState ? this.engineState = st(this.engineState, e, o, i) : (this.engineState = rt(e, o, i), this.manual || this.startLoop());
  }
  /** Deterministically tick + render N frames at a fixed delta (test hook). */
  advance(t, e = 1 / 60) {
    if (this.destroyed || !this.engineState || !this.ctx) return;
    const o = this.canvas.width, i = this.canvas.height;
    for (let r = 0; r < t; r++)
      this.engineState = U(this.engineState, e, o);
    V(this.engineState, this.skyEl, this.ctx, o, i);
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
        this.engineState = U(this.engineState, o, i), V(this.engineState, this.skyEl, this.ctx, i, r);
      }
      this.rafId = requestAnimationFrame(t);
    };
    this.rafId = requestAnimationFrame(t);
  }
  stopLoop() {
    this.rafId != null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.lastTimestamp = null;
  }
}
export {
  lt as WeatherScene
};
