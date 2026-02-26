# Feature Specification – Continuous Editing & Apply/Flatten

## 1. Feature Name

Continuous Editing with Optional Apply & Flatten

---

## 2. Goal

Allow users to:

1. Continue editing indefinitely after applying presets or transformations
2. Maintain full undo/redo history
3. Optionally "flatten" current edits into a new base image
4. Prevent performance degradation during long editing sessions

This feature must remain:

- Frontend-only
- Non-destructive by default
- Optimized for performance
- Suitable for portfolio-level production quality

---

## 3. Concept Overview

The editor already uses a non-destructive rendering pipeline:

- originalImage (never mutated)
- operations[] (list of edits)
- historyIndex (undo/redo pointer)

Continuous editing means:

- Users can apply preset → adjust → rotate → crop → adjust again
- No forced download/upload cycle
- All edits remain in memory

To avoid performance issues, we introduce:

Apply & Flatten

---

## 4. Apply & Flatten – Functional Description

### 4.1 Purpose

Convert the current rendered result into a new base image.

After flattening:

- The rendered canvas becomes the new originalImage
- operations[] is cleared
- historyIndex resets to 0

This reduces replay cost and resets history.

---

## 5. Functional Requirements

### 5.1 Continuous Editing

- User can apply multiple presets sequentially
- User can combine presets + transforms + adjustments
- Undo/Redo must remain fully functional
- Before/After comparison must still work

No automatic flattening is allowed.

---

### 5.2 Apply & Flatten Button

UI Button:

[ Apply & Flatten ]

Location:
- Right panel (near Reset or History section)

On click:

1. Render current final state to canvas
2. Convert canvas to image blob
3. Create new HTMLImageElement
4. Set as originalImage
5. Clear operations array
6. Reset historyIndex to 0
7. Re-render canvas

---

## 6. Technical Implementation

### 6.1 Flatten Algorithm

Pseudo-flow:

1. const dataURL = canvas.toDataURL("image/png")
2. const newImage = new Image()
3. newImage.src = dataURL
4. await newImage.onload
5. editorState.originalImage = newImage
6. editorState.operations = []
7. editorState.historyIndex = 0
8. render()

Important:
- Must wait for image load before replacing original
- Avoid memory leaks (release references if needed)

---

## 7. Performance Safeguards

### 7.1 Image Size Limit

On upload:

- If longest edge > 2000px → resize proportionally
- If file > 10MB → show error

Reason:
- Prevent excessive RAM usage
- Maintain smooth Canvas rendering

---

### 7.2 History Limit

Soft limit recommended:

MAX_OPERATIONS = 100

If operations.length exceeds limit:
- Remove oldest operation
- Adjust historyIndex accordingly

---

### 7.3 Slider Optimization

For intensity slider:

- Use requestAnimationFrame OR
- Debounce 16–32ms

Avoid continuous re-render at uncontrolled rates.

---

## 8. State Model Changes

No structural change required.

Optional addition:

EditorState {
  isFlattening: boolean
}

Used to disable UI during flatten process.

---

## 9. UX Considerations

### 9.1 Confirmation (Optional)

Optional confirmation dialog:

"Flattening will reset undo history. Continue?"

Recommended for professional polish.

---

### 9.2 Tooltip

Tooltip text:

"Merge current edits into a new base image and reset history."

---

## 10. Edge Cases

- Prevent flatten if no image loaded
- Disable button while rendering
- Ensure before/after mode resets correctly

---

## 11. Non-Functional Requirements

- No backend calls
- No additional libraries required
- Must not significantly increase memory footprint
- Must remain responsive for 2000px images

---

## 12. Acceptance Criteria

Feature is complete when:

- User can edit continuously without forced export
- Undo/Redo works correctly
- Apply & Flatten resets history correctly
- Performance remains smooth after 50+ operations
- No memory leaks observed in DevTools

---

End of specification.

