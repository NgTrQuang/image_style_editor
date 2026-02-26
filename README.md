# 🎨 Image Style Editor

> **Professional-grade photo editing — entirely in your browser.** No uploads. No servers. No accounts. Just pure creative freedom.

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=flat-square&logo=tailwindcss)
![Canvas API](https://img.shields.io/badge/HTML5-Canvas_API-E34F26?style=flat-square&logo=html5)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blueviolet?style=flat-square)

</div>

---

## ✨ What is this?

**Image Style Editor** is a professional-grade, fully **client-side** photo editing web app built with **React + TypeScript**. Your images **never leave your device** — every operation runs in real-time inside the browser using the **HTML5 Canvas API** with pixel-level precision.

Think of it as a privacy-first, zero-install alternative to desktop editors. Upload a photo, apply cinematic looks, fine-tune every detail with pro-grade controls, and download the result — all without a single server request.

---

## 🚀 Features at a Glance

```
🎭 35 Style Presets   •   🎚️ Per-Preset Intensity   •   ♾️ Continuous Editing
↩️ 100-Step Undo/Redo  •   🧱 Apply & Flatten         •   ✂️ Crop / Rotate / Flip
🌡️ Temperature & Tint  •   🌈 HSL per Colour Channel  •   💡 Highlights & Shadows
🎨 Vibrance            •   📈 Tone Curves (R/G/B/Master) •  🔍 Clarity & Sharpen
🎬 Split Toning        •   🎞️ Film Grain & Vignette   •   📊 Live Histogram
🎯 Radial & Gradient Masks  •  💾 Session Export / Import  •  📦 PNG / JPG Export
```

---

## 🎭 Style Presets — 35 Curated Looks

Choose from **7 categories**, **5 presets each**:

| Category | Presets |
|---|---|
| 🎬 **Cinematic** | Cold Cinema, Warm Cinema, Teal & Orange, Blockbuster, Nordic Frost |
| 📷 **Vintage** | Classic Vintage, Faded Film, Retro 70s, Kodachrome, Polaroid |
| 👤 **Portrait** | Soft Portrait, Golden Hour, B&W Classic, Skin Glow, High Key |
| 🌿 **Landscape** | Vivid Nature, Matte Green, Desert Gold, Ocean Breeze, Autumn Warm |
| 🌑 **Dark Mood** | Noir, Moody Blue, Horror Red, Deep Shadow, Dark Emerald |
| 🏙️ **Urban** | Street, Chrome, Neon City, Concrete, Cyberpunk |
| ✨ **Dreamy** | Pastel, Morning Mist, Fairy Tale, Lavender, Cotton Candy |

Each preset card shows a **live thumbnail preview** rendered from your actual uploaded photo. Adjust intensity per-preset from **0% (original) to 100% (full effect)** using the inline slider — changes are debounced with `requestAnimationFrame` for silky-smooth performance.

---

## 🛠️ Full Feature Reference

### 💡 Highlights & Shadow Recovery
Rescue overexposed skies and lift crushed shadows without touching midtones.
- **Highlights** (−100 → +100) — targets the bright luminance range (>180) with smoothstep falloff
- **Shadows** (−100 → +100) — targets the dark luminance range (<100) with smoothstep falloff
- Zero colour shifting — boost/lift applied uniformly across R/G/B channels per pixel

### 🎨 Vibrance
Smart saturation that protects what already looks good.
- **Vibrance** (−100 → +100) — boosts low-saturated pixels proportionally more than already-vivid ones
- Built-in **skin tone protection** — pixels in the 20°–50° hue range receive reduced adjustment
- Negative vibrance gently desaturates without going flat

### 🌡️ Temperature & Tint
Classic colour grading controls for correcting white balance or adding mood.
- **Temperature** (−100 → +100) — cool blue ↔ warm amber shift via direct R/B pixel manipulation
- **Tint** (−100 → +100) — green ↔ magenta shift

### 🌈 HSL — Per Colour Channel
Eight independent colour ranges, each with three axes of control.

| Range | Hue Shift | Saturation | Lightness |
|---|---|---|---|
| 🔴 Reds | ✅ | ✅ | ✅ |
| 🟠 Oranges | ✅ | ✅ | ✅ |
| 🟡 Yellows | ✅ | ✅ | ✅ |
| 🟢 Greens | ✅ | ✅ | ✅ |
| 🩵 Blues | ✅ | ✅ | ✅ |
| 🟣 Purples | ✅ | ✅ | ✅ |

Each range uses soft weighted blending — no harsh colour edges, no banding.

### 📈 Tone Curves
Studio-quality tonal control with a visual drag interface.
- **4 channels**: Master, Red, Green, Blue — switch between them via tab
- Drag **control points** on the 256×256 graph canvas; fixed endpoints prevent clipping
- Linear interpolation builds a **256-value LUT** applied to every pixel in one fast pass
- Click to add points; drag to edge to remove

### 🔍 Clarity & Sharpness
Two distinct operations for perceived and actual sharpness:
- **Clarity** (−100 → +100) — Unsharp Mask targeted at **midtones only** (peak at luma 128, fades at blacks/whites). Negative clarity softens.
- **Sharpen** (0 → 100) + **Radius** (1–5 px) — full-range edge enhancement with a threshold (8 levels) to suppress noise boosting

### � Split Toning — Cinematic Colour Grading
Apply different hues to highlights and shadows for that signature film look.
- **Highlight Hue** (0–360°) + **Highlight Saturation** (0–100)
- **Shadow Hue** (0–360°) + **Shadow Saturation** (0–100)
- **Balance** (−100 → +100) — shifts the highlight/shadow transition midpoint
- Colour swatches update live as you move the hue slider

### 🎞️ Film Grain & Vignette
Analogue finishing touches for a cinematic feel.
- **Film Grain** (0–100) — randomised luminance noise blended in overlay mode
- **Vignette Amount** (0–100) + **Feather** (0–100) — radial gradient darkening from the edges, rendered in multiply mode for natural depth

### 🎯 Radial & Gradient Masks
Apply exposure adjustments to specific areas of the image only.
- **Radial Mask** — elliptical region with normalised centre (X/Y), radius, feather, and exposure boost
- **Gradient Mask** — linear gradient between two normalised points with feather and exposure
- Both mask types support **stacking multiple instances** — each is a separate operation in the history

### 📊 Live Histogram
Always-accurate exposure monitoring.
- Displays **luminance** (filled grey bars) + optional **R/G/B channel overlays** (coloured lines)
- Recomputed from the canvas `ImageData` after every render — never stale
- Toggle RGB channels on/off; zero impact on editing performance

### ✂️ Crop / Rotate / Flip
- **Freehand crop** with rule-of-thirds grid overlay + real-time size indicator
- **Rotate** in 90° increments (CW & CCW)
- **Flip** horizontally or vertically

### ↩️ Multi-Step Undo / Redo
- Up to **100 operations** in history with auto-trim of oldest entries
- Live counter `12 / 100` — turns orange at 90% capacity
- `Ctrl+Z` / `Ctrl+Shift+Z` keyboard shortcuts
- Original image is **never mutated** — fully non-destructive

### 🧱 Apply & Flatten
- Merge current canvas state into a new base image, resetting history
- Frees memory for long editing sessions
- Confirmation dialog prevents accidental history loss

### 💾 Session Export / Import
Save your entire workflow and restore it later — or share it with someone else.
- **Export Session** → downloads a `.json` with `version`, `operations[]`, and image `metadata`
- **Import Session** → validates version and image-dimension compatibility (±5 px tolerance) before restoring
- Undo/Redo works correctly after import

### 🔍 Before / After Compare
- Drag the split slider to compare edited vs. original side-by-side
- **Hold to Preview** button instantly shows the original while held

### 📦 Export
- **PNG** (lossless, full quality) or **JPG** (adjustable 50–100% quality)
- Direct browser download — no server, no third-party service

### 🔒 100% Private
- No backend, no API, no cloud upload of any kind
- Works **offline** after first page load
- All pixel data stays entirely in your browser memory

---

## 🖥️ UI Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  🎨 Image Style Editor                          [Upload Image]       │ ← Header
├─────────────────┬────────────────────────────────┬───────────────────┤
│  35 Presets     │                                │ ▸ Histogram       │
│  ─────────────  │                                │ ▸ Transform       │
│  🎬 Cinematic   │        Canvas Workspace        │ ▸ Highlights &    │
│  📷 Vintage     │                                │   Shadows         │
│  👤 Portrait    │     (zoom · pan · crop)        │ ▸ Vibrance        │
│  🌿 Landscape   │                                │ ▸ Color (Temp/    │
│  🌑 Dark Mood   │   ◀──── compare slider ────▶   │   Tint / HSL)     │
│  🏙️  Urban      │   (before / after)             │ ▸ Curves          │
│  ✨ Dreamy      │                                │ ▸ Clarity &       │
│                 │                                │   Sharpness       │
│  [preset card]  │                                │ ▸ Split Toning    │
│  [intensity ──] │                                │ ▸ Grain & Vignette│
│                 │                                │ ▸ Masks           │
│                 │                                │ ▸ History / Undo  │
│                 │                                │ ▸ Session         │
│                 │                                │ ▸ Export          │
└─────────────────┴────────────────────────────────┴───────────────────┘
```

---

## 📦 Getting Started

### Prerequisites
- **Node.js** v18 or newer
- **npm** v9 or newer

### Installation & Run

```bash
# 1. Clone or download the project
cd image_style_editor

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open your browser at **http://localhost:5173**

### Build for Production

```bash
# Build optimized static files
npm run build

# Preview the production build locally
npm run preview
```

Output will be in the `dist/` folder — deploy anywhere (Netlify, Vercel, GitHub Pages, or just open `index.html`).

---

## 🗂️ Project Structure

```
image_style_editor/
├── src/
│   ├── components/
│   │   ├── Header/              # Upload bar & branding
│   │   ├── LeftPanel/           # Preset grid + intensity slider
│   │   │   ├── LeftPanel.tsx
│   │   │   └── PresetCard.tsx       # Live thumbnail per preset
│   │   ├── Canvas/              # Main editing workspace
│   │   │   ├── CanvasWorkspace.tsx
│   │   │   ├── CropTool.tsx         # Freehand crop overlay
│   │   │   └── ComparisonSlider.tsx # Before/After drag
│   │   ├── RightPanel/          # Master tool panel (all sections)
│   │   ├── ColorControls/       # Temperature, Tint, HSL sliders
│   │   ├── HighlightShadow/     # Highlights & Shadows recovery
│   │   ├── Vibrance/            # Smart saturation control
│   │   ├── ClaritySharpness/    # Clarity (midtone contrast) + Unsharp Mask
│   │   ├── SplitToning/         # Cinematic hue toning for highlights/shadows
│   │   ├── GrainVignette/       # Film grain + vignette controls
│   │   ├── CurvesTool/          # Draggable tone-curve editor (4 channels)
│   │   ├── Histogram/           # Live luminance + RGB histogram
│   │   └── MaskTool/            # Radial & gradient mask builder
│   ├── data/
│   │   └── presets.ts           # All 35 preset definitions (7 categories × 5)
│   ├── hooks/
│   │   └── useEditorState.ts    # Global state + undo/redo reducer
│   ├── types/
│   │   └── editor.ts            # TypeScript types (Operation, Preset, masks…)
│   ├── utils/
│   │   ├── renderer.ts          # Non-destructive Canvas render pipeline
│   │   ├── pixelOps.ts          # Pixel-level ImageData operations
│   │   ├── session.ts           # Session JSON export / import
│   │   └── export.ts            # PNG/JPG download
│   ├── App.tsx                  # Root component — wires everything
│   └── main.tsx                 # Entry point
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🏗️ Architecture — Non-Destructive Pipeline

Every edit is stored as an **operation** in an array — the original image is **never mutated**:

```
EditorState {
  originalImage: HTMLImageElement   ← always kept (or replaced on Flatten)
  operations: Operation[]           ← max 100 ops, oldest auto-trimmed
  historyIndex: number              ← current position in history
  isFlattening: boolean             ← UI lock during flatten process
}

Operation =
  | { type: 'preset';          presetId, intensity }         ← CSS filter blend
  | { type: 'rotate';          angle }
  | { type: 'flip';            direction }
  | { type: 'crop';            x, y, width, height }
  | { type: 'temperature';     value }                       ← pixel RGB shift
  | { type: 'tint';            value }                       ← pixel RGB shift
  | { type: 'hsl';             channel, hue, sat, light }    ← per-colour-range
  | { type: 'highlightShadow'; highlights, shadows }         ← luminance zones
  | { type: 'vibrance';        amount }                      ← smart saturation
  | { type: 'clarity';         amount }                      ← midtone contrast
  | { type: 'sharpen';         amount, radius }              ← unsharp mask
  | { type: 'splitToning';     highlightHue, highlightSat, shadowHue, shadowSat, balance }
  | { type: 'grain';           amount }                      ← noise overlay
  | { type: 'vignette';        amount, feather }             ← radial darkening
  | { type: 'curve';           channel, points[] }           ← 256-value LUT
  | { type: 'radialMask';      config }                      ← ellipse exposure
  | { type: 'gradientMask';    config }                      ← linear exposure
```

On every change: **Clear → Draw original → Replay ops[0..historyIndex] → Render**.

The render pipeline runs in four ordered phases:
1. **CSS Filters** — preset colour grade + brightness/contrast via `ctx.filter`
2. **Pixel Pass (colour)** — temperature, tint, HSL, highlight/shadow, vibrance, split toning
3. **Pixel Pass (detail)** — curves, clarity, sharpen, radial & gradient mask exposure
4. **Composite Pass** — film grain and vignette drawn on top via `globalCompositeOperation`

### Apply & Flatten Flow

```
canvas.toDataURL("image/png")
  → new Image().onload
  → dispatch FLATTEN { newImage }
  → state.originalImage = newImage
  → state.operations = []
  → state.historyIndex = -1
  → re-render (clean slate)
```

---

## ⚡ Performance Safeguards

| Safeguard | Detail |
|---|---|
| **Max image size** | Files > 10 MB rejected; longest edge > 2000 px auto-resized on load |
| **History cap** | Max 100 operations — oldest auto-trimmed to keep memory bounded |
| **rAF debounce** | All continuous sliders (intensity, colour, grain, curves…) throttled with `requestAnimationFrame` |
| **Zero-pass guard** | Pixel-level pass is skipped entirely if no pixel op is active |
| **Apply & Flatten** | Merge edits → reset ops to free memory for long sessions |
| **Clarity/Sharpen box-blur** | Two-pass separable box blur O(n·r) instead of O(n·r²) naive Gaussian |
| **No external libs** | Pure Canvas 2D + CSS filters + `ImageData` — zero image-processing overhead |

---

## 🧰 Tech Stack

| Tool | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript 5** | Type safety |
| **Vite 6** | Dev server + bundler |
| **Tailwind CSS 3** | Utility-first styling |
| **Lucide React** | Icon library |
| **HTML5 Canvas API** | All image processing |

No image processing libraries — everything is implemented directly with the Canvas 2D context, CSS filter strings, and raw `ImageData` pixel loops.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| Mouse Wheel | Zoom in/out on canvas |

---

## 🌐 Browser Support

| Browser | Supported |
|---|---|
| Chrome / Edge 90+ | ✅ |
| Firefox 88+ | ✅ |
| Safari 15+ | ✅ |

---

## 📋 Roadmap (Future Extensions)

- [ ] Text overlay tool
- [ ] Sticker / stamp system
- [ ] Custom preset builder
- [ ] Batch export
- [ ] Spot healing / clone stamp
- [ ] Layer blending modes

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<div align="center">
  <strong>Built with ❤️ — runs entirely in your browser, respects your privacy.</strong>
</div>
