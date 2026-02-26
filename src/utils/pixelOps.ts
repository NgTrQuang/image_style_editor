/**
 * Pure pixel-level operations used by renderer.ts
 * All functions operate on raw ImageData.data (Uint8ClampedArray)
 */

import { CurvePoint, HslChannel } from '../types/editor'

// ─── RGB ↔ HSL helpers ───────────────────────────────────────────────────────

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360
  if (s === 0) {
    const v = Math.round(l * 255)
    return [v, v, v]
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ]
}

// ─── Channel ranges for HSL per-color targeting ───────────────────────────────

const CHANNEL_RANGES: Record<HslChannel, [number, number]> = {
  red:    [345, 15],
  orange: [15,  45],
  yellow: [45,  75],
  green:  [75, 165],
  blue:   [165, 255],
  purple: [255, 345],
}

function hueInRange(h: number, range: [number, number]): boolean {
  const [lo, hi] = range
  if (lo > hi) return h >= lo || h <= hi   // wraps around 360
  return h >= lo && h <= hi
}

function channelWeight(h: number, range: [number, number]): number {
  const [lo, hi] = range
  let span: number, dist: number
  if (lo > hi) {
    span = (360 - lo) + hi
    dist = h >= lo ? h - lo : (360 - lo) + h
  } else {
    span = hi - lo
    dist = h - lo
  }
  if (dist < 0 || dist > span) return 0
  const mid = span / 2
  return 1 - Math.abs(dist - mid) / mid
}

// ─── Temperature ─────────────────────────────────────────────────────────────

export function applyTemperature(data: Uint8ClampedArray, value: number): void {
  // value: -100 (cool) to +100 (warm)
  const t = value / 100
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.min(255, Math.max(0, data[i]     + t * 30))  // R +warm
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] - t * 30))  // B -warm
  }
}

// ─── Tint ─────────────────────────────────────────────────────────────────────

export function applyTint(data: Uint8ClampedArray, value: number): void {
  // value: -100 (green) to +100 (magenta)
  const t = value / 100
  for (let i = 0; i < data.length; i += 4) {
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] - t * 20))  // G adjusted
    data[i]     = Math.min(255, Math.max(0, data[i]     + t * 10))  // R slight
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + t * 10))  // B slight
  }
}

// ─── HSL per channel ──────────────────────────────────────────────────────────

export function applyHsl(
  data: Uint8ClampedArray,
  channel: HslChannel,
  hueShift: number,
  satShift: number,
  lightShift: number
): void {
  const range = CHANNEL_RANGES[channel]
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const [h, s, l] = rgbToHsl(r, g, b)
    if (!hueInRange(h, range)) continue
    const w = channelWeight(h, range)
    if (w === 0) continue
    const newH = (h + hueShift * w + 360) % 360
    const newS = Math.min(1, Math.max(0, s + (satShift / 100) * w))
    const newL = Math.min(1, Math.max(0, l + (lightShift / 100) * w))
    const [nr, ng, nb] = hslToRgb(newH, newS, newL)
    data[i]     = nr
    data[i + 1] = ng
    data[i + 2] = nb
  }
}

// ─── Curves (LUT) ─────────────────────────────────────────────────────────────

export function buildCurveLUT(points: CurvePoint[]): Uint8Array {
  const lut = new Uint8Array(256)
  // Sort and ensure endpoints
  const sorted = [...points].sort((a, b) => a.x - b.x)
  if (sorted.length === 0 || sorted[0].x !== 0) sorted.unshift({ x: 0, y: 0 })
  if (sorted[sorted.length - 1].x !== 255) sorted.push({ x: 255, y: 255 })

  for (let x = 0; x < 256; x++) {
    // find segment
    let i = 1
    while (i < sorted.length - 1 && sorted[i].x < x) i++
    const p0 = sorted[i - 1], p1 = sorted[i]
    const t = p1.x === p0.x ? 0 : (x - p0.x) / (p1.x - p0.x)
    lut[x] = Math.min(255, Math.max(0, Math.round(p0.y + t * (p1.y - p0.y))))
  }
  return lut
}

export function applyCurveLUT(
  data: Uint8ClampedArray,
  channel: 'master' | 'r' | 'g' | 'b',
  lut: Uint8Array
): void {
  for (let i = 0; i < data.length; i += 4) {
    if (channel === 'master' || channel === 'r') data[i]     = lut[data[i]]
    if (channel === 'master' || channel === 'g') data[i + 1] = lut[data[i + 1]]
    if (channel === 'master' || channel === 'b') data[i + 2] = lut[data[i + 2]]
  }
}

// ─── Film Grain ───────────────────────────────────────────────────────────────

export function applyGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
): void {
  if (amount === 0) return
  const opacity = (amount / 100) * 0.35
  const offscreen = document.createElement('canvas')
  offscreen.width = width
  offscreen.height = height
  const offCtx = offscreen.getContext('2d')!
  const imgData = offCtx.createImageData(width, height)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 2 - 1) * 128 + 128
    d[i] = d[i + 1] = d[i + 2] = v
    d[i + 3] = 255
  }
  offCtx.putImageData(imgData, 0, 0)
  ctx.save()
  ctx.globalCompositeOperation = 'overlay'
  ctx.globalAlpha = opacity
  ctx.drawImage(offscreen, 0, 0)
  ctx.restore()
}

