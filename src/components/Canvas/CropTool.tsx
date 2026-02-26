import React, { useRef, useState, useCallback } from 'react'

interface CropToolProps {
  width: number
  height: number
  onApply: (x: number, y: number, w: number, h: number) => void
  onCancel: () => void
}

interface DragState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isDragging: boolean
}

export function CropTool({ width, height, onApply, onCancel }: CropToolProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<DragState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
  })

  const getRelativePos = useCallback(
    (e: React.MouseEvent) => {
      const rect = overlayRef.current!.getBoundingClientRect()
      return {
        x: Math.max(0, Math.min(width, e.clientX - rect.left)),
        y: Math.max(0, Math.min(height, e.clientY - rect.top)),
      }
    },
    [width, height]
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getRelativePos(e)
    setDrag({ startX: pos.x, startY: pos.y, currentX: pos.x, currentY: pos.y, isDragging: true })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drag.isDragging) return
    const pos = getRelativePos(e)
    setDrag(prev => ({ ...prev, currentX: pos.x, currentY: pos.y }))
  }

  const handleMouseUp = () => {
    setDrag(prev => ({ ...prev, isDragging: false }))
  }

  const cropX = Math.min(drag.startX, drag.currentX)
  const cropY = Math.min(drag.startY, drag.currentY)
  const cropW = Math.abs(drag.currentX - drag.startX)
  const cropH = Math.abs(drag.currentY - drag.startY)

  const handleApply = () => {
    if (cropW < 10 || cropH < 10) return
    onApply(Math.round(cropX), Math.round(cropY), Math.round(cropW), Math.round(cropH))
  }

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 cursor-crosshair select-none"
      style={{ width, height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Crop selection */}
      {cropW > 0 && cropH > 0 && (
        <div
          className="absolute border-2 border-white shadow-lg"
          style={{
            left: cropX,
            top: cropY,
            width: cropW,
            height: cropH,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
            background: 'transparent',
          }}
        >
          {/* Rule of thirds grid */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute border-white/30 border-r" style={{ left: '33.33%', top: 0, bottom: 0 }} />
            <div className="absolute border-white/30 border-r" style={{ left: '66.66%', top: 0, bottom: 0 }} />
            <div className="absolute border-white/30 border-b" style={{ top: '33.33%', left: 0, right: 0 }} />
            <div className="absolute border-white/30 border-b" style={{ top: '66.66%', left: 0, right: 0 }} />
          </div>
          {/* Corner handles */}
          {[
            { top: -4, left: -4 },
            { top: -4, right: -4 },
            { bottom: -4, left: -4 },
            { bottom: -4, right: -4 },
          ].map((style, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-sm"
              style={style}
            />
          ))}
          {/* Size indicator */}
          <div className="absolute -bottom-6 left-0 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
            {Math.round(cropW)} × {Math.round(cropH)}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); handleApply() }}
          disabled={cropW < 10 || cropH < 10}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm rounded-md transition-colors"
        >
          Apply Crop
        </button>
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onCancel() }}
          className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
