interface SplitToningProps {
  highlightHue: number
  highlightSat: number
  shadowHue: number
  shadowSat: number
  balance: number
  onChange: (highlightHue: number, highlightSat: number, shadowHue: number, shadowSat: number, balance: number) => void
  hasImage: boolean
}

export function SplitToning({
  highlightHue, highlightSat, shadowHue, shadowSat, balance, onChange, hasImage
}: SplitToningProps) {
  const row = 'flex flex-col gap-0.5 mb-2'
  const labelRow = 'flex justify-between text-[10px] text-zinc-400'
  const slider = 'w-full accent-indigo-500 disabled:opacity-30'

  const huePreview = (hue: number, sat: number) => {
    if (sat === 0) return 'transparent'
    return `hsl(${hue}, ${sat}%, 50%)`
  }

  return (
    <div className="flex flex-col">
      {/* Highlights */}
      <p className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Highlights</p>
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-4 h-4 rounded-full border border-zinc-700 flex-shrink-0"
          style={{ background: huePreview(highlightHue, highlightSat) }}
        />
        <div className="flex-1">
          <div className={row} style={{ marginBottom: 4 }}>
            <div className={labelRow}>
              <span>Hue</span>
              <span className="font-mono text-zinc-300">{highlightHue}°</span>
            </div>
            <input
              type="range" min={0} max={360} value={highlightHue}
              disabled={!hasImage} className={slider}
              style={{ accentColor: `hsl(${highlightHue},70%,55%)` }}
              onChange={e => onChange(Number(e.target.value), highlightSat, shadowHue, shadowSat, balance)}
            />
          </div>
          <div className={row}>
            <div className={labelRow}>
              <span>Saturation</span>
              <span className="font-mono text-zinc-300">{highlightSat}</span>
            </div>
            <input
              type="range" min={0} max={100} value={highlightSat}
              disabled={!hasImage} className={slider}
              onChange={e => onChange(highlightHue, Number(e.target.value), shadowHue, shadowSat, balance)}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 my-1.5" />

      {/* Shadows */}
      <p className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Shadows</p>
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-4 h-4 rounded-full border border-zinc-700 flex-shrink-0"
          style={{ background: huePreview(shadowHue, shadowSat) }}
        />
        <div className="flex-1">
          <div className={row} style={{ marginBottom: 4 }}>
            <div className={labelRow}>
              <span>Hue</span>
              <span className="font-mono text-zinc-300">{shadowHue}°</span>
            </div>
            <input
              type="range" min={0} max={360} value={shadowHue}
              disabled={!hasImage} className={slider}
              style={{ accentColor: `hsl(${shadowHue},70%,55%)` }}
              onChange={e => onChange(highlightHue, highlightSat, Number(e.target.value), shadowSat, balance)}
            />
          </div>
          <div className={row}>
            <div className={labelRow}>
              <span>Saturation</span>
              <span className="font-mono text-zinc-300">{shadowSat}</span>
            </div>
            <input
              type="range" min={0} max={100} value={shadowSat}
              disabled={!hasImage} className={slider}
              onChange={e => onChange(highlightHue, highlightSat, shadowHue, Number(e.target.value), balance)}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 my-1.5" />

      {/* Balance */}
      <div className={row}>
        <div className={labelRow}>
          <span>Balance</span>
          <span className="font-mono text-zinc-300">{balance > 0 ? '+' : ''}{balance}</span>
        </div>
        <input
          type="range" min={-100} max={100} value={balance}
          disabled={!hasImage} className={slider}
          onChange={e => onChange(highlightHue, highlightSat, shadowHue, shadowSat, Number(e.target.value))}
        />
      </div>

      <button
        className="text-[10px] text-zinc-600 hover:text-zinc-400 mt-0.5 text-left transition-colors disabled:opacity-30"
        disabled={!hasImage || (highlightSat === 0 && shadowSat === 0 && balance === 0)}
        onClick={() => onChange(0, 0, 0, 0, 0)}
      >
        Reset
      </button>
    </div>
  )
}
