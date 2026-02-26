import { Operation, PresetConfig } from '../types/editor'
import { PRESETS } from '../data/presets'
import {
  applyTemperature,
  applyTint,
  applyHsl,
  buildCurveLUT,
  applyCurveLUT,
  applyGrain,
  applyVignette,
  applyRadialMask,
  applyGradientMask,
  applyHighlightShadow,
  applyVibrance,
  applyClarity,
  applySharpen,
  applySplitToning,
} from './pixelOps'

const MAX_WIDTH = 2000

export function resizeImageIfNeeded(img: HTMLImageElement): HTMLImageElement {
  if (img.naturalWidth <= MAX_WIDTH) return img
  const canvas = document.createElement('canvas')
  const ratio = MAX_WIDTH / img.naturalWidth
  canvas.width = MAX_WIDTH
  canvas.height = Math.round(img.naturalHeight * ratio)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const resized = new Image()
  resized.src = canvas.toDataURL('image/png')
  return resized
}

function interpolateConfig(config: PresetConfig, intensity: number): PresetConfig {
  const t = intensity / 100
  return {
    brightness: 100 + (config.brightness - 100) * t,
    contrast: 100 + (config.contrast - 100) * t,
    sepia: config.sepia * t,
    saturation: 100 + (config.saturation - 100) * t,
    hueRotate: (config.hueRotate ?? 0) * t,
    blur: (config.blur ?? 0) * t,
  }
}

function buildFilterString(config: PresetConfig): string {
  const parts: string[] = [
    `brightness(${config.brightness}%)`,
    `contrast(${config.contrast}%)`,
    `sepia(${config.sepia}%)`,
    `saturate(${config.saturation}%)`,
  ]
  if (config.hueRotate) parts.push(`hue-rotate(${config.hueRotate}deg)`)
  if (config.blur) parts.push(`blur(${config.blur}px)`)
  return parts.join(' ')
}

// Collected state from replaying all operations up to historyIndex
interface RenderState {
  totalRotation: number
  flipH: boolean
  flipV: boolean
  cropRect: { x: number; y: number; width: number; height: number } | null
  filterString: string
  // pixel operations (applied in order after CSS filter)
  temperature: number
  tint: number
  hslOps: Array<{ channel: string; hue: number; sat: number; light: number }>
  curveOps: Array<{ channel: 'master' | 'r' | 'g' | 'b'; points: Array<{ x: number; y: number }> }>
  grain: number
  vignetteAmount: number
  vignetteFeather: number
  radialMasks: Array<{ cx: number; cy: number; rx: number; ry: number; feather: number; exposure: number }>
  gradientMasks: Array<{ x1: number; y1: number; x2: number; y2: number; feather: number; exposure: number }>
  clarity: number
  vibrance: number
  highlights: number
  shadows: number
  sharpenAmount: number
  sharpenRadius: number
  splitToning: { highlightHue: number; highlightSat: number; shadowHue: number; shadowSat: number; balance: number } | null
}

