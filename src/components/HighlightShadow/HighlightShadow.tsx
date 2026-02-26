interface HighlightShadowProps {
  highlights: number
  shadows: number
  onChange: (highlights: number, shadows: number) => void
  hasImage: boolean
}

export function HighlightShadow({ highlights, shadows, onChange, hasImage }: HighlightShadowProps) {
  const row = 'flex flex-col gap-0.5 mb-2'
  const label = 'flex justify-between text-[10px] text-zinc-400'
  const slider = 'w-full accent-indigo-500 disabled:opacity-30'

  return (
    <div className="flex flex-col">
      <div className={row}>
        <div className={label}>
          <span>Highlights</span>
          <span className="font-mono text-zinc-300">{highlights > 0 ? '+' : ''}{highlights}</span>
        </div>
        <input
          type="range" min={-100} max={100} value={highlights}
          disabled={!hasImage}
          className={slider}
          onChange={e => onChange(Number(e.target.value), shadows)}
        />
      </div>
      <div className={row}>
        <div className={label}>
          <span>Shadows</span>
          <span className="font-mono text-zinc-300">{shadows > 0 ? '+' : ''}{shadows}</span>
        </div>
        <input
          type="range" min={-100} max={100} value={shadows}
          disabled={!hasImage}
          className={slider}
          onChange={e => onChange(highlights, Number(e.target.value))}
        />
      </div>
      <button
        className="text-[10px] text-zinc-600 hover:text-zinc-400 mt-0.5 text-left transition-colors disabled:opacity-30"
        disabled={!hasImage || (highlights === 0 && shadows === 0)}
        onClick={() => onChange(0, 0)}
      >
        Reset
      </button>
    </div>
  )
}
