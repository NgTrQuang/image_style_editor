import { Operation } from '../types/editor'

const SESSION_VERSION = '1.1'

export interface SessionFile {
  version: string
  operations: Operation[]
  metadata: {
    imageWidth: number
    imageHeight: number
    createdAt: string
  }
}

export function exportSession(
  operations: Operation[],
  historyIndex: number,
  imageWidth: number,
  imageHeight: number
): void {
  const activeOps = operations.slice(0, historyIndex + 1)
  const session: SessionFile = {
    version: SESSION_VERSION,
    operations: activeOps,
    metadata: {
      imageWidth,
      imageHeight,
      createdAt: new Date().toISOString(),
    },
  }
  const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `session_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importSession(
  file: File,
  imageWidth: number,
  imageHeight: number
): Promise<Operation[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const text = e.target?.result as string
        const session: SessionFile = JSON.parse(text)

        if (!session.version || !Array.isArray(session.operations)) {
          return reject(new Error('Invalid session file format.'))
        }

        // Validate dimensions match (with 10% tolerance for resize)
        if (session.metadata?.imageWidth && session.metadata?.imageHeight) {
          const widthRatio = imageWidth / session.metadata.imageWidth
          const heightRatio = imageHeight / session.metadata.imageHeight
          if (Math.abs(widthRatio - 1) > 0.15 || Math.abs(heightRatio - 1) > 0.15) {
            return reject(
              new Error(
                `Image dimensions mismatch.\nSession: ${session.metadata.imageWidth}×${session.metadata.imageHeight}\nCurrent: ${imageWidth}×${imageHeight}`
              )
            )
          }
        }

        // Validate all operation types are known
        const validTypes = new Set([
          'preset', 'brightness', 'contrast', 'crop', 'rotate', 'flip',
          'temperature', 'tint', 'hsl', 'grain', 'vignette', 'curve',
          'radialMask', 'gradientMask',
        ])
        for (const op of session.operations) {
          if (!validTypes.has(op.type)) {
            return reject(new Error(`Unknown operation type: "${op.type}"`))
          }
        }

        resolve(session.operations)
      } catch {
        reject(new Error('Corrupted JSON — could not parse session file.'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}
