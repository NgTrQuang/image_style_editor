# Feature Specification – Session Export & Import

## 1. Goal

Allow users to save and restore editing sessions without backend.

This enhances portfolio-level usability.

---

## 2. Functional Requirements

### 2.1 Export Session

Button:
[ Export Session ]

Exports JSON file containing:

{
  version: string,
  operations: Operation[],
  metadata: {
    imageWidth: number,
    imageHeight: number
  }
}

File extension: .json

---

### 2.2 Import Session

Button:
[ Import Session ]

User must:
1. Upload original image
2. Upload session JSON
3. System validates compatibility
4. Restore operations array
5. Re-render

---

## 3. Validation

- Ensure image dimensions match
- Ensure operation types supported
- Show error if corrupted JSON

---

## 4. State Model

No structural change required.

Session file only serializes:
- operations
- version

originalImage is not serialized.

---

## 5. Acceptance Criteria

- Export generates valid JSON
- Import restores exact visual state
- Undo/Redo works after import
- No backend usage

End of specification.

