import { useState } from 'react'
import { RadialMaskConfig, GradientMaskConfig } from '../../types/editor'

type MaskType = 'radial' | 'gradient'

interface MaskToolProps {
  onAddRadialMask: (config: RadialMaskConfig) => void
  onAddGradientMask: (config: GradientMaskConfig) => void
  hasImage: boolean
}

function LabeledSlider({
  label, value, min, max, step = 1, onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number
  onChange: (v: number) => void
}) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[10px] text-zinc-400">{label}</span>
        <span className="text-[10px] font-mono text-zinc-300">
          {value > 0 && label === 'Exposure' ? `+${value}` : value}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-[3px]"
      />
    </div>
  )
}

export function MaskTool({ onAddRadialMask, onAddGradientMask, hasImage }: MaskToolProps) {
  const [maskType, setMaskType] = useState<MaskType>('radial')

  // Radial state (normalized 0-1)
  const [rCx, setRCx] = useState(50)
  const [rCy, setRCy] = useState(50)
  const [rRx, setRRx] = useState(40)
  const [rRy, setRRy] = useState(40)
  const [rFeather, setRFeather] = useState(30)
  const [rExposure, setRExposure] = useState(30)

  // Gradient state (normalized 0-1)
  const [gX1, setGX1] = useState(0)
  const [gY1, setGY1] = useState(50)
  const [gX2, setGX2] = useState(100)
  const [gY2, setGY2] = useState(50)
  const [gFeather, setGFeather] = useState(30)
  const [gExposure, setGExposure] = useState(30)

  const handleApply = () => {
    if (!hasImage) return
    if (maskType === 'radial') {
      onAddRadialMask({
        cx: rCx / 100, cy: rCy / 100,
        rx: rRx / 100, ry: rRy / 100,
        feather: rFeather, exposure: rExposure,
      })
    } else {
      onAddGradientMask({
        x1: gX1 / 100, y1: gY1 / 100,
        x2: gX2 / 100, y2: gY2 / 100,
        feather: gFeather, exposure: gExposure,
      })
    }
  }

  return (
    <div className="space-y-2">
      {/* Type tabs */}
      <div className="flex gap-1">
        {(['radial', 'gradient'] as MaskType[]).map(t => (
          <button
            key={t}
            onClick={() => setMaskType(t)}
            className={`flex-1 py-1 rounded text-[10px] font-medium capitalize transition-all ${
              maskType === t
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-zinc-800/50 rounded-lg px-2 pt-2 pb-1">
        {maskType === 'radial' ? (
          <>
            <LabeledSlider label="Center X (%)" value={rCx} min={0} max={100} onChange={setRCx} />
            <LabeledSlider label="Center Y (%)" value={rCy} min={0} max={100} onChange={setRCy} />
            <LabeledSlider label="Radius X (%)" value={rRx} min={5} max={100} onChange={setRRx} />
            <LabeledSlider label="Radius Y (%)" value={rRy} min={5} max={100} onChange={setRRy} />
            <LabeledSlider label="Feather" value={rFeather} min={0} max={100} onChange={setRFeather} />
            <LabeledSlider label="Exposure" value={rExposure} min={-100} max={100} onChange={setRExposure} />
          </>
        ) : (
          <>
            <LabeledSlider label="Start X (%)" value={gX1} min={0} max={100} onChange={setGX1} />
            <LabeledSlider label="Start Y (%)" value={gY1} min={0} max={100} onChange={setGY1} />
            <LabeledSlider label="End X (%)"   value={gX2} min={0} max={100} onChange={setGX2} />
            <LabeledSlider label="End Y (%)"   value={gY2} min={0} max={100} onChange={setGY2} />
            <LabeledSlider label="Feather" value={gFeather} min={0} max={100} onChange={setGFeather} />
            <LabeledSlider label="Exposure" value={gExposure} min={-100} max={100} onChange={setGExposure} />
          </>
        )}
      </div>

      <button
        onClick={handleApply}
        disabled={!hasImage}
        className="w-full py-1.5 rounded bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-medium disabled:opacity-30 transition-colors"
      >
        Apply Mask
      </button>
      <p className="text-[9px] text-zinc-600">Each application adds a new mask layer</p>
    </div>
  )
}
