import { useState } from 'react'
import { Preset } from '../../types/editor'
import { PRESETS, PRESET_CATEGORIES } from '../../data/presets'
import { PresetCard } from './PresetCard'

interface LeftPanelProps {
  selectedPresetId: string | null
  intensityMap: Record<string, number>
  onSelectPreset: (preset: Preset, intensity: number) => void
  onIntensityChange: (presetId: string, value: number) => void
  originalImage: HTMLImageElement | null
}

const CATEGORY_ICONS: Record<string, string> = {
  'Cinematic': '🎬',
  'Vintage': '📷',
  'Portrait': '👤',
  'Landscape': '🌿',
  'Dark Mood': '🌑',
  'Urban': '🏙️',
  'Dreamy': '✨',
}

export function LeftPanel({
  selectedPresetId,
  intensityMap,
  onSelectPreset,
  onIntensityChange,
  originalImage,
}: LeftPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Cinematic')

  const filteredPresets = PRESETS.filter(p => p.category === activeCategory)
  const currentIntensity = selectedPresetId ? (intensityMap[selectedPresetId] ?? 100) : 100

  return (
    <div className="w-[230px] min-w-[230px] bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Style Presets</h2>
        <span className="text-[10px] text-zinc-600">35 styles</span>
      </div>

      {/* Category tabs */}
      <div className="px-2 py-2 flex flex-col gap-0.5 shrink-0">
        {PRESET_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center gap-2 ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span>{cat}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-zinc-800 mx-3 shrink-0" />

      {/* Preset grid */}
      <div className="flex-1 overflow-y-auto px-2 py-2 min-h-0">
        <div className="grid grid-cols-2 gap-1">
          {filteredPresets.map(preset => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={selectedPresetId === preset.id}
              intensity={intensityMap[preset.id] ?? 100}
              onSelect={p => onSelectPreset(p, intensityMap[p.id] ?? 100)}
              onIntensityChange={onIntensityChange}
              originalImage={originalImage}
            />
          ))}
        </div>
      </div>

      {/* Active preset intensity summary */}
      {selectedPresetId && (
        <div className="px-4 py-3 border-t border-zinc-800 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Active Intensity</span>
            <span className="text-xs text-indigo-400 font-mono font-semibold">{currentIntensity}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-100"
              style={{ width: `${currentIntensity}%` }}
            />
          </div>
          <p className="text-[9px] text-zinc-600 mt-1.5">Drag the slider on the selected preset card</p>
        </div>
      )}
    </div>
  )
}
