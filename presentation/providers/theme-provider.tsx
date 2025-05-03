'use client'

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { theme as defaultTheme } from '@/lib/theme'

// Create a context for the theme
type ThemeContextType = {
  theme: typeof defaultTheme;
  setTheme?: (theme: typeof defaultTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: defaultTheme });

// Theme provider component
export function ThemeProvider({
  children,
  theme = defaultTheme
}: {
  children: ReactNode;
  theme?: typeof defaultTheme;
}) {
  const [mounted, setMounted] = useState(false)

  // Apply theme CSS variables to :root
  useEffect(() => {
    setMounted(true)

    const root = document.documentElement;

    // Apply primary colors
    Object.entries(theme.primary).forEach(([key, value]) => {
      root.style.setProperty(`--primary-${key}`, value);
    });

    // Apply secondary colors
    Object.entries(theme.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--secondary-${key}`, value);
    });

    // Apply other colors
    root.style.setProperty('--success', theme.success);
    root.style.setProperty('--warning', theme.warning);
    root.style.setProperty('--error', theme.error);

    // Apply text colors
    Object.entries(theme.text).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value);
    });

    // Apply background colors
    Object.entries(theme.background).forEach(([key, value]) => {
      root.style.setProperty(`--bg-${key}`, value);
    });

    // Apply border colors
    Object.entries(theme.border).forEach(([key, value]) => {
      root.style.setProperty(`--border-${key}`, value);
    });
  }, [theme])

  if (!mounted) {
    return null
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <ThemeContext.Provider value={{ theme }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

// Hook to use the theme
export function useTheme() {
  return useContext(ThemeContext);
}
