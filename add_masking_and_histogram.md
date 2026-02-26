# Feature Specification – Radial/Gradient Mask & Histogram

## 1. Goal

Enable selective adjustments and professional exposure monitoring.

Includes:
- Radial Mask
- Linear Gradient Mask
- Histogram (RGB or Luminance)

---

## 2. Radial Mask

### Controls
- Position (x,y)
- Radius
- Feather
- Exposure adjustment inside mask

Implementation:
- Create clipping path
- Apply adjustment only inside masked region

---

## 3. Linear Gradient Mask

### Controls
- Start point
- End point
- Feather

Implementation:
- Create linear gradient mask
- Blend adjustment gradually

---

## 4. Histogram

### Requirements

Display:
- Luminance histogram
- Optional RGB overlay

Implementation:
1. Read ImageData
2. Count intensity frequency (0–255)
3. Render small bar graph canvas

Update only after render completion.

---

## 5. State Model Update

Operation +=
  | { type: "radialMask"; config: object }
  | { type: "gradientMask"; config: object }

Histogram does NOT affect operations.

---

## 6. Acceptance Criteria

- Mask affects only selected region
- Feather works smoothly
- Histogram reflects exposure changes accurately
- No significant performance drop

End of specification.

