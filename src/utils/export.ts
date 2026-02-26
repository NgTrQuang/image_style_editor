import { ExportOptions } from '../types/editor'

export function exportCanvas(canvas: HTMLCanvasElement, options: ExportOptions): void {
  const dataUrl =
    options.format === 'png'
      ? canvas.toDataURL('image/png')
      : canvas.toDataURL('image/jpeg', options.quality)

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `edited-image.${options.format === 'png' ? 'png' : 'jpg'}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
