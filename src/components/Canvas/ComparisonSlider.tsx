import React, { useRef, useState, useEffect, useCallback } from 'react'

interface ComparisonSliderProps {
  editedCanvas: HTMLCanvasElement
  originalImage: HTMLImageElement
  width: number
  height: number
}

export function ComparisonSlider({ editedCanvas, originalImage, width, height }: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editedRef = useRef<HTMLCanvasElement>(null)
  const originalRef = useRef<HTMLCanvasElement>(null)
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const canvas = editedRef.current
    if (!canvas) return
    canvas.width = editedCanvas.width
    canvas.height = editedCanvas.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(editedCanvas, 0, 0)
  }, [editedCanvas])

  useEffect(() => {
    const canvas = originalRef.current
    if (!canvas) return
    canvas.width = originalImage.naturalWidth || originalImage.width
    canvas.height = originalImage.naturalHeight || originalImage.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(originalImage, 0, 0)
  }, [originalImage])

  const updateSlider = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    setSliderPos((x / rect.width) * 100)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    updateSlider(e)
  }

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent) => updateSlider(e)
    const onUp = () => setIsDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging, updateSlider])

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden shadow-2xl"
      style={{ width, height }}
      onMouseDown={handleMouseDown}
    >
      {/* Edited image (full width) */}
      <canvas
        ref={editedRef}
        className="absolute inset-0 w-full h-full object-contain"
        style={{ width, height }}
      />

      {/* Original image clipped to left side */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <canvas
          ref={originalRef}
          className="absolute inset-0"
          style={{ width, height, objectFit: 'contain' }}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center cursor-ew-resize">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5H13M1 5L4 2M1 5L4 8M13 5L10 2M13 5L10 8" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
        Original
      </div>
      <div className="absolute top-3 right-3 bg-indigo-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
        Edited
      </div>
    </div>
  )
}
