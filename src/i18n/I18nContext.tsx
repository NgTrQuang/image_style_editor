import { createContext, useContext, useState, ReactNode } from 'react'
import en from './locales/en'
import vi from './locales/vi'
import type { TranslationKeys } from './locales/en'

export type Locale = 'en' | 'vi'

const locales = { en, vi }

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKeys) => string
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => en[key],
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('ise_locale')
    return (saved === 'vi' || saved === 'en') ? saved : 'en'
  })

  const handleSetLocale = (l: Locale) => {
    setLocale(l)
    localStorage.setItem('ise_locale', l)
  }

  const t = (key: TranslationKeys): string => locales[locale][key] ?? en[key]

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useT() {
  return useContext(I18nContext)
}
