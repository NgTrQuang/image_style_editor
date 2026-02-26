interface ClaritySharpnessProps {
  clarity: number
  sharpenAmount: number
  sharpenRadius: number
  onChange: (clarity: number, sharpenAmount: number, sharpenRadius: number) => void
  hasImage: boolean
}

export function ClaritySharpness({
  clarity, sharpenAmount, sharpenRadius, onChange, hasImage
}: ClaritySharpnessProps) {
  const row = 'flex flex-col gap-0.5 mb-2'
  const labelRow = 'flex justify-between text-[10px] text-zinc-400'
  const slider = 'w-full accent-indigo-500 disabled:opacity-30'

  return (
    <div className="flex flex-col">
      <div className={row}>
        <div className={labelRow}>
          <span>Clarity</span>
          <span className="font-mono text-zinc-300">{clarity > 0 ? '+' : ''}{clarity}</span>
        </div>
        <input
          type="range" min={-100} max={100} value={clarity}
          disabled={!hasImage} className={slider}
          onChange={e => onChange(Number(e.target.value), sharpenAmount, sharpenRadius)}
        />
      </div>

      <div className="border-t border-zinc-800 my-1.5" />

      <div className={row}>
        <div className={labelRow}>
          <span>Sharpen</span>
          <span className="font-mono text-zinc-300">{sharpenAmount}</span>
        </div>
        <input
          type="range" min={0} max={100} value={sharpenAmount}
          disabled={!hasImage} className={slider}
          onChange={e => onChange(clarity, Number(e.target.value), sharpenRadius)}
        />
      </div>
      <div className={row}>
        <div className={labelRow}>
          <span>Sharpen Radius</span>
          <span className="font-mono text-zinc-300">{sharpenRadius}px</span>
        </div>
        <input
          type="range" min={1} max={5} step={0.5} value={sharpenRadius}
          disabled={!hasImage || sharpenAmount === 0} className={slider}
          onChange={e => onChange(clarity, sharpenAmount, Number(e.target.value))}
        />
      </div>

      <button
        className="text-[10px] text-zinc-600 hover:text-zinc-400 mt-0.5 text-left transition-colors disabled:opacity-30"
        disabled={!hasImage || (clarity === 0 && sharpenAmount === 0)}
        onClick={() => onChange(0, 0, 2)}
      >
        Reset
      </button>
    </div>
  )
}