// ─── Vignette ─────────────────────────────────────────────────────────────────

export function applyVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
  feather: number
): void {
  if (amount === 0) return
  const cx = width / 2, cy = height / 2
  const innerR = Math.max(cx, cy) * (1 - feather / 100)
  const outerR = Math.max(cx, cy) * 1.42  // diagonal
  const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR)
  const alpha = (amount / 100) * 0.85
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, `rgba(0,0,0,${alpha.toFixed(3)})`)
  ctx.save()
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)
  ctx.restore()
}

// ─── Radial Mask exposure ─────────────────────────────────────────────────────

export function applyRadialMask(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  cx: number, cy: number,
  rx: number, ry: number,
  feather: number,
  exposure: number
): void {
  const exp = exposure / 100
  const featherFrac = Math.max(0.01, feather / 100)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = (x - cx * width) / (rx * width)
      const dy = (y - cy * height) / (ry * height)
      const dist = Math.sqrt(dx * dx + dy * dy)
      const inner = 1 - featherFrac
      let w = 0
      if (dist <= inner) w = 1
      else if (dist <= 1) w = 1 - (dist - inner) / featherFrac
      if (w === 0) continue
      const idx = (y * width + x) * 4
      const boost = exp * w * 80
      data[idx]     = Math.min(255, Math.max(0, data[idx]     + boost))
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + boost))
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + boost))
    }
  }
}

// ─── Highlight & Shadow Recovery ─────────────────────────────────────────────

export function applyHighlightShadow(
  data: Uint8ClampedArray,
  highlights: number,
  shadows: number
): void {
  if (highlights === 0 && shadows === 0) return
  const hFactor = highlights / 100
  const sFactor = shadows / 100
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const luma = 0.299 * r + 0.587 * g + 0.114 * b

    // Smoothstep weights
    let hWeight = 0
    if (luma > 180) {
      const t = (luma - 180) / 75   // 0..1 across 180-255
      hWeight = t * t * (3 - 2 * t) // smoothstep
    }
    let sWeight = 0
    if (luma < 100) {
      const t = 1 - luma / 100
      sWeight = t * t * (3 - 2 * t)
    }

    const hBoost = hFactor * hWeight * 60
    const sBoost = sFactor * sWeight * 60

    data[i]     = Math.min(255, Math.max(0, r + hBoost + sBoost))
    data[i + 1] = Math.min(255, Math.max(0, g + hBoost + sBoost))
    data[i + 2] = Math.min(255, Math.max(0, b + hBoost + sBoost))
  }
}

// ─── Vibrance ─────────────────────────────────────────────────────────────────

export function applyVibrance(data: Uint8ClampedArray, amount: number): void {
  if (amount === 0) return
  const factor = amount / 100
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const s = max === 0 ? 0 : (max - min) / max

    // Skin tone protection: hue roughly 20–50°
    const [h] = rgbToHsl(data[i], data[i + 1], data[i + 2])
    const isSkin = h >= 20 && h <= 50
    const skinScale = isSkin ? 0.4 : 1.0

    // Lower saturation → stronger boost
    const scale = (1 - s) * factor * skinScale
    const newS = Math.min(1, Math.max(0, s + scale))

    if (Math.abs(newS - s) < 0.001) continue
    const ratio = s === 0 ? 1 : newS / s
    const mid = (r + g + b) / 3
    data[i]     = Math.min(255, Math.max(0, Math.round((mid + (r - mid) * ratio) * 255)))
    data[i + 1] = Math.min(255, Math.max(0, Math.round((mid + (g - mid) * ratio) * 255)))
    data[i + 2] = Math.min(255, Math.max(0, Math.round((mid + (b - mid) * ratio) * 255)))
  }
}

// ─── Clarity (Unsharp Mask on luminance midtones) ─────────────────────────────

function gaussianBlurBox(src: Uint8ClampedArray, width: number, height: number, radius: number): Uint8ClampedArray {
  // Fast box-blur approximation (3 passes simulate Gaussian)
  const out = new Uint8ClampedArray(src.length)
  const tmp = new Uint8ClampedArray(src.length)
  const r = Math.max(1, Math.round(radius))

  // Horizontal pass into tmp
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0, gSum = 0, bSum = 0, count = 0
      for (let dx = -r; dx <= r; dx++) {
        const nx = Math.min(width - 1, Math.max(0, x + dx))
        const idx = (y * width + nx) * 4
        rSum += src[idx]; gSum += src[idx + 1]; bSum += src[idx + 2]
        count++
      }
      const i = (y * width + x) * 4
      tmp[i] = rSum / count; tmp[i + 1] = gSum / count; tmp[i + 2] = bSum / count; tmp[i + 3] = src[i + 3]
    }
  }
  // Vertical pass into out
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0, gSum = 0, bSum = 0, count = 0
      for (let dy = -r; dy <= r; dy++) {
        const ny = Math.min(height - 1, Math.max(0, y + dy))
        const idx = (ny * width + x) * 4
        rSum += tmp[idx]; gSum += tmp[idx + 1]; bSum += tmp[idx + 2]
        count++
      }
      const i = (y * width + x) * 4
      out[i] = rSum / count; out[i + 1] = gSum / count; out[i + 2] = bSum / count; out[i + 3] = src[i + 3]
    }
  }
  return out
}

