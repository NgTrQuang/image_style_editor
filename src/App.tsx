import { useRef, useState, useCallback, useEffect } from 'react'
import { useEditorState } from './hooks/useEditorState'
import { Header } from './components/Header/Header'
import { LeftPanel } from './components/LeftPanel/LeftPanel'
import { CanvasWorkspace } from './components/Canvas/CanvasWorkspace'
import { RightPanel } from './components/RightPanel/RightPanel'
import { exportCanvas } from './utils/export'
import { renderToCanvas, computeHistogram } from './utils/renderer'
import { exportSession, importSession } from './utils/session'
import {
  Preset, ExportOptions, HslChannel, CurvePoint,
  RadialMaskConfig, GradientMaskConfig,
} from './types/editor'

type CurveChannel = 'master' | 'r' | 'g' | 'b'
interface HslValues { hue: number; sat: number; light: number }

export default function App() {
  const { state, setImage, pushOperation, undo, redo, reset, setFlattening, flatten, importSession: importOps, canUndo, canRedo } = useEditorState()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intensityRafRef = useRef<number | null>(null)
  const colorRafRef = useRef<number | null>(null)

  // ── Preset / basic state ──────────────────────────────────────────────────
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [intensityMap, setIntensityMap] = useState<Record<string, number>>({})
  const [zoom, setZoom] = useState(1)
  const [isCropping, setIsCropping] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [holdPreview, setHoldPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Color controls state ──────────────────────────────────────────────────
  const [temperature, setTemperature] = useState(0)
  const [tint, setTint] = useState(0)
  const [hslMap, setHslMap] = useState<Partial<Record<HslChannel, HslValues>>>({})

  // ── Grain / Vignette state ────────────────────────────────────────────────
  const [grainAmount, setGrainAmount] = useState(0)
  const [vignetteAmount, setVignetteAmount] = useState(0)
  const [vignetteFeather, setVignetteFeather] = useState(50)

  // ── Curves state ─────────────────────────────────────────────────────────
  const [curves, setCurves] = useState<Partial<Record<CurveChannel, CurvePoint[]>>>({})

  // ── Highlight/Shadow state ────────────────────────────────────────────────
  const [highlights, setHighlights] = useState(0)
  const [shadows, setShadows] = useState(0)

  // ── Vibrance state ────────────────────────────────────────────────────────
  const [vibrance, setVibrance] = useState(0)

  // ── Clarity/Sharpen state ─────────────────────────────────────────────────
  const [clarity, setClarity] = useState(0)
  const [sharpenAmount, setSharpenAmount] = useState(0)
  const [sharpenRadius, setSharpenRadius] = useState(2)

  // ── Split Toning state ────────────────────────────────────────────────────
  const [highlightHue, setHighlightHue] = useState(0)
  const [highlightSat, setHighlightSat] = useState(0)
  const [shadowHue, setShadowHue] = useState(0)
  const [shadowSat, setShadowSat] = useState(0)
  const [splitBalance, setSplitBalance] = useState(0)

  // ── Histogram ─────────────────────────────────────────────────────────────
  const [histData, setHistData] = useState<ReturnType<typeof computeHistogram>>(null)

  // ── Image load ────────────────────────────────────────────────────────────
  const handleImageLoad = useCallback(
    (image: HTMLImageElement) => {
      setImage(image)
      setSelectedPresetId(null)
      setIntensityMap({})
      setZoom(1)
      setIsCropping(false)
      setShowComparison(false)
      setError(null)
      setTemperature(0); setTint(0); setHslMap({})
      setGrainAmount(0); setVignetteAmount(0); setVignetteFeather(50)
      setCurves({})
      setHighlights(0); setShadows(0)
      setVibrance(0)
      setClarity(0); setSharpenAmount(0); setSharpenRadius(2)
      setHighlightHue(0); setHighlightSat(0); setShadowHue(0); setShadowSat(0); setSplitBalance(0)
    },
    [setImage]
  )

  // ── Preset handlers ───────────────────────────────────────────────────────
  const handleSelectPreset = useCallback(
    (preset: Preset, intensity: number) => {
      setSelectedPresetId(preset.id)
      pushOperation({ type: 'preset', presetId: preset.id, intensity })
    },
    [pushOperation]
  )

  const handleIntensityChange = useCallback(
    (presetId: string, value: number) => {
      setIntensityMap(prev => ({ ...prev, [presetId]: value }))
      if (presetId !== selectedPresetId) return
      if (intensityRafRef.current !== null) cancelAnimationFrame(intensityRafRef.current)
      intensityRafRef.current = requestAnimationFrame(() => {
        pushOperation({ type: 'preset', presetId, intensity: value })
        intensityRafRef.current = null
      })
    },
    [selectedPresetId, pushOperation]
  )

  // ── Transform handlers ────────────────────────────────────────────────────
  const handleRotate = useCallback(
    (angle: number) => { pushOperation({ type: 'rotate', angle }) },
    [pushOperation]
  )

  const handleFlip = useCallback(
    (direction: 'horizontal' | 'vertical') => { pushOperation({ type: 'flip', direction }) },
    [pushOperation]
  )

  const handleCropApply = useCallback(
    (x: number, y: number, w: number, h: number) => {
      pushOperation({ type: 'crop', x, y, width: w, height: h })
      setIsCropping(false)
    },
    [pushOperation]
  )

  // ── Color control handlers (rAF debounced) ────────────────────────────────
  const debounceColorOp = useCallback((fn: () => void) => {
    if (colorRafRef.current !== null) cancelAnimationFrame(colorRafRef.current)
    colorRafRef.current = requestAnimationFrame(() => { fn(); colorRafRef.current = null })
  }, [])

  const handleTemperature = useCallback((v: number) => {
    setTemperature(v)
    debounceColorOp(() => pushOperation({ type: 'temperature', value: v }))
  }, [debounceColorOp, pushOperation])

  const handleTint = useCallback((v: number) => {
    setTint(v)
    debounceColorOp(() => pushOperation({ type: 'tint', value: v }))
  }, [debounceColorOp, pushOperation])

  const handleHsl = useCallback((channel: HslChannel, hue: number, sat: number, light: number) => {
    setHslMap(prev => ({ ...prev, [channel]: { hue, sat, light } }))
    debounceColorOp(() => pushOperation({ type: 'hsl', channel, hue, sat, light }))
  }, [debounceColorOp, pushOperation])

  // ── Grain / Vignette handlers ─────────────────────────────────────────────
  const handleGrain = useCallback((amount: number) => {
    setGrainAmount(amount)
    debounceColorOp(() => pushOperation({ type: 'grain', amount }))
  }, [debounceColorOp, pushOperation])

  const handleVignette = useCallback((amount: number, feather: number) => {
    setVignetteAmount(amount)
    setVignetteFeather(feather)
    debounceColorOp(() => pushOperation({ type: 'vignette', amount, feather }))
  }, [debounceColorOp, pushOperation])

  // ── Curves handler ────────────────────────────────────────────────────────
  const handleCurveChange = useCallback((channel: CurveChannel, points: CurvePoint[]) => {
    setCurves(prev => ({ ...prev, [channel]: points }))
    debounceColorOp(() => pushOperation({ type: 'curve', channel, points }))
  }, [debounceColorOp, pushOperation])

  // ── Highlight/Shadow handler ──────────────────────────────────────────────
  const handleHighlightShadow = useCallback((h: number, s: number) => {
    setHighlights(h); setShadows(s)
    debounceColorOp(() => pushOperation({ type: 'highlightShadow', highlights: h, shadows: s }))
  }, [debounceColorOp, pushOperation])

  // ── Vibrance handler ──────────────────────────────────────────────────────
  const handleVibrance = useCallback((v: number) => {
    setVibrance(v)
    debounceColorOp(() => pushOperation({ type: 'vibrance', amount: v }))
  }, [debounceColorOp, pushOperation])

  // ── Clarity/Sharpen handler ───────────────────────────────────────────────
  const handleClaritySharpness = useCallback((c: number, sa: number, sr: number) => {
    setClarity(c); setSharpenAmount(sa); setSharpenRadius(sr)
    debounceColorOp(() => {
      pushOperation({ type: 'clarity', amount: c })
      if (sa > 0) pushOperation({ type: 'sharpen', amount: sa, radius: sr })
    })
  }, [debounceColorOp, pushOperation])

  // ── Split Toning handler ──────────────────────────────────────────────────
  const handleSplitToning = useCallback((
    hHue: number, hSat: number, sHue: number, sSat: number, bal: number
  ) => {
    setHighlightHue(hHue); setHighlightSat(hSat)
    setShadowHue(sHue); setShadowSat(sSat); setSplitBalance(bal)
    debounceColorOp(() => pushOperation({
      type: 'splitToning',
      highlightHue: hHue, highlightSat: hSat,
      shadowHue: sHue, shadowSat: sSat, balance: bal,
    }))
  }, [debounceColorOp, pushOperation])

  // ── Mask handlers ─────────────────────────────────────────────────────────
  const handleAddRadialMask = useCallback((config: RadialMaskConfig) => {
    pushOperation({ type: 'radialMask', config })
  }, [pushOperation])

  const handleAddGradientMask = useCallback((config: GradientMaskConfig) => {
    pushOperation({ type: 'gradientMask', config })
  }, [pushOperation])

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = useCallback(
    (options: ExportOptions) => {
      if (!canvasRef.current || !state.originalImage) return
      exportCanvas(canvasRef.current, options)
    },
    [state.originalImage]
  )

  // ── Session export ────────────────────────────────────────────────────────
  const handleExportSession = useCallback(() => {
    if (!state.originalImage) return
    const w = state.originalImage.naturalWidth || state.originalImage.width
    const h = state.originalImage.naturalHeight || state.originalImage.height
    exportSession(state.operations, state.historyIndex, w, h)
  }, [state.originalImage, state.operations, state.historyIndex])

  // ── Session import ────────────────────────────────────────────────────────
  const handleImportSession = useCallback((file: File) => {
    if (!state.originalImage) {
      setError('Please load an image first before importing a session.')
      return
    }
    const w = state.originalImage.naturalWidth || state.originalImage.width
    const h = state.originalImage.naturalHeight || state.originalImage.height
    importSession(file, w, h)
      .then(ops => {
        importOps(ops)
        setSelectedPresetId(null)
        setIntensityMap({})
        setTemperature(0); setTint(0); setHslMap({})
        setGrainAmount(0); setVignetteAmount(0); setVignetteFeather(50)
        setCurves({})
        setHighlights(0); setShadows(0)
        setVibrance(0)
        setClarity(0); setSharpenAmount(0); setSharpenRadius(2)
        setHighlightHue(0); setHighlightSat(0); setShadowHue(0); setShadowSat(0); setSplitBalance(0)
      })
      .catch(err => setError(err.message))
  }, [state.originalImage, importOps])

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    reset()
    setSelectedPresetId(null)
    setIntensityMap({})
    setIsCropping(false)
    setShowComparison(false)
    setTemperature(0); setTint(0); setHslMap({})
    setGrainAmount(0); setVignetteAmount(0); setVignetteFeather(50)
    setCurves({})
    setHighlights(0); setShadows(0)
    setVibrance(0)
    setClarity(0); setSharpenAmount(0); setSharpenRadius(2)
    setHighlightHue(0); setHighlightSat(0); setShadowHue(0); setShadowSat(0); setSplitBalance(0)
    if (state.originalImage && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!
      const w = state.originalImage.naturalWidth || state.originalImage.width
      const h = state.originalImage.naturalHeight || state.originalImage.height
      canvas.width = w; canvas.height = h
      ctx.drawImage(state.originalImage, 0, 0)
    }
  }, [reset, state.originalImage])

  // ── Flatten ───────────────────────────────────────────────────────────────
  const handleFlatten = useCallback(() => {
    if (!canvasRef.current || !state.originalImage || state.isFlattening) return
    const confirmed = window.confirm(
      'Flattening will merge current edits into a new base image and reset undo history.\n\nContinue?'
    )
    if (!confirmed) return
    setFlattening(true)
    const dataURL = canvasRef.current.toDataURL('image/png')
    const newImage = new Image()
    newImage.onload = () => {
      flatten(newImage)
      setSelectedPresetId(null); setIntensityMap({})
      setIsCropping(false); setShowComparison(false)
      setTemperature(0); setTint(0); setHslMap({})
      setGrainAmount(0); setVignetteAmount(0); setVignetteFeather(50)
      setCurves({})
      setHighlights(0); setShadows(0)
      setVibrance(0)
      setClarity(0); setSharpenAmount(0); setSharpenRadius(2)
      setHighlightHue(0); setHighlightSat(0); setShadowHue(0); setShadowSat(0); setSplitBalance(0)
    }
    newImage.onerror = () => { setFlattening(false); setError('Flatten failed. Please try again.') }
    newImage.src = dataURL
  }, [state.originalImage, state.isFlattening, setFlattening, flatten])

  // ── Re-render canvas ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!state.originalImage || !canvasRef.current) return
    const raf = requestAnimationFrame(() => {
      if (canvasRef.current && state.originalImage) {
        renderToCanvas(canvasRef.current, state.originalImage, state.operations, state.historyIndex)
        // Update histogram after render
        setHistData(computeHistogram(canvasRef.current))
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [state.originalImage, state.operations, state.historyIndex])

  const operationCount = state.historyIndex + 1

  return (
    <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden">
      <Header
        onImageLoad={handleImageLoad}
        onError={setError}
        hasImage={!!state.originalImage}
      />

      {error && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-red-900 border border-red-700 text-red-200 text-sm px-4 py-2 rounded-lg shadow-xl fade-in flex items-center gap-3 max-w-sm text-center">
          <span className="whitespace-pre-line">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200 font-bold flex-shrink-0">×</button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          selectedPresetId={selectedPresetId}
          intensityMap={intensityMap}
          onSelectPreset={handleSelectPreset}
          onIntensityChange={handleIntensityChange}
          originalImage={state.originalImage}
        />

        <CanvasWorkspace
          image={state.originalImage}
          operations={state.operations}
          historyIndex={state.historyIndex}
          zoom={zoom}
          onZoomChange={setZoom}
          isCropping={isCropping}
          onCropApply={handleCropApply}
          onCropCancel={() => setIsCropping(false)}
          showComparison={showComparison}
          holdPreview={holdPreview}
          canvasRef={canvasRef}
        />

        <RightPanel
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onReset={handleReset}
          onFlatten={handleFlatten}
          onRotate={handleRotate}
          onFlip={handleFlip}
          onCrop={() => setIsCropping(prev => !prev)}
          onExport={handleExport}
          isCropping={isCropping}
          isFlattening={state.isFlattening}
          operationCount={operationCount}
          zoom={zoom}
          onZoomChange={setZoom}
          showComparison={showComparison}
          onToggleComparison={() => setShowComparison(prev => !prev)}
          holdPreview={holdPreview}
          onHoldPreviewStart={() => setHoldPreview(true)}
          onHoldPreviewEnd={() => setHoldPreview(false)}
          hasImage={!!state.originalImage}
          // Color
          temperature={temperature}
          tint={tint}
          hslMap={hslMap}
          onTemperature={handleTemperature}
          onTint={handleTint}
          onHsl={handleHsl}
          // Grain/Vignette
          grainAmount={grainAmount}
          vignetteAmount={vignetteAmount}
          vignetteFeather={vignetteFeather}
          onGrain={handleGrain}
          onVignette={handleVignette}
          // Curves
          curves={curves}
          onCurveChange={handleCurveChange}
          // Masks
          onAddRadialMask={handleAddRadialMask}
          onAddGradientMask={handleAddGradientMask}
          // Highlight/Shadow
          highlights={highlights}
          shadows={shadows}
          onHighlightShadow={handleHighlightShadow}
          // Vibrance
          vibrance={vibrance}
          onVibrance={handleVibrance}
          // Clarity/Sharpen
          clarity={clarity}
          sharpenAmount={sharpenAmount}
          sharpenRadius={sharpenRadius}
          onClaritySharpness={handleClaritySharpness}
          // Split Toning
          highlightHue={highlightHue}
          highlightSat={highlightSat}
          shadowHue={shadowHue}
          shadowSat={shadowSat}
          splitBalance={splitBalance}
          onSplitToning={handleSplitToning}
          // Histogram
          histData={histData}
          // Session
          onExportSession={handleExportSession}
          onImportSession={handleImportSession}
        />
      </div>
    </div>
  )
}
