# Feature Specification – Advanced Color Controls (Temperature, Tint, HSL)

## 1. Goal

Enhance color grading capabilities to achieve professional-level photo adjustments similar to Lightroom.

This feature includes:

- Temperature (Cool ↔ Warm)
- Tint (Green ↔ Magenta)
- HSL (Hue, Saturation, Lightness per color channel)

Must remain frontend-only and non-destructive.

---

## 2. Functional Requirements

### 2.1 Temperature Slider

Range: -100 to +100

Effect:
- Adjust warm/cool balance
- Modify red/blue channel bias

Implementation:
- Apply color matrix transformation
- Or manipulate pixel RGB values directly

---

### 2.2 Tint Slider

Range: -100 to +100

Effect:
- Shift green ↔ magenta balance

Implementation:
- Adjust green channel relative to red/blue

---

### 2.3 HSL Adjustment

For each color channel:
- Red
- Orange
- Yellow
- Green
- Blue
- Purple

Controls:
- Hue (-180 to 180)
- Saturation (-100 to 100)
- Lightness (-100 to 100)

Implementation Strategy:

1. Convert RGB → HSL
2. Modify selected channel range
3. Convert HSL → RGB
4. Apply during render replay

---

## 3. State Model Update

Add new operation types:

Operation +=
  | { type: "temperature"; value: number }
  | { type: "tint"; value: number }
  | { type: "hsl"; channel: string; hue: number; sat: number; light: number }

---

## 4. Rendering Integration

During replay:

1. Apply preset (if any)
2. Apply temperature
3. Apply tint
4. Apply HSL adjustments
5. Continue remaining operations

Order must remain consistent.

---

## 5. Performance Constraints

- Must handle 2000px image smoothly
- Use ImageData pixel loop only when necessary
- Avoid recalculating on unchanged sliders

---

## 6. Acceptance Criteria

- Temperature visibly changes warmth
- Tint shifts green/magenta balance
- HSL modifies specific color ranges only
- Undo/Redo fully functional
- No noticeable lag under normal usage

End of specification.

