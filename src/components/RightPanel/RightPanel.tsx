import React, { useState, useRef } from 'react'
import {
  RotateCw, FlipHorizontal, FlipVertical, Crop,
  Undo2, Redo2, RotateCcw, Download,
  SplitSquareHorizontal, Eye, Layers,
  ChevronDown, ChevronRight, Save, FolderOpen,
} from 'lucide-react'
import { ExportOptions, HslChannel, CurvePoint, RadialMaskConfig, GradientMaskConfig } from '../../types/editor'
import { ColorControls } from '../ColorControls/ColorControls'
import { GrainVignette } from '../GrainVignette/GrainVignette'
import { CurvesTool } from '../CurvesTool/CurvesTool'
import { Histogram } from '../Histogram/Histogram'
import { MaskTool } from '../MaskTool/MaskTool'
import { HighlightShadow } from '../HighlightShadow/HighlightShadow'
import { Vibrance } from '../Vibrance/Vibrance'
import { ClaritySharpness } from '../ClaritySharpness/ClaritySharpness'
import { SplitToning } from '../SplitToning/SplitToning'

type CurveChannel = 'master' | 'r' | 'g' | 'b'
interface HslValues { hue: number; sat: number; light: number }

interface RightPanelProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onReset: () => void
  onFlatten: () => void
  onRotate: (angle: number) => void
  onFlip: (direction: 'horizontal' | 'vertical') => void
  onCrop: () => void
  onExport: (options: ExportOptions) => void
  isCropping: boolean
  isFlattening: boolean
  operationCount: number
  zoom: number
  onZoomChange: (z: number) => void
  showComparison: boolean
  onToggleComparison: () => void
  holdPreview: boolean
  onHoldPreviewStart: () => void
  onHoldPreviewEnd: () => void
  hasImage: boolean
  // Color
  temperature: number
  tint: number
  hslMap: Partial<Record<HslChannel, HslValues>>
  onTemperature: (v: number) => void
  onTint: (v: number) => void
  onHsl: (channel: HslChannel, hue: number, sat: number, light: number) => void
  // Grain/Vignette
  grainAmount: number
  vignetteAmount: number
  vignetteFeather: number
  onGrain: (v: number) => void
  onVignette: (amount: number, feather: number) => void
  // Curves
  curves: Partial<Record<CurveChannel, CurvePoint[]>>
  onCurveChange: (channel: CurveChannel, points: CurvePoint[]) => void
  // Masks
  onAddRadialMask: (config: RadialMaskConfig) => void
  onAddGradientMask: (config: GradientMaskConfig) => void
  // Histogram
  histData: { r: Float32Array; g: Float32Array; b: Float32Array; luma: Float32Array } | null
  // Session
  onExportSession: () => void
  onImportSession: (file: File) => void
  // Highlight/Shadow
  highlights: number
  shadows: number
  onHighlightShadow: (highlights: number, shadows: number) => void
  // Vibrance
  vibrance: number
  onVibrance: (v: number) => void
  // Clarity/Sharpen
  clarity: number
  sharpenAmount: number
  sharpenRadius: number
  onClaritySharpness: (clarity: number, sharpenAmount: number, sharpenRadius: number) => void
  // Split Toning
  highlightHue: number
  highlightSat: number
  shadowHue: number
  shadowSat: number
  splitBalance: number
  onSplitToning: (hHue: number, hSat: number, sHue: number, sSat: number, balance: number) => void
}

