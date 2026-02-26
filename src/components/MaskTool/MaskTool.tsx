import { useState } from 'react'
import { RadialMaskConfig, GradientMaskConfig } from '../../types/editor'
import { useT } from '../../i18n/I18nContext'

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
  const { t } = useT()

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
        <button
          onClick={() => setMaskType('radial')}
          className={`flex-1 py-1 rounded text-[10px] font-medium transition-all ${
            maskType === 'radial'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {t('radialMask')}
        </button>
        <button
          onClick={() => setMaskType('gradient')}
          className={`flex-1 py-1 rounded text-[10px] font-medium transition-all ${
            maskType === 'gradient'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {t('gradientMask')}
        </button>
      </div>

      <div className="bg-zinc-800/50 rounded-lg px-2 pt-2 pb-1">
        {maskType === 'radial' ? (
          <>
            <LabeledSlider label={`${t('centerX')} (%)`} value={rCx} min={0} max={100} onChange={setRCx} />
            <LabeledSlider label={`${t('centerY')} (%)`} value={rCy} min={0} max={100} onChange={setRCy} />
            <LabeledSlider label={`${t('radiusX')} (%)`} value={rRx} min={5} max={100} onChange={setRRx} />
            <LabeledSlider label={`${t('radiusY')} (%)`} value={rRy} min={5} max={100} onChange={setRRy} />
            <LabeledSlider label={t('feather')} value={rFeather} min={0} max={100} onChange={setRFeather} />
            <LabeledSlider label={t('exposure')} value={rExposure} min={-100} max={100} onChange={setRExposure} />
          </>
        ) : (
          <>
            <LabeledSlider label={`${t('startX')} (%)`} value={gX1} min={0} max={100} onChange={setGX1} />
            <LabeledSlider label={`${t('startY')} (%)`} value={gY1} min={0} max={100} onChange={setGY1} />
            <LabeledSlider label={`${t('endX')} (%)`}   value={gX2} min={0} max={100} onChange={setGX2} />
            <LabeledSlider label={`${t('endY')} (%)`}   value={gY2} min={0} max={100} onChange={setGY2} />
            <LabeledSlider label={t('feather')} value={gFeather} min={0} max={100} onChange={setGFeather} />
            <LabeledSlider label={t('exposure')} value={gExposure} min={-100} max={100} onChange={setGExposure} />
          </>
        )}
      </div>

      <button
        onClick={handleApply}
        disabled={!hasImage}
        className="w-full py-1.5 rounded bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-medium disabled:opacity-30 transition-colors"
      >
        {t('addMask')}
      </button>
      <p className="text-[9px] text-zinc-600">{maskType === 'radial' ? t('radialMask') : t('gradientMask')}</p>
    </div>
  )
}
