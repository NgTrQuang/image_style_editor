import { useRef, useEffect, useCallback, useState } from 'react'
import { CurvePoint } from '../../types/editor'
import { buildCurveLUT } from '../../utils/pixelOps'

type CurveChannel = 'master' | 'r' | 'g' | 'b'

const CHANNEL_COLORS: Record<CurveChannel, string> = {
  master: '#e4e4e7',
  r: '#ef4444',
  g: '#22c55e',
  b: '#3b82f6',
}

interface CurvesToolProps {
  curves: Partial<Record<CurveChannel, CurvePoint[]>>
  onCurveChange: (channel: CurveChannel, points: CurvePoint[]) => void
  hasImage: boolean
}

const SIZE = 160
const PADDING = 8
const INNER = SIZE - PADDING * 2

function clamp(v: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, v)) }

function defaultPoints(): CurvePoint[] {
  return [{ x: 0, y: 0 }, { x: 255, y: 255 }]
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  points: CurvePoint[],
  color: string,
  lut: Uint8Array
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let x = 0; x < 256; x++) {
    const px = PADDING + (x / 255) * INNER
    const py = PADDING + (1 - lut[x] / 255) * INNER
    if (x === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Draw control points
  for (const pt of points) {
    const px = PADDING + (pt.x / 255) * INNER
    const py = PADDING + (1 - pt.y / 255) * INNER
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(px, py, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#18181b'
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

function CurveEditor({
  channel, points, onPointsChange, hasImage,
}: {
  channel: CurveChannel
  points: CurvePoint[]
  onPointsChange: (pts: CurvePoint[]) => void
  hasImage: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draggingRef = useRef<number | null>(null)
  const color = CHANNEL_COLORS[channel]
  const lut = buildCurveLUT(points)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // Background
    ctx.fillStyle = '#18181b'
    ctx.fillRect(0, 0, SIZE, SIZE)

    // Grid
    ctx.strokeStyle = '#3f3f46'
    ctx.lineWidth = 0.5
    for (let i = 1; i < 4; i++) {
      const p = PADDING + (i / 4) * INNER
      ctx.beginPath(); ctx.moveTo(p, PADDING); ctx.lineTo(p, PADDING + INNER); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(PADDING, p); ctx.lineTo(PADDING + INNER, p); ctx.stroke()
    }

    // Diagonal guide
    ctx.strokeStyle = '#52525b'
    ctx.lineWidth = 0.5
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(PADDING, PADDING + INNER)
    ctx.lineTo(PADDING + INNER, PADDING)
    ctx.stroke()
    ctx.setLineDash([])

    drawCurve(ctx, points, color, lut)
  }, [points, color, lut])

  const getPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = SIZE / rect.width
    const scaleY = SIZE / rect.height
    const cx = (e.clientX - rect.left) * scaleX
    const cy = (e.clientY - rect.top) * scaleY
    return {
      x: clamp(Math.round(((cx - PADDING) / INNER) * 255), 0, 255),
      y: clamp(Math.round((1 - (cy - PADDING) / INNER) * 255), 0, 255),
    }
  }, [])

  const findNearestPoint = useCallback((x: number, y: number) => {
    let best = -1, bestDist = 15
    for (let i = 0; i < points.length; i++) {
      const px = PADDING + (points[i].x / 255) * INNER
      const py = PADDING + (1 - points[i].y / 255) * INNER
      const cx = PADDING + (x / 255) * INNER
      const cy = PADDING + (1 - y / 255) * INNER
      const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2)
      if (dist < bestDist) { bestDist = dist; best = i }
    }
    return best
  }, [points])

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hasImage) return
    const pt = getPoint(e)
    const idx = findNearestPoint(pt.x, pt.y)
    if (idx >= 0) {
      draggingRef.current = idx
    } else {
      // Add new point (not on endpoints unless close)
      const newPts = [...points, pt].sort((a, b) => a.x - b.x)
      onPointsChange(newPts)
      draggingRef.current = newPts.findIndex(p => p.x === pt.x && p.y === pt.y)
    }
  }, [hasImage, getPoint, findNearestPoint, points, onPointsChange])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingRef.current === null) return
    const pt = getPoint(e)
    const newPts = [...points]
    newPts[draggingRef.current] = pt
    // Keep endpoints fixed at x=0 and x=255
    if (draggingRef.current === 0) newPts[0].x = 0
    if (draggingRef.current === points.length - 1) newPts[points.length - 1].x = 255
    onPointsChange(newPts.sort((a, b) => a.x - b.x))
  }, [getPoint, points, onPointsChange])

  const onMouseUp = useCallback(() => { draggingRef.current = null }, [])

  const onDoubleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hasImage) return
    const pt = getPoint(e)
    const idx = findNearestPoint(pt.x, pt.y)
    if (idx > 0 && idx < points.length - 1) {
      onPointsChange(points.filter((_, i) => i !== idx))
    }
  }, [hasImage, getPoint, findNearestPoint, points, onPointsChange])

  return (
    <canvas
      ref={canvasRef}
      width={SIZE} height={SIZE}
      className={`w-full rounded border border-zinc-700 ${hasImage ? 'cursor-crosshair' : 'opacity-30'}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onDoubleClick={onDoubleClick}
    />
  )
}

export function CurvesTool({ curves, onCurveChange, hasImage }: CurvesToolProps) {
  const [activeChannel, setActiveChannel] = useState<CurveChannel>('master')
  const points = curves[activeChannel] ?? defaultPoints()

  const handleReset = () => onCurveChange(activeChannel, defaultPoints())

  return (
    <div className="space-y-2">
      {/* Channel tabs */}
      <div className="flex gap-1">
        {(['master', 'r', 'g', 'b'] as CurveChannel[]).map(ch => (
          <button
            key={ch}
            onClick={() => setActiveChannel(ch)}
            className={`flex-1 py-1 rounded text-[10px] font-semibold uppercase transition-all ${
              activeChannel === ch ? 'text-white' : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            style={activeChannel === ch ? { backgroundColor: CHANNEL_COLORS[ch] === '#e4e4e7' ? '#52525b' : CHANNEL_COLORS[ch] } : undefined}
          >
            {ch === 'master' ? 'RGB' : ch.toUpperCase()}
          </button>
        ))}
      </div>

      <CurveEditor
        channel={activeChannel}
        points={points}
        onPointsChange={pts => onCurveChange(activeChannel, pts)}
        hasImage={hasImage}
      />

      <div className="flex justify-between items-center">
        <p className="text-[9px] text-zinc-600">Click to add · Double-click to remove</p>
        <button
          onClick={handleReset}
          disabled={!hasImage}
          className="text-[10px] text-zinc-500 hover:text-zinc-300 disabled:opacity-30"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