function computeRenderState(operations: Operation[]): RenderState {
  const state: RenderState = {
    totalRotation: 0,
    flipH: false,
    flipV: false,
    cropRect: null,
    filterString: '',
    temperature: 0,
    tint: 0,
    hslOps: [],
    curveOps: [],
    grain: 0,
    vignetteAmount: 0,
    vignetteFeather: 50,
    radialMasks: [],
    gradientMasks: [],
    clarity: 0,
    vibrance: 0,
    highlights: 0,
    shadows: 0,
    sharpenAmount: 0,
    sharpenRadius: 2,
    splitToning: null,
  }

  let presetConfig: PresetConfig | null = null
  let presetIntensity = 100
  let brightnessAdj = 100
  let contrastAdj = 100

  for (const op of operations) {
    if (op.type === 'rotate') {
      state.totalRotation = (state.totalRotation + op.angle) % 360
    } else if (op.type === 'flip') {
      if (op.direction === 'horizontal') state.flipH = !state.flipH
      else state.flipV = !state.flipV
    } else if (op.type === 'crop') {
      state.cropRect = { x: op.x, y: op.y, width: op.width, height: op.height }
    } else if (op.type === 'preset') {
      const preset = PRESETS.find(p => p.id === op.presetId)
      if (preset) { presetConfig = preset.config; presetIntensity = op.intensity }
    } else if (op.type === 'brightness') {
      brightnessAdj = op.value
    } else if (op.type === 'contrast') {
      contrastAdj = op.value
    } else if (op.type === 'temperature') {
      state.temperature = op.value
    } else if (op.type === 'tint') {
      state.tint = op.value
    } else if (op.type === 'hsl') {
      // replace existing entry for same channel
      const idx = state.hslOps.findIndex(h => h.channel === op.channel)
      const entry = { channel: op.channel, hue: op.hue, sat: op.sat, light: op.light }
      if (idx >= 0) state.hslOps[idx] = entry
      else state.hslOps.push(entry)
    } else if (op.type === 'grain') {
      state.grain = op.amount
    } else if (op.type === 'vignette') {
      state.vignetteAmount = op.amount
      state.vignetteFeather = op.feather
    } else if (op.type === 'curve') {
      const idx = state.curveOps.findIndex(c => c.channel === op.channel)
      const entry = { channel: op.channel, points: op.points }
      if (idx >= 0) state.curveOps[idx] = entry
      else state.curveOps.push(entry)
    } else if (op.type === 'radialMask') {
      state.radialMasks.push(op.config)
    } else if (op.type === 'gradientMask') {
      state.gradientMasks.push(op.config)
    } else if (op.type === 'clarity') {
      state.clarity = op.amount
    } else if (op.type === 'vibrance') {
      state.vibrance = op.amount
    } else if (op.type === 'highlightShadow') {
      state.highlights = op.highlights
      state.shadows = op.shadows
    } else if (op.type === 'sharpen') {
      state.sharpenAmount = op.amount
      state.sharpenRadius = op.radius
    } else if (op.type === 'splitToning') {
      state.splitToning = {
        highlightHue: op.highlightHue, highlightSat: op.highlightSat,
        shadowHue: op.shadowHue, shadowSat: op.shadowSat,
        balance: op.balance,
      }
    }
  }

  // Build CSS filter string (preset + brightness/contrast)
  if (presetConfig) {
    const interpolated = interpolateConfig(presetConfig, presetIntensity)
    const combinedBrightness = (interpolated.brightness * brightnessAdj) / 100
    const combinedContrast = (interpolated.contrast * contrastAdj) / 100
    state.filterString = buildFilterString({ ...interpolated, brightness: combinedBrightness, contrast: combinedContrast })
  } else {
    state.filterString = `brightness(${brightnessAdj}%) contrast(${contrastAdj}%)`
  }

  return state
}

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  operations: Operation[],
  historyIndex: number
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  const activeOps = operations.slice(0, historyIndex + 1)
  const rs = computeRenderState(activeOps)

  const srcX = rs.cropRect ? rs.cropRect.x : 0
  const srcY = rs.cropRect ? rs.cropRect.y : 0
  const srcW = rs.cropRect ? rs.cropRect.width : (image.naturalWidth || image.width)
  const srcH = rs.cropRect ? rs.cropRect.height : (image.naturalHeight || image.height)

  const isRotated90 = Math.abs(rs.totalRotation % 180) === 90
  const destW = isRotated90 ? srcH : srcW
  const destH = isRotated90 ? srcW : srcH

  canvas.width = destW
  canvas.height = destH
  ctx.clearRect(0, 0, destW, destH)

  // ── Phase 1: Draw image with CSS filter (preset, brightness, contrast) ──
  ctx.save()
  ctx.filter = rs.filterString
  ctx.translate(destW / 2, destH / 2)
  ctx.scale(rs.flipH ? -1 : 1, rs.flipV ? -1 : 1)
  ctx.rotate((rs.totalRotation * Math.PI) / 180)
  ctx.drawImage(image, srcX, srcY, srcW, srcH, -srcW / 2, -srcH / 2, srcW, srcH)
  ctx.restore()

  // ── Phase 2: Pixel-level operations via ImageData ──
  const needsPixelOps =
    rs.temperature !== 0 ||
    rs.tint !== 0 ||
    rs.hslOps.length > 0 ||
    rs.curveOps.length > 0 ||
    rs.radialMasks.length > 0 ||
    rs.gradientMasks.length > 0 ||
    rs.highlights !== 0 ||
    rs.shadows !== 0 ||
    rs.vibrance !== 0 ||
    rs.clarity !== 0 ||
    rs.sharpenAmount !== 0 ||
    rs.splitToning !== null

  if (needsPixelOps) {
    const imgData = ctx.getImageData(0, 0, destW, destH)
    const d = imgData.data

    if (rs.temperature !== 0) applyTemperature(d, rs.temperature)
    if (rs.tint !== 0) applyTint(d, rs.tint)

    for (const h of rs.hslOps) {
      if (h.hue !== 0 || h.sat !== 0 || h.light !== 0) {
        applyHsl(d, h.channel as import('../types/editor').HslChannel, h.hue, h.sat, h.light)
      }
    }

    // highlight/shadow before curves (per spec)
    if (rs.highlights !== 0 || rs.shadows !== 0)
      applyHighlightShadow(d, rs.highlights, rs.shadows)

    for (const c of rs.curveOps) {
      if (c.points.length >= 2) {
        const lut = buildCurveLUT(c.points)
        applyCurveLUT(d, c.channel, lut)
      }
    }

    // vibrance after exposure/contrast, before clarity
    if (rs.vibrance !== 0) applyVibrance(d, rs.vibrance)

    // split toning after vibrance
    if (rs.splitToning) {
      const st = rs.splitToning
      applySplitToning(d, st.highlightHue, st.highlightSat, st.shadowHue, st.shadowSat, st.balance)
    }

    // clarity after color corrections
    if (rs.clarity !== 0) applyClarity(d, destW, destH, rs.clarity)

    // sharpen before grain (per spec)
    if (rs.sharpenAmount !== 0) applySharpen(d, destW, destH, rs.sharpenAmount, rs.sharpenRadius)

    for (const m of rs.radialMasks) {
      applyRadialMask(d, destW, destH, m.cx, m.cy, m.rx, m.ry, m.feather, m.exposure)
    }
    for (const m of rs.gradientMasks) {
      applyGradientMask(d, destW, destH, m.x1, m.y1, m.x2, m.y2, m.feather, m.exposure)
    }

    ctx.putImageData(imgData, 0, 0)
  }

  // ── Phase 3: Composite effects (grain, vignette) ──
  if (rs.grain > 0) applyGrain(ctx, destW, destH, rs.grain)
  if (rs.vignetteAmount > 0) applyVignette(ctx, destW, destH, rs.vignetteAmount, rs.vignetteFeather)
}

export function renderOriginalToCanvas(canvas: HTMLCanvasElement, image: HTMLImageElement): void {
  const ctx = canvas.getContext('2d')!
  const w = image.naturalWidth || image.width
  const h = image.naturalHeight || image.height
  canvas.width = w
  canvas.height = h
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(image, 0, 0, w, h)
}

/**
 * Read histogram data from a canvas.
 * Returns { r, g, b, luma } — each a Float32Array of 256 normalized frequencies.
 */
export function computeHistogram(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  const { width, height } = canvas
  if (width === 0 || height === 0) return null
  const d = ctx.getImageData(0, 0, width, height).data
  const r = new Float32Array(256)
  const g = new Float32Array(256)
  const b = new Float32Array(256)
  const luma = new Float32Array(256)
  const total = width * height
  for (let i = 0; i < d.length; i += 4) {
    r[d[i]]++; g[d[i + 1]]++; b[d[i + 2]]++
    luma[Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])]++
  }
  for (let i = 0; i < 256; i++) {
    r[i] /= total; g[i] /= total; b[i] /= total; luma[i] /= total
  }
  return { r, g, b, luma }
}
