# Feature Specification – Vibrance

## 1. Goal

Increase color intensity intelligently by boosting low-saturated areas more than already saturated ones.

Must preserve natural skin tones.

---

## 2. UI Controls

Slider:
- Vibrance (-100 → +100)

Default: 0

---

## 3. Functional Behavior

Vibrance should:
- Increase saturation more strongly in low-saturated pixels
- Protect highly saturated pixels
- Minimize skin tone distortion

Negative vibrance should gently desaturate.

---

## 4. Implementation Strategy

1. Convert RGB to HSL
2. Compute dynamic scale factor:

scale = 1 - currentSaturation
adjustment = sliderValue/100 * scale

3. Apply adjustment to saturation channel
4. Convert back to RGB

Optional skin protection:
- Detect hue range 20°–50°
- Reduce adjustment intensity for that range

---

## 5. State Model Update

Operation +=
  | { type: "vibrance"; amount: number }

---

## 6. Rendering Order

Apply after:
- Exposure
- Contrast

Apply before:
- Clarity
- Grain

---

## 7. Performance Constraints

- Reuse HSL conversion if used elsewhere
- Avoid repeated RGB ↔ HSL conversion per operation

---

## 8. Acceptance Criteria

- Low-saturated areas gain color depth
- Skin tones remain natural
- No clipping or banding
- Undo/Redo supported

End of specification.

