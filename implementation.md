# Image Style Editor – Implementation Specification

## 1. Project Overview

Build a frontend-only web application that allows users to:

1. Upload a single image
2. Apply predefined style presets
3. Adjust preset intensity
4. Perform basic edits (crop, rotate, flip)
5. Undo/Redo multiple steps
6. Compare Before/After
7. Export final result as JPG or PNG

The application does NOT require:

- Backend
- Database
- Authentication
- Cloud storage

All image processing must run entirely in the browser.

---

## 2. Technical Stack

### Core
- Next.js (App Router) OR React (Vite)
- TypeScript (required)
- HTML5 Canvas API

### Optional Libraries
- Fabric.js (recommended for object manipulation & history handling)
- Cropper.js (for cropping feature)

No server-side processing is allowed.

---

## 3. High-Level Architecture

### Rendering Model

All edits must follow a NON-DESTRUCTIVE pipeline.

- Keep original image in memory
- Maintain a list of editing operations
- On each change, re-render from original + replay operations

Avoid saving full image blobs for every history step.

---

## 4. Core State Model

### Global Editor State

```
EditorState {
  originalImage: HTMLImageElement
  operations: Operation[]
  historyIndex: number
  canvasSize: {
    width: number
    height: number
  }
}
```

### Operation Type

```
type Operation =
  | { type: "preset"; presetId: string; intensity: number }
  | { type: "brightness"; value: number }
  | { type: "contrast"; value: number }
  | { type: "crop"; x: number; y: number; width: number; height: number }
  | { type: "rotate"; angle: number }
  | { type: "flip"; direction: "horizontal" | "vertical" }
```

---

## 5. Features & Requirements

### 5.1 Image Upload

- Accept: JPG, PNG, WebP
- Max file size: 10MB
- Auto resize if width > 2000px
- Center image in canvas

---

### 5.2 Preset System

#### Preset Categories

- Cinematic
- Vintage
- Portrait
- Landscape
- Dark Mood

Each preset is a predefined filter configuration.

Example:

```
Vintage = {
  brightness: 110,
  contrast: 90,
  sepia: 40,
  saturation: 80
}
```

Presets must:
- Apply via Canvas filter API
- Support intensity slider (0–100)

Intensity must interpolate between:
- Original state
- Full preset values

---

### 5.3 Undo / Redo System

Requirements:

- Multi-step undo
- Multi-step redo
- Keyboard shortcuts:
  - Ctrl+Z → Undo
  - Ctrl+Shift+Z → Redo

Implementation:

- Use operations array
- historyIndex pointer
- On new operation:
  - Remove future operations
  - Push new operation
  - Increment historyIndex

---

### 5.4 Before / After Comparison

Two modes required:

1. Hold-to-preview original
2. Slider comparison view

Slider implementation:

- Render edited image
- Overlay original image
- Clip original layer based on slider position

---

### 5.5 Crop / Rotate / Flip

Crop:
- Rectangular selection
- Apply crop operation

Rotate:
- 90° increments

Flip:
- Horizontal
- Vertical

---

### 5.6 Export System

User must be able to export:

- PNG
- JPG

JPG must support quality selection (0.5 – 1.0)

Implementation:

```
canvas.toDataURL("image/png")
canvas.toDataURL("image/jpeg", quality)
```

Trigger download via anchor element.

---

## 6. Rendering Pipeline

On every change:

1. Clear canvas
2. Draw original image
3. Replay operations from index 0 → historyIndex
4. Render final output

Do NOT stack filters cumulatively.
Always render from original.

---

## 7. Performance Optimization

- Resize large images before editing
- Use requestAnimationFrame for heavy redraws
- Debounce slider changes
- Avoid unnecessary re-renders

---

## 8. UI Requirements

Single-page layout:

Left Panel:
- Preset list (grid with thumbnail preview)
- Intensity slider

Center:
- Canvas workspace
- Zoom controls

Right Panel:
- Crop
- Rotate
- Flip
- Undo / Redo
- Reset
- Export controls

Dark mode default.

---

## 9. Reset Behavior

Reset must:

- Clear operations
- Set historyIndex to 0
- Re-render original image

---

## 10. Error Handling

- Show error if file type invalid
- Show error if file too large
- Gracefully handle corrupted images

---

## 11. Non-Functional Requirements

- No backend
- No API calls
- Must run offline after build
- Must support modern browsers (Chrome, Edge, Firefox)

---

## 12. Future Extensions (Optional)

- Text overlay
- Sticker system
- Overlay textures (grain, dust)
- Preset thumbnail auto-generation
- Batch export (if later adding backend)

---

## 13. Deliverables

- Complete frontend project
- Clean modular structure
- Reusable preset system
- Fully working undo/redo
- Production-ready export

End of specification.

