# Feature Specification – Split Toning (Color Grading)

## 1. Goal

Enable cinematic color grading by applying different hues to highlights and shadows.

Frontend-only implementation.

---

## 2. UI Controls

Controls:
- Highlight Hue (0–360)
- Highlight Saturation (0–100)
- Shadow Hue (0–360)
- Shadow Saturation (0–100)
- Balance (-100 → +100)

Default: all 0

---

## 3. Functional Behavior

Highlights:
- Apply selected hue to bright luminance range

Shadows:
- Apply selected hue to dark luminance range

Balance:
- Shift transition midpoint between highlight and shadow zones

---

## 4. Implementation Strategy

1. Compute luminance per pixel
2. Determine weight based on balance value
3. Convert pixel to HSL
4. Blend original color with target hue using selected saturation
5. Convert back to RGB

Blend weight example:

if (luminance > threshold) apply highlight tone
if (luminance < threshold) apply shadow tone

Use smooth interpolation between zones.

---

## 5. State Model Update

Operation +=
  | {
      type: "splitToning";
      highlightHue: number;
      highlightSat: number;
      shadowHue: number;
      shadowSat: number;
      balance: number;
    }

---

## 6. Rendering Order

Apply after:
- Exposure
- Contrast
- Vibrance

Apply before:
- Sharpen
- Grain

---

## 7. Performance Constraints

- Compute luminance once
- Reuse HSL conversion if possible

---

## 8. Acceptance Criteria

- Highlights and shadows visibly tinted
- Smooth transition between zones
- No harsh banding
- Undo/Redo supported

End of specification.

