# Feature Specification – Curves Tool (Tone Curve)

## 1. Goal

Introduce professional tone adjustment via Curves.

Provide:
- Master RGB Curve
- Optional separate R, G, B channels

---

## 2. Functional Requirements

### 2.1 Curve Editor UI

- Graph area (0–255 input vs output)
- Draggable control points
- Real-time preview

Minimum:
- 2 endpoints fixed (0,0) and (255,255)
- User can add intermediate control points

---

## 3. Implementation

### 3.1 Curve Calculation

1. Generate lookup table (LUT) of 256 values
2. Interpolate using cubic or linear interpolation
3. Map each pixel channel through LUT

Example:

newValue = curveLUT[oldValue]

---

## 4. State Model Update

Operation +=
  | { type: "curve"; channel: "master" | "r" | "g" | "b"; points: {x:number,y:number}[] }

---

## 5. Rendering Order

Apply curve after basic exposure adjustments but before grain/vignette.

---

## 6. Performance Optimization

- Precompute LUT only when curve changes
- Avoid recomputing per pixel unnecessarily

---

## 7. Acceptance Criteria

- Curve visibly alters tonal range
- S-curve increases contrast correctly
- No clipping bugs
- Undo/Redo works correctly

End of specification.

