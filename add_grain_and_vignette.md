# Feature Specification – Film Grain & Vignette

## 1. Goal

Improve cinematic feel and visual depth using:

- Film Grain
- Vignette

Must be lightweight and run fully in browser.

---

## 2. Film Grain

### 2.1 Controls

- Grain Amount (0–100)
- Optional: Grain Size

### 2.2 Implementation

1. Generate noise layer using random grayscale values
2. Blend with main canvas using overlay/soft-light effect
3. Apply subtle opacity scaling based on slider value

Noise must:
- Be regenerated per render
- Avoid full recomputation when value unchanged

---

## 3. Vignette

### 3.1 Controls

- Amount (0–100)
- Feather (0–100)

### 3.2 Implementation

1. Create radial gradient centered on image
2. Darken outer edges
3. Blend via multiply mode

Feather controls gradient falloff softness.

---

## 4. State Model Update

Operation +=
  | { type: "grain"; amount: number }
  | { type: "vignette"; amount: number; feather: number }

---

## 5. Rendering Order

Recommended order:

1. Base image
2. Color adjustments
3. Grain
4. Vignette (final stage)

---

## 6. Acceptance Criteria

- Grain visible but subtle
- Vignette smoothly darkens edges
- No banding artifacts
- Works smoothly on 2000px image

End of specification.

