import React, { useRef } from 'react'
import { Upload, ImageIcon } from 'lucide-react'
import { useT } from '../../i18n/I18nContext'

interface HeaderProps {
  onImageLoad: (image: HTMLImageElement) => void
  onError: (msg: string) => void
  hasImage: boolean
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function Header({ onImageLoad, onError, hasImage }: HeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t, locale, setLocale } = useT()

  const handleFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError(t('errorInvalidType'))
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      onError(t('errorTooLarge'))
      return
    }

    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        // Auto-resize if wider than 2000px
        if (img.naturalWidth > 2000) {
          const canvas = document.createElement('canvas')
          const ratio = 2000 / img.naturalWidth
          canvas.width = 2000
          canvas.height = Math.round(img.naturalHeight * ratio)
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const resizedImg = new Image()
          resizedImg.onload = () => onImageLoad(resizedImg)
          resizedImg.src = canvas.toDataURL('image/png')
        } else {
          onImageLoad(img)
        }
      }
      img.onerror = () => onError(t('errorLoadFailed'))
      img.src = e.target!.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <header className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <ImageIcon size={14} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-zinc-100">{t('appName')}</span>
      </div>

      {/* Upload button */}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleInputChange}
      />
      <button
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
      >
        <Upload size={14} />
        <span>{hasImage ? t('changeImage') : t('uploadImage')}</span>
      </button>

      <span className="text-xs text-zinc-500">{t('fileHint')}</span>

      <div className="flex-1" />

      <span className="text-xs text-zinc-600 hidden sm:block">{t('tagline')}</span>

      {/* Language toggle */}
      <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5">
        <button
          onClick={() => setLocale('en')}
          className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
            locale === 'en'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLocale('vi')}
          className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
            locale === 'vi'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          VI
        </button>
      </div>
    </header>
  )
}