export function RightPanel({
  canUndo, canRedo, onUndo, onRedo, onReset, onFlatten,
  onRotate, onFlip, onCrop, onExport,
  isCropping, isFlattening, operationCount,
  zoom, onZoomChange,
  showComparison, onToggleComparison,
  onHoldPreviewStart, onHoldPreviewEnd,
  hasImage,
  temperature, tint, hslMap, onTemperature, onTint, onHsl,
  grainAmount, vignetteAmount, vignetteFeather, onGrain, onVignette,
  curves, onCurveChange,
  onAddRadialMask, onAddGradientMask,
  histData,
  onExportSession, onImportSession,
  highlights, shadows, onHighlightShadow,
  vibrance, onVibrance,
  clarity, sharpenAmount, sharpenRadius, onClaritySharpness,
  highlightHue, highlightSat, shadowHue, shadowSat, splitBalance, onSplitToning,
}: RightPanelProps) {
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png')
  const [exportQuality, setExportQuality] = useState(0.92)
  const sessionImportRef = useRef<HTMLInputElement>(null)

  const btnBase = 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed'
  const btnPrimary = `${btnBase} bg-zinc-800 hover:bg-zinc-700 text-zinc-200`
  const btnActive = `${btnBase} bg-indigo-600 hover:bg-indigo-500 text-white`
  const btnDanger = `${btnBase} bg-red-900/40 hover:bg-red-800/60 text-red-300`

  return (
    <div className="w-[220px] min-w-[220px] bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-y-auto">

      {/* Histogram */}
      <Section title="Histogram">
        <Histogram data={histData} />
      </Section>

      {/* Transform */}
      <Section title="Transform">
        <div className="grid grid-cols-2 gap-1.5">
          <button className={btnPrimary} onClick={() => onRotate(90)} disabled={!hasImage} title="Rotate 90° CW">
            <RotateCw size={14} /><span>CW 90°</span>
          </button>
          <button className={btnPrimary} onClick={() => onRotate(-90)} disabled={!hasImage} title="Rotate 90° CCW">
            <RotateCcw size={14} /><span>CCW 90°</span>
          </button>
          <button className={btnPrimary} onClick={() => onFlip('horizontal')} disabled={!hasImage}>
            <FlipHorizontal size={14} /><span>Flip H</span>
          </button>
          <button className={btnPrimary} onClick={() => onFlip('vertical')} disabled={!hasImage}>
            <FlipVertical size={14} /><span>Flip V</span>
          </button>
        </div>
        <button className={`w-full ${isCropping ? btnActive : btnPrimary} mt-1.5`} onClick={onCrop} disabled={!hasImage}>
          <Crop size={14} /><span>{isCropping ? 'Cropping…' : 'Crop'}</span>
        </button>
      </Section>

      {/* Highlight & Shadow */}
      <CollapsibleSection title="Highlights & Shadows">
        <HighlightShadow
          highlights={highlights} shadows={shadows}
          onChange={onHighlightShadow} hasImage={hasImage}
        />
      </CollapsibleSection>

      {/* Vibrance */}
      <CollapsibleSection title="Vibrance">
        <Vibrance vibrance={vibrance} onChange={onVibrance} hasImage={hasImage} />
      </CollapsibleSection>

      {/* Color Controls */}
      <CollapsibleSection title="Color" defaultOpen>
        <ColorControls
          temperature={temperature} tint={tint} hslMap={hslMap}
          onTemperature={onTemperature} onTint={onTint} onHsl={onHsl}
          hasImage={hasImage}
        />
      </CollapsibleSection>

      {/* Curves */}
      <CollapsibleSection title="Curves">
        <CurvesTool curves={curves} onCurveChange={onCurveChange} hasImage={hasImage} />
      </CollapsibleSection>

      {/* Clarity & Sharpen */}
      <CollapsibleSection title="Clarity & Sharpness">
        <ClaritySharpness
          clarity={clarity} sharpenAmount={sharpenAmount} sharpenRadius={sharpenRadius}
          onChange={onClaritySharpness} hasImage={hasImage}
        />
      </CollapsibleSection>

      {/* Split Toning */}
      <CollapsibleSection title="Split Toning">
        <SplitToning
          highlightHue={highlightHue} highlightSat={highlightSat}
          shadowHue={shadowHue} shadowSat={shadowSat} balance={splitBalance}
          onChange={onSplitToning} hasImage={hasImage}
        />
      </CollapsibleSection>

      {/* Grain & Vignette */}
      <CollapsibleSection title="Grain & Vignette">
        <GrainVignette
          grainAmount={grainAmount} vignetteAmount={vignetteAmount} vignetteFeather={vignetteFeather}
          onGrain={onGrain} onVignette={onVignette} hasImage={hasImage}
        />
      </CollapsibleSection>

      {/* Masks */}
      <CollapsibleSection title="Masks">
        <MaskTool onAddRadialMask={onAddRadialMask} onAddGradientMask={onAddGradientMask} hasImage={hasImage} />
      </CollapsibleSection>

      {/* History */}
      <Section title="History">
        <div className="flex gap-1.5">
          <button className={`flex-1 ${btnPrimary}`} onClick={onUndo} disabled={!canUndo}>
            <Undo2 size={14} /><span>Undo</span>
          </button>
          <button className={`flex-1 ${btnPrimary}`} onClick={onRedo} disabled={!canRedo}>
            <Redo2 size={14} /><span>Redo</span>
          </button>
        </div>
        <p className="text-[10px] text-zinc-600 mt-1">Ctrl+Z / Ctrl+Shift+Z</p>
        {hasImage && (
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-[10px] text-zinc-600">Operations</span>
            <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
              operationCount >= 90 ? 'bg-orange-900/50 text-orange-400' : 'bg-zinc-800 text-zinc-400'
            }`}>{operationCount} / 100</span>
          </div>
        )}
        <button className={`w-full ${btnDanger} mt-1.5`} onClick={onReset} disabled={!hasImage}>
          <RotateCcw size={14} /><span>Reset All</span>
        </button>
        <button
          className={`w-full ${btnBase} mt-1.5 bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 disabled:opacity-30 justify-start`}
          onClick={onFlatten}
          disabled={!hasImage || isFlattening || operationCount === 0}
          title="Merge current edits into a new base image and reset history."
        >
          <Layers size={14} /><span>{isFlattening ? 'Flattening…' : 'Apply & Flatten'}</span>
        </button>
        <p className="text-[10px] text-zinc-600 mt-1 leading-tight">Merges edits into base image. Clears history.</p>
      </Section>

      {/* Compare */}
      <Section title="Compare">
        <button className={`w-full ${showComparison ? btnActive : btnPrimary}`} onClick={onToggleComparison} disabled={!hasImage}>
          <SplitSquareHorizontal size={14} /><span>{showComparison ? 'Hide Compare' : 'Compare'}</span>
        </button>
        <button
          className={`w-full ${btnPrimary} mt-1.5`}
          onMouseDown={onHoldPreviewStart} onMouseUp={onHoldPreviewEnd} onMouseLeave={onHoldPreviewEnd}
          disabled={!hasImage}
        >
          <Eye size={14} /><span>Hold to Preview</span>
        </button>
      </Section>

      {/* Zoom */}
      <Section title="Zoom">
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-lg leading-none"
            onClick={() => onZoomChange(Math.max(0.1, zoom - 0.1))}>−</button>
          <div className="flex-1 text-center text-xs text-zinc-300 font-mono">{Math.round(zoom * 100)}%</div>
          <button className="w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-lg leading-none"
            onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}>+</button>
        </div>
        <button className="w-full text-xs text-zinc-500 hover:text-zinc-300 mt-1 transition-colors" onClick={() => onZoomChange(1)}>
          Reset zoom
        </button>
      </Section>

      {/* Session */}
      <Section title="Session">
        <div className="flex flex-col gap-1.5">
          <button
            className={`w-full ${btnPrimary} justify-start`}
            onClick={onExportSession}
            disabled={!hasImage || operationCount === 0}
          >
            <Save size={14} /><span>Export Session</span>
          </button>
          <button
            className={`w-full ${btnPrimary} justify-start`}
            onClick={() => sessionImportRef.current?.click()}
            disabled={!hasImage}
          >
            <FolderOpen size={14} /><span>Import Session</span>
          </button>
          <input
            ref={sessionImportRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) { onImportSession(f); e.target.value = '' }
            }}
          />
          <p className="text-[9px] text-zinc-600 leading-tight">
            Save / restore your editing workflow as JSON.
          </p>
        </div>
      </Section>

      {/* Export */}
      <Section title="Export Image">
        <div className="flex gap-1.5 mb-2">
          <button onClick={() => setExportFormat('png')} className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${exportFormat === 'png' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>PNG</button>
          <button onClick={() => setExportFormat('jpeg')} className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${exportFormat === 'jpeg' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>JPG</button>
        </div>
        {exportFormat === 'jpeg' && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Quality</span>
              <span className="font-mono">{Math.round(exportQuality * 100)}%</span>
            </div>
            <input type="range" min={50} max={100} value={Math.round(exportQuality * 100)}
              onChange={e => setExportQuality(Number(e.target.value) / 100)} className="w-full" />
          </div>
        )}
        <button
          className={`w-full ${btnPrimary} justify-center bg-indigo-700 hover:bg-indigo-600`}
          onClick={() => onExport({ format: exportFormat, quality: exportQuality })}
          disabled={!hasImage}
        >
          <Download size={14} /><span>Download {exportFormat.toUpperCase()}</span>
        </button>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-3 py-3 border-b border-zinc-800">
      <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  )
}

function CollapsibleSection({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-zinc-800">
      <button
        className="w-full flex items-center justify-between px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span>{title}</span>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

