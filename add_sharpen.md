# Feature Specification – Sharpen Tool

## 1. Goal

Increase actual edge sharpness without affecting overall contrast.

Distinct from Clarity.

---

## 2. UI Controls

Sliders:
- Sharpen (0 → 100)
- Radius (optional, default small)

Default: 0

---

## 3. Functional Behavior

Sharpen should:
- Enhance edges
- Avoid halo artifacts
- Preserve natural look

---

## 4. Implementation Strategy

Use Unsharp Mask:

1. Create blurred copy of image (Gaussian blur radius 1–3px)
2. Compute difference:
   detail = original - blurred
3. Add scaled detail back:
   sharpened = original + (detail * strength)

Clamp output to 0–255.

Optional threshold:
- Only apply when difference exceeds threshold value

---

## 5. State Model Update

Operation +=
  | { type: "sharpen"; amount: number; radius?: number }

---

## 6. Rendering Order

Apply after:
- All color corrections

Apply before:
- Grain

---

## 7. Performance Constraints

- Cache blurred result if radius unchanged
- Skip processing if amount = 0

---

## 8. Acceptance Criteria

- Edges visibly sharper
- No excessive halos
- No color shifts
- Undo/Redo supported

End of specification.

