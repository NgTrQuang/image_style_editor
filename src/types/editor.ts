export type FlipDirection = 'horizontal' | 'vertical'

export type HslChannel = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple'

export interface CurvePoint { x: number; y: number }

export interface RadialMaskConfig {
  cx: number; cy: number; rx: number; ry: number; feather: number; exposure: number
}

export interface GradientMaskConfig {
  x1: number; y1: number; x2: number; y2: number; feather: number; exposure: number
}

export type Operation =
  | { type: 'preset'; presetId: string; intensity: number }
  | { type: 'brightness'; value: number }
  | { type: 'contrast'; value: number }
  | { type: 'crop'; x: number; y: number; width: number; height: number }
  | { type: 'rotate'; angle: number }
  | { type: 'flip'; direction: FlipDirection }
  | { type: 'temperature'; value: number }
  | { type: 'tint'; value: number }
  | { type: 'hsl'; channel: HslChannel; hue: number; sat: number; light: number }
  | { type: 'grain'; amount: number }
  | { type: 'vignette'; amount: number; feather: number }
  | { type: 'curve'; channel: 'master' | 'r' | 'g' | 'b'; points: CurvePoint[] }
  | { type: 'radialMask'; config: RadialMaskConfig }
  | { type: 'gradientMask'; config: GradientMaskConfig }
  | { type: 'clarity'; amount: number }
  | { type: 'vibrance'; amount: number }
  | { type: 'highlightShadow'; highlights: number; shadows: number }
  | { type: 'sharpen'; amount: number; radius: number }
  | { type: 'splitToning'; highlightHue: number; highlightSat: number; shadowHue: number; shadowSat: number; balance: number }

export interface EditorState {
  originalImage: HTMLImageElement | null
  operations: Operation[]
  historyIndex: number
  isFlattening: boolean
  canvasSize: {
    width: number
    height: number
  }
}

export interface PresetConfig {
  brightness: number
  contrast: number
  sepia: number
  saturation: number
  hueRotate?: number
  blur?: number
}

export interface Preset {
  id: string
  name: string
  category: PresetCategory
  config: PresetConfig
  thumbnail?: string
}

export type PresetCategory =
  | 'Cinematic'
  | 'Vintage'
  | 'Portrait'
  | 'Landscape'
  | 'Dark Mood'
  | 'Urban'
  | 'Dreamy'

export interface ExportOptions {
  format: 'png' | 'jpeg'
  quality: number
}

export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}
