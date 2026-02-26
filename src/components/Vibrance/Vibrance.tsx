interface VibranceProps {
  vibrance: number
  onChange: (v: number) => void
  hasImage: boolean
}

export function Vibrance({ vibrance, onChange, hasImage }: VibranceProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-0.5 mb-2">
        <div className="flex justify-between text-[10px] text-zinc-400">
          <span>Vibrance</span>
          <span className="font-mono text-zinc-300">{vibrance > 0 ? '+' : ''}{vibrance}</span>
        </div>
        <input
          type="range" min={-100} max={100} value={vibrance}
          disabled={!hasImage}
          className="w-full accent-indigo-500 disabled:opacity-30"
          onChange={e => onChange(Number(e.target.value))}
        />
      </div>
      <p className="text-[9px] text-zinc-600 leading-tight">
        Boosts low-saturated areas first. Preserves skin tones.
      </p>
      <button
        className="text-[10px] text-zinc-600 hover:text-zinc-400 mt-1 text-left transition-colors disabled:opacity-30"
        disabled={!hasImage || vibrance === 0}
        onClick={() => onChange(0)}
      >
        Reset
      </button>
    </div>
  )
}