export function applyClarity(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  amount: number
): void {
  if (amount === 0) return
  const factor = amount / 100
  const blurred = gaussianBlurBox(data, width, height, 3)
  for (let i = 0; i < data.length; i += 4) {
    const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    // Midtone weight: peaks at luma 128, fades at extremes
    const t = luma / 255
    const midWeight = 1 - Math.abs(2 * t - 1) // 0 at blacks/whites, 1 at midtones
    for (let c = 0; c < 3; c++) {
      const detail = data[i + c] - blurred[i + c]
      data[i + c] = Math.min(255, Math.max(0, Math.round(data[i + c] + factor * midWeight * detail)))
    }
  }
}

// ─── Sharpen (Unsharp Mask on all tones) ─────────────────────────────────────

export function applySharpen(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  amount: number,
  radius: number
): void {
  if (amount === 0) return
  const strength = amount / 100
  const blurred = gaussianBlurBox(data, width, height, Math.max(1, radius))
  const threshold = 8  // only apply where difference exceeds threshold
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const detail = data[i + c] - blurred[i + c]
      if (Math.abs(detail) < threshold) continue
      data[i + c] = Math.min(255, Math.max(0, Math.round(data[i + c] + strength * detail)))
    }
  }
}

// ─── Split Toning ─────────────────────────────────────────────────────────────

export function applySplitToning(
  data: Uint8ClampedArray,
  highlightHue: number,
  highlightSat: number,
  shadowHue: number,
  shadowSat: number,
  balance: number
): void {
  if (highlightSat === 0 && shadowSat === 0) return
  const hSat = highlightSat / 100
  const sSat = shadowSat / 100
  // balance shifts the midpoint (0 = equal, +100 = more highlight zone)
  const midpoint = 128 + balance * 0.5

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const luma = 0.299 * r + 0.587 * g + 0.114 * b

    // Highlight weight (smoothstep above midpoint)
    const ht = Math.min(1, Math.max(0, (luma - midpoint) / (255 - midpoint)))
    const hWeight = ht * ht * (3 - 2 * ht)

    // Shadow weight (smoothstep below midpoint)
    const st = Math.min(1, Math.max(0, (midpoint - luma) / midpoint))
    const sWeight = st * st * (3 - 2 * st)

    let nr = r, ng = g, nb = b

    // Apply highlight toning
    if (hWeight > 0 && hSat > 0) {
      const [hr] = hslToRgb(highlightHue, hSat, 0.5)
      const [hg] = [hslToRgb(highlightHue, hSat, 0.5)[1]]
      const [hb] = [hslToRgb(highlightHue, hSat, 0.5)[2]]
      const w = hWeight * hSat * 0.5
      nr = nr + (hr - nr) * w
      ng = ng + (hg - ng) * w
      nb = nb + (hb - nb) * w
    }

    // Apply shadow toning
    if (sWeight > 0 && sSat > 0) {
      const [sr, sg, sb] = hslToRgb(shadowHue, sSat, 0.5)
      const w = sWeight * sSat * 0.5
      nr = nr + (sr - nr) * w
      ng = ng + (sg - ng) * w
      nb = nb + (sb - nb) * w
    }

    data[i]     = Math.min(255, Math.max(0, Math.round(nr)))
    data[i + 1] = Math.min(255, Math.max(0, Math.round(ng)))
    data[i + 2] = Math.min(255, Math.max(0, Math.round(nb)))
  }
}

// ─── Gradient Mask exposure ───────────────────────────────────────────────────

export function applyGradientMask(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x1: number, y1: number,
  x2: number, y2: number,
  feather: number,
  exposure: number
): void {
  const exp = exposure / 100
  const featherFrac = Math.max(0.01, feather / 100)
  const ax = (x2 - x1) * width, ay = (y2 - y1) * height
  const len2 = ax * ax + ay * ay
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const bx = px - x1 * width, by = py - y1 * height
      const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, (bx * ax + by * ay) / len2))
      const halfFeather = featherFrac / 2
      let w = 0
      if (t <= 0.5 - halfFeather) w = 1
      else if (t <= 0.5 + halfFeather) w = 1 - (t - (0.5 - halfFeather)) / featherFrac
      if (w === 0) continue
      const idx = (py * width + px) * 4
      const boost = exp * w * 80
      data[idx]     = Math.min(255, Math.max(0, data[idx]     + boost))
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + boost))
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + boost))
    }
  }
}
