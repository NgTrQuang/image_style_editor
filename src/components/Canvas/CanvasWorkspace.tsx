import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Operation } from '../../types/editor'
import { renderToCanvas } from '../../utils/renderer'
import { CropTool } from './CropTool'
import { ComparisonSlider } from './ComparisonSlider'

interface CanvasWorkspaceProps {
  image: HTMLImageElement | null
  operations: Operation[]
  historyIndex: number
  zoom: number
  onZoomChange: (z: number) => void
  isCropping: boolean
  onCropApply: (x: number, y: number, w: number, h: number) => void
  onCropCancel: () => void
  showComparison: boolean
  holdPreview: boolean
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function CanvasWorkspace({
  image,
  operations,
  historyIndex,
  zoom,
  onZoomChange,
  isCropping,
  onCropApply,
  onCropCancel,
  showComparison,
  holdPreview,
  canvasRef,
}: CanvasWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasDims, setCanvasDims] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!image || !canvasRef.current) return
    const canvas = canvasRef.current
    renderToCanvas(canvas, image, operations, historyIndex)
    setCanvasDims({ width: canvas.width, height: canvas.height })
  }, [image, operations, historyIndex, canvasRef])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      onZoomChange(Math.min(3, Math.max(0.1, zoom + delta)))
    },
    [zoom, onZoomChange]
  )

  if (!image) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-950">
        <div className="text-center text-zinc-600">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Upload an image to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-zinc-950 flex items-center justify-center relative"
      onWheel={handleWheel}
    >
      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.1s' }}
        className="relative"
      >
        {/* Main edited canvas */}
        <canvas
          ref={canvasRef}
          className="block shadow-2xl"
          style={{ display: holdPreview || showComparison ? 'none' : 'block' }}
        />

        {/* Hold to preview original */}
        {holdPreview && image && (
          <canvas
            ref={el => {
              if (el && image) {
                const ctx = el.getContext('2d')!
                el.width = image.naturalWidth || image.width
                el.height = image.naturalHeight || image.height
                ctx.drawImage(image, 0, 0)
              }
            }}
            className="block shadow-2xl"
          />
        )}

        {/* Before/After comparison slider */}
        {showComparison && image && canvasRef.current && (
          <ComparisonSlider
            editedCanvas={canvasRef.current}
            originalImage={image}
            width={canvasDims.width}
            height={canvasDims.height}
          />
        )}

        {/* Crop overlay */}
        {isCropping && canvasDims.width > 0 && (
          <CropTool
            width={canvasDims.width}
            height={canvasDims.height}
            onApply={onCropApply}
            onCancel={onCropCancel}
          />
        )}
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-zinc-900/80 backdrop-blur-sm text-xs text-zinc-400 px-2 py-1 rounded-md border border-zinc-800">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  )
}
