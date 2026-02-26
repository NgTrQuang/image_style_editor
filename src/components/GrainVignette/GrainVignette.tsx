interface GrainVignetteProps {
  grainAmount: number
  vignetteAmount: number
  vignetteFeather: number
  onGrain: (v: number) => void
  onVignette: (amount: number, feather: number) => void
  hasImage: boolean
}

function LabeledSlider({
  label, value, min, max, disabled, onChange,
}: {
  label: string; value: number; min: number; max: number
  disabled: boolean; onChange: (v: number) => void
}) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[10px] text-zinc-400">{label}</span>
        <span className="text-[10px] font-mono text-zinc-300">{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-[3px] disabled:opacity-30"
      />
    </div>
  )
}

export function GrainVignette({
  grainAmount, vignetteAmount, vignetteFeather,
  onGrain, onVignette, hasImage,
}: GrainVignetteProps) {
  return (
    <div className="space-y-3">
      {/* Film Grain */}
      <div>
        <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1.5">Film Grain</p>
        <LabeledSlider
          label="📽 Amount" value={grainAmount} min={0} max={100}
          disabled={!hasImage} onChange={onGrain}
        />
      </div>

      {/* Vignette */}
      <div>
        <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1.5">Vignette</p>
        <LabeledSlider
          label="⬛ Amount" value={vignetteAmount} min={0} max={100}
          disabled={!hasImage}
          onChange={v => onVignette(v, vignetteFeather)}
        />
        <LabeledSlider
          label="🌫 Feather" value={vignetteFeather} min={0} max={100}
          disabled={!hasImage || vignetteAmount === 0}
          onChange={v => onVignette(vignetteAmount, v)}
        />
      </div>
    </div>
  )
}
