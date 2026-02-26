import { useEffect, useRef } from 'react'
import { Preset } from '../../types/editor'

interface PresetCardProps {
  preset: Preset
  isSelected: boolean
  intensity: number
  onSelect: (preset: Preset) => void
  onIntensityChange: (presetId: string, value: number) => void
  originalImage: HTMLImageElement | null
}

export function PresetCard({
  preset,
  isSelected,
  intensity,
  onSelect,
  onIntensityChange,
  originalImage,
}: PresetCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !originalImage) return

    const ctx = canvas.getContext('2d')!
    const size = 72
    canvas.width = size
    canvas.height = size

    const src = originalImage.naturalWidth || originalImage.width
    const srh = originalImage.naturalHeight || originalImage.height
    const minSide = Math.min(src, srh)
    const sx = (src - minSide) / 2
    const sy = (srh - minSide) / 2

    const t = intensity / 100
    const { brightness, contrast, sepia, saturation, hueRotate } = preset.config
    const parts = [
      `brightness(${100 + (brightness - 100) * t}%)`,
      `contrast(${100 + (contrast - 100) * t}%)`,
      `sepia(${sepia * t}%)`,
      `saturate(${100 + (saturation - 100) * t}%)`,
    ]
    if (hueRotate) parts.push(`hue-rotate(${hueRotate * t}deg)`)
    ctx.filter = parts.join(' ')

    ctx.drawImage(originalImage, sx, sy, minSide, minSide, 0, 0, size, size)
  }, [originalImage, preset, intensity])

  return (
    <div
      className={`flex flex-col rounded-lg transition-all overflow-hidden ${
        isSelected
          ? 'bg-indigo-600/20 ring-1 ring-indigo-500'
          : 'hover:bg-white/5'
      }`}
    >
      {/* Thumbnail + name — click to select */}
      <button
        onClick={() => onSelect(preset)}
        className="flex flex-col items-center gap-1 p-1.5 w-full"
      >
        <div className="relative w-[72px] h-[72px] rounded-md overflow-hidden bg-zinc-800">
          {originalImage ? (
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800" />
          )}
          {isSelected && (
            <div className="absolute inset-0 ring-2 ring-inset ring-indigo-400 rounded-md" />
          )}
          {/* Intensity badge */}
          {isSelected && (
            <div className="absolute bottom-1 right-1 bg-indigo-600/90 text-white text-[9px] font-mono px-1 rounded leading-tight">
              {intensity}%
            </div>
          )}
        </div>
        <span className="text-[10px] text-zinc-300 leading-tight text-center max-w-[72px] truncate">
          {preset.name}
        </span>
      </button>

      {/* Inline intensity slider — visible only when selected */}
      {isSelected && (
        <div className="px-2 pb-2">
          <input
            type="range"
            min={0}
            max={100}
            value={intensity}
            onChange={e => {
              e.stopPropagation()
              onIntensityChange(preset.id, Number(e.target.value))
            }}
            className="w-full"
            style={{ height: '3px' }}
          />
        </div>
      )}
    </div>
  )
}
