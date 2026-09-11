import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'
type FontSize = 'sm' | 'md' | 'lg'

interface AppContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  fontSize: FontSize
  setFontSize: (f: FontSize) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [fontSize, setFontSize] = useState<FontSize>('md')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (fontSize === 'md') {
      delete document.documentElement.dataset.fontSize
    } else {
      document.documentElement.dataset.fontSize = fontSize
    }
  }, [fontSize])

  return (
    <AppContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
