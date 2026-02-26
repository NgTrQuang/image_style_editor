import { useEffect, useRef, useState } from 'react'

interface HistogramData {
  r: Float32Array
  g: Float32Array
  b: Float32Array
  luma: Float32Array
}

interface HistogramProps {
  data: HistogramData | null
}

type HistogramMode = 'luma' | 'rgb'

const W = 256
const H = 64

export function Histogram({ data }: HistogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<HistogramMode>('luma')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#09090b'
    ctx.fillRect(0, 0, W, H)

    if (!data) return

    const draw = (arr: Float32Array, color: string, alpha: number) => {
      const peak = Math.max(...arr) || 1
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.globalAlpha = alpha
      for (let i = 0; i < 256; i++) {
        const h = (arr[i] / peak) * H
        ctx.moveTo(i + 0.5, H)
        ctx.lineTo(i + 0.5, H - h)
      }
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    if (mode === 'luma') {
      draw(data.luma, '#a1a1aa', 0.9)
    } else {
      draw(data.r, '#ef4444', 0.6)
      draw(data.g, '#22c55e', 0.6)
      draw(data.b, '#3b82f6', 0.6)
    }
  }, [data, mode])

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Histogram</span>
        <div className="flex gap-1">
          {(['luma', 'rgb'] as HistogramMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${
                mode === m ? 'bg-zinc-600 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full rounded border border-zinc-800"
        style={{ imageRendering: 'pixelated' }}
      />
      {!data && (
        <p className="text-[10px] text-zinc-600 text-center">Upload an image to see histogram</p>
      )}
    </div>
  )
}
