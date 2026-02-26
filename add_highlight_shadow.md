# Feature Specification – Highlight & Shadow Recovery

## 1. Goal

Allow users to recover detail in bright and dark areas without using complex curve adjustments.

Frontend-only implementation.

---

## 2. UI Controls

Sliders:
- Highlights (-100 → +100)
- Shadows (-100 → +100)

Default: 0

---

## 3. Functional Behavior

Highlights:
- Negative value: reduce brightness in high luminance range
- Positive value: boost highlights

Shadows:
- Positive value: brighten dark areas
- Negative value: deepen shadows

Adjustments should target specific luminance ranges.

---

## 4. Implementation Strategy

1. Convert pixel to luminance (Y value)
2. Define threshold ranges:
   - Shadows: 0–100
   - Midtones: 100–180
   - Highlights: 180–255
3. Apply gamma-like adjustment within target range
4. Blend smoothly using weighted falloff

Example:

if (luminance > 180) apply highlight adjustment
if (luminance < 100) apply shadow adjustment

Use smoothstep interpolation for soft transitions.

---

## 5. State Model Update

Operation +=
  | { type: "highlightShadow"; highlights: number; shadows: number }

---

## 6. Rendering Order

Apply after:
- Exposure

Apply before:
- Clarity
- Curves

---

## 7. Performance Constraints

- Precompute luminance once per render
- Avoid multiple passes over pixel data

---

## 8. Acceptance Criteria

- Highlights slider recovers bright details
- Shadows slider lifts dark areas naturally
- No color shifting artifacts
- Undo/Redo supported

End of specification.

