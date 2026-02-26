import { Preset } from '../types/editor'

export const PRESETS: Preset[] = [
  // ── Cinematic ──────────────────────────────────────────────
  {
    id: 'cinematic-cold',
    name: 'Cold Cinema',
    category: 'Cinematic',
    config: { brightness: 95, contrast: 115, sepia: 5, saturation: 85, hueRotate: 200 },
  },
  {
    id: 'cinematic-warm',
    name: 'Warm Cinema',
    category: 'Cinematic',
    config: { brightness: 100, contrast: 120, sepia: 15, saturation: 90, hueRotate: 10 },
  },
  {
    id: 'cinematic-teal-orange',
    name: 'Teal & Orange',
    category: 'Cinematic',
    config: { brightness: 98, contrast: 118, sepia: 8, saturation: 110, hueRotate: 170 },
  },
  {
    id: 'cinematic-blockbuster',
    name: 'Blockbuster',
    category: 'Cinematic',
    config: { brightness: 102, contrast: 125, sepia: 6, saturation: 95, hueRotate: 185 },
  },
  {
    id: 'cinematic-nordic',
    name: 'Nordic Frost',
    category: 'Cinematic',
    config: { brightness: 105, contrast: 108, sepia: 2, saturation: 65, hueRotate: 195 },
  },

  // ── Vintage ────────────────────────────────────────────────
  {
    id: 'vintage-classic',
    name: 'Classic Vintage',
    category: 'Vintage',
    config: { brightness: 110, contrast: 90, sepia: 40, saturation: 80 },
  },
  {
    id: 'vintage-faded',
    name: 'Faded Film',
    category: 'Vintage',
    config: { brightness: 115, contrast: 85, sepia: 30, saturation: 70 },
  },
  {
    id: 'vintage-retro',
    name: 'Retro 70s',
    category: 'Vintage',
    config: { brightness: 108, contrast: 88, sepia: 50, saturation: 75, hueRotate: 15 },
  },
  {
    id: 'vintage-kodachrome',
    name: 'Kodachrome',
    category: 'Vintage',
    config: { brightness: 112, contrast: 95, sepia: 20, saturation: 110, hueRotate: 5 },
  },
  {
    id: 'vintage-polaroid',
    name: 'Polaroid',
    category: 'Vintage',
    config: { brightness: 118, contrast: 82, sepia: 15, saturation: 85, hueRotate: 358 },
  },

  // ── Portrait ───────────────────────────────────────────────
  {
    id: 'portrait-soft',
    name: 'Soft Portrait',
    category: 'Portrait',
    config: { brightness: 108, contrast: 95, sepia: 5, saturation: 90 },
  },
  {
    id: 'portrait-golden',
    name: 'Golden Hour',
    category: 'Portrait',
    config: { brightness: 112, contrast: 100, sepia: 20, saturation: 105, hueRotate: 8 },
  },
  {
    id: 'portrait-bw',
    name: 'B&W Classic',
    category: 'Portrait',
    config: { brightness: 105, contrast: 110, sepia: 0, saturation: 0 },
  },
  {
    id: 'portrait-skin',
    name: 'Skin Glow',
    category: 'Portrait',
    config: { brightness: 114, contrast: 92, sepia: 12, saturation: 95, hueRotate: 5 },
  },
  {
    id: 'portrait-highkey',
    name: 'High Key',
    category: 'Portrait',
    config: { brightness: 125, contrast: 85, sepia: 3, saturation: 80 },
  },

  // ── Landscape ─────────────────────────────────────────────
  {
    id: 'landscape-vivid',
    name: 'Vivid Nature',
    category: 'Landscape',
    config: { brightness: 102, contrast: 112, sepia: 0, saturation: 140 },
  },
  {
    id: 'landscape-matte',
    name: 'Matte Green',
    category: 'Landscape',
    config: { brightness: 105, contrast: 95, sepia: 5, saturation: 120, hueRotate: 340 },
  },
  {
    id: 'landscape-golden',
    name: 'Desert Gold',
    category: 'Landscape',
    config: { brightness: 108, contrast: 108, sepia: 25, saturation: 115, hueRotate: 20 },
  },
  {
    id: 'landscape-ocean',
    name: 'Ocean Breeze',
    category: 'Landscape',
    config: { brightness: 103, contrast: 110, sepia: 0, saturation: 130, hueRotate: 185 },
  },
  {
    id: 'landscape-autumn',
    name: 'Autumn Warm',
    category: 'Landscape',
    config: { brightness: 106, contrast: 105, sepia: 18, saturation: 118, hueRotate: 18 },
  },

  // ── Dark Mood ─────────────────────────────────────────────
  {
    id: 'dark-noir',
    name: 'Noir',
    category: 'Dark Mood',
    config: { brightness: 80, contrast: 130, sepia: 0, saturation: 20 },
  },
  {
    id: 'dark-moody',
    name: 'Moody Blue',
    category: 'Dark Mood',
    config: { brightness: 85, contrast: 125, sepia: 0, saturation: 60, hueRotate: 210 },
  },
  {
    id: 'dark-horror',
    name: 'Horror Red',
    category: 'Dark Mood',
    config: { brightness: 80, contrast: 130, sepia: 10, saturation: 80, hueRotate: 340 },
  },
  {
    id: 'dark-shadow',
    name: 'Deep Shadow',
    category: 'Dark Mood',
    config: { brightness: 72, contrast: 140, sepia: 5, saturation: 40 },
  },
  {
    id: 'dark-emerald',
    name: 'Dark Emerald',
    category: 'Dark Mood',
    config: { brightness: 82, contrast: 122, sepia: 0, saturation: 70, hueRotate: 150 },
  },

  // ── Urban ─────────────────────────────────────────────────
  {
    id: 'urban-street',
    name: 'Street',
    category: 'Urban',
    config: { brightness: 98, contrast: 120, sepia: 5, saturation: 75 },
  },
  {
    id: 'urban-chrome',
    name: 'Chrome',
    category: 'Urban',
    config: { brightness: 100, contrast: 128, sepia: 0, saturation: 55, hueRotate: 190 },
  },
  {
    id: 'urban-neon',
    name: 'Neon City',
    category: 'Urban',
    config: { brightness: 95, contrast: 130, sepia: 0, saturation: 160, hueRotate: 280 },
  },
  {
    id: 'urban-concrete',
    name: 'Concrete',
    category: 'Urban',
    config: { brightness: 96, contrast: 115, sepia: 8, saturation: 50 },
  },
  {
    id: 'urban-cyberpunk',
    name: 'Cyberpunk',
    category: 'Urban',
    config: { brightness: 90, contrast: 135, sepia: 0, saturation: 180, hueRotate: 260 },
  },

  // ── Dreamy ────────────────────────────────────────────────
  {
    id: 'dreamy-pastel',
    name: 'Pastel',
    category: 'Dreamy',
    config: { brightness: 118, contrast: 85, sepia: 8, saturation: 75 },
  },
  {
    id: 'dreamy-mist',
    name: 'Morning Mist',
    category: 'Dreamy',
    config: { brightness: 120, contrast: 80, sepia: 5, saturation: 70, hueRotate: 190 },
  },
  {
    id: 'dreamy-fairy',
    name: 'Fairy Tale',
    category: 'Dreamy',
    config: { brightness: 115, contrast: 88, sepia: 10, saturation: 88, hueRotate: 310 },
  },
  {
    id: 'dreamy-lavender',
    name: 'Lavender',
    category: 'Dreamy',
    config: { brightness: 112, contrast: 90, sepia: 5, saturation: 80, hueRotate: 270 },
  },
  {
    id: 'dreamy-cotton',
    name: 'Cotton Candy',
    category: 'Dreamy',
    config: { brightness: 116, contrast: 86, sepia: 6, saturation: 90, hueRotate: 320 },
  },
]

export const PRESET_CATEGORIES = [
  'Cinematic',
  'Vintage',
  'Portrait',
  'Landscape',
  'Dark Mood',
  'Urban',
  'Dreamy',
] as const
