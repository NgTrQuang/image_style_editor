import { useState } from 'react'
import { HslChannel } from '../../types/editor'
import { useT } from '../../i18n/I18nContext'

const HSL_CHANNELS: { id: HslChannel; label: string; color: string }[] = [
  { id: 'red',    label: 'Red',    color: '#ef4444' },
  { id: 'orange', label: 'Orange', color: '#f97316' },
  { id: 'yellow', label: 'Yellow', color: '#eab308' },
  { id: 'green',  label: 'Green',  color: '#22c55e' },
  { id: 'blue',   label: 'Blue',   color: '#3b82f6' },
  { id: 'purple', label: 'Purple', color: '#a855f7' },
]

interface HslValues { hue: number; sat: number; light: number }

interface ColorControlsProps {
  temperature: number
  tint: number
  hslMap: Partial<Record<HslChannel, HslValues>>
  onTemperature: (v: number) => void
  onTint: (v: number) => void
  onHsl: (channel: HslChannel, hue: number, sat: number, light: number) => void
  hasImage: boolean
}

function LabeledSlider({
  label, value, min, max, step = 1, disabled, onChange, accent,
}: {
  label: string; value: number; min: number; max: number; step?: number
  disabled: boolean; onChange: (v: number) => void; accent?: string
}) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[10px] text-zinc-400">{label}</span>
        <span className="text-[10px] font-mono text-zinc-300">{value > 0 ? `+${value}` : value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-[3px] disabled:opacity-30"
        style={accent ? { accentColor: accent } : undefined}
      />
    </div>
  )
}

export function ColorControls({
  temperature, tint, hslMap, onTemperature, onTint, onHsl, hasImage,
}: ColorControlsProps) {
  const [activeChannel, setActiveChannel] = useState<HslChannel | null>(null)
  const { t } = useT()

  const hsl = activeChannel ? (hslMap[activeChannel] ?? { hue: 0, sat: 0, light: 0 }) : null

  return (
    <div className="space-y-3">
      {/* White Balance */}
      <div>
        <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1.5">{t('whiteBalance')}</p>
        <LabeledSlider
          label={t('temperature')}
          value={temperature} min={-100} max={100}
          disabled={!hasImage} onChange={onTemperature}
          accent="#f97316"
        />
        <LabeledSlider
          label={t('tint')}
          value={tint} min={-100} max={100}
          disabled={!hasImage} onChange={onTint}
          accent="#a855f7"
        />
      </div>

      {/* HSL */}
      <div>
        <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1.5">{t('hsl')}</p>
        {/* Channel selector */}
        <div className="flex gap-1 flex-wrap mb-2">
          {HSL_CHANNELS.map(ch => (
            <button
              key={ch.id}
              disabled={!hasImage}
              onClick={() => setActiveChannel(prev => prev === ch.id ? null : ch.id)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all disabled:opacity-30 ${
                activeChannel === ch.id
                  ? 'text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              style={activeChannel === ch.id ? { backgroundColor: ch.color } : undefined}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {activeChannel && hsl && (
          <div className="bg-zinc-800/50 rounded-lg px-2 pt-2 pb-1">
            <LabeledSlider
              label={t('hue')}
              value={hsl.hue} min={-180} max={180}
              disabled={!hasImage}
              onChange={v => onHsl(activeChannel, v, hsl.sat, hsl.light)}
              accent={HSL_CHANNELS.find(c => c.id === activeChannel)?.color}
            />
            <LabeledSlider
              label={t('saturation')}
              value={hsl.sat} min={-100} max={100}
              disabled={!hasImage}
              onChange={v => onHsl(activeChannel, hsl.hue, v, hsl.light)}
              accent={HSL_CHANNELS.find(c => c.id === activeChannel)?.color}
            />
            <LabeledSlider
              label={t('lightness')}
              value={hsl.light} min={-100} max={100}
              disabled={!hasImage}
              onChange={v => onHsl(activeChannel, hsl.hue, hsl.sat, v)}
              accent={HSL_CHANNELS.find(c => c.id === activeChannel)?.color}
            />
          </div>
        )}
        {!activeChannel && (
          <p className="text-[10px] text-zinc-600 text-center py-1">{t('selectChannel')}</p>
        )}
      </div>
    </div>
  )
}
