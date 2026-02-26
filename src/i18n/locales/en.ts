const en = {
  // Header
  appName: 'Image Style Editor',
  uploadImage: 'Upload Image',
  changeImage: 'Change Image',
  fileHint: 'JPG, PNG, WebP · max 10MB',
  tagline: 'Non-destructive · Browser-only',
  errorInvalidType: 'Invalid file type. Please upload JPG, PNG, or WebP.',
  errorTooLarge: 'File too large. Maximum size is 10MB.',
  errorLoadFailed: 'Failed to load image. The file may be corrupted.',

  // LeftPanel
  stylePresets: 'Style Presets',
  styles: 'styles',
  activeIntensity: 'Active Intensity',
  intensityHint: 'Drag the slider on the selected preset card',

  // Category names
  catCinematic: 'Cinematic',
  catVintage: 'Vintage',
  catPortrait: 'Portrait',
  catLandscape: 'Landscape',
  catDarkMood: 'Dark Mood',
  catUrban: 'Urban',
  catDreamy: 'Dreamy',

  // RightPanel sections
  histogram: 'Histogram',
  transform: 'Transform',
  highlightsShadows: 'Highlights & Shadows',
  vibrance: 'Vibrance',
  color: 'Color',
  curves: 'Curves',
  claritySharpness: 'Clarity & Sharpness',
  splitToning: 'Split Toning',
  grainVignette: 'Grain & Vignette',
  masks: 'Masks',
  history: 'History',
  compare: 'Compare',
  zoom: 'Zoom',
  session: 'Session',
  exportImage: 'Export Image',

  // Transform
  cwRotate: 'CW 90°',
  ccwRotate: 'CCW 90°',
  flipH: 'Flip H',
  flipV: 'Flip V',
  crop: 'Crop',
  cropping: 'Cropping…',

  // History
  undo: 'Undo',
  redo: 'Redo',
  undoHint: 'Ctrl+Z / Ctrl+Shift+Z',
  operations: 'Operations',
  resetAll: 'Reset All',
  applyFlatten: 'Apply & Flatten',
  flattening: 'Flattening…',
  flattenHint: 'Merges edits into base image. Clears history.',

  // Compare
  hideCompare: 'Hide Compare',
  compareBtn: 'Compare',
  holdPreview: 'Hold to Preview',

  // Zoom
  resetZoom: 'Reset zoom',

  // Session
  exportSession: 'Export Session',
  importSession: 'Import Session',
  sessionHint: 'Save / restore your editing workflow as JSON.',
  sessionImportError: 'Please load an image first before importing a session.',

  // Export
  quality: 'Quality',
  download: 'Download',

  // Color Controls
  whiteBalance: 'White Balance',
  temperature: '🌡 Temperature',
  tint: '🎨 Tint',
  hsl: 'HSL',
  selectChannel: 'Select a color channel above',
  hue: 'Hue',
  saturation: 'Saturation',
  lightness: 'Lightness',

  // Highlights & Shadows
  highlights: 'Highlights',
  shadows: 'Shadows',
  reset: 'Reset',

  // Vibrance
  vibranceLabel: 'Vibrance',
  vibranceHint: 'Boosts low-saturated areas first. Preserves skin tones.',

  // Clarity & Sharpness
  clarity: 'Clarity',
  sharpen: 'Sharpen',
  sharpenRadius: 'Sharpen Radius',

  // Split Toning
  stHighlights: 'Highlights',
  stShadows: 'Shadows',
  balance: 'Balance',

  // Grain & Vignette
  grain: 'Grain',
  vignetteAmount: 'Vignette',
  vignetteFeather: 'Feather',

  // Mask Tool
  radialMask: 'Radial Mask',
  gradientMask: 'Gradient Mask',
  centerX: 'Center X',
  centerY: 'Center Y',
  radiusX: 'Radius X',
  radiusY: 'Radius Y',
  feather: 'Feather',
  exposure: 'Exposure',
  startX: 'Start X',
  startY: 'Start Y',
  endX: 'End X',
  endY: 'End Y',
  addMask: 'Add Mask',

  // Curves
  master: 'Master',
  curveHint: 'Click to add points · Drag off edge to remove',

  // Language toggle
  language: 'Language',
} as const

export type TranslationKeys = keyof typeof en
export default en
