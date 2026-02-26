# Feature Specification – Clarity (Micro-Contrast)

## 1. Goal

Increase perceived sharpness and depth by enhancing midtone contrast without heavily affecting highlights and shadows.

Must run fully client-side.

---

## 2. UI Controls

Slider:
- Clarity (-100 → +100)

Default: 0

---

## 3. Functional Behavior

Clarity should:
- Increase local contrast in midtones
- Preserve global exposure
- Avoid highlight clipping

Negative clarity should:
- Soften image slightly
- Reduce midtone contrast

---

## 4. Implementation Strategy

Recommended approach (non-destructive):

Option A – Unsharp Mask (preferred)
1. Create blurred copy of image (Gaussian blur small radius 2–5px)
2. Subtract blur from original to extract high-frequency detail
3. Blend result with original using intensity factor

Option B – High-pass blend
1. Generate high-pass layer
2. Blend using overlay/soft-light

Intensity mapping:

clarityFactor = sliderValue / 100

Apply only to luminance channel if possible.

---

## 5. State Model Update

Operation +=
  | { type: "clarity"; amount: number }

---

## 6. Rendering Order

Apply after:
- Exposure
- Contrast

Apply before:
- Grain
- Vignette

---

## 7. Performance Constraints

- Recompute blur only when clarity value changes
- Avoid full recomputation if amount = 0

---

## 8. Acceptance Criteria

- Positive clarity increases depth
- Negative clarity softens image
- No visible halo artifacts
- Undo/Redo fully supported

End of specification.

