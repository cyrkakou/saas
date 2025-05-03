'use client'

import { useState } from 'react'
import Link from 'next/link'
import { theme as defaultTheme } from '@/lib/theme'

export default function ThemeCustomizer() {
  const [primaryColor, setPrimaryColor] = useState('#6366f1') // Default indigo-500
  const [secondaryColor, setSecondaryColor] = useState('#64748b') // Default slate-500
  const [cssVariables, setCssVariables] = useState('')

  // Function to generate a color palette from a base color
  const generateColorPalette = (baseColor: string) => {
    // This is a simplified version - in a real app, you'd use a proper color manipulation library
    const lighten = (color: string, amount: number) => {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      
      const lightenColor = (c: number) => Math.min(255, Math.floor(c + (255 - c) * amount))
      
      const rNew = lightenColor(r).toString(16).padStart(2, '0')
      const gNew = lightenColor(g).toString(16).padStart(2, '0')
      const bNew = lightenColor(b).toString(16).padStart(2, '0')
      
      return `#${rNew}${gNew}${bNew}`
    }
    
    const darken = (color: string, amount: number) => {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      
      const darkenColor = (c: number) => Math.max(0, Math.floor(c * (1 - amount)))
      
      const rNew = darkenColor(r).toString(16).padStart(2, '0')
      const gNew = darkenColor(g).toString(16).padStart(2, '0')
      const bNew = darkenColor(b).toString(16).padStart(2, '0')
      
      return `#${rNew}${gNew}${bNew}`
    }
    
    return {
      50: lighten(baseColor, 0.93),
      100: lighten(baseColor, 0.85),
      200: lighten(baseColor, 0.75),
      300: lighten(baseColor, 0.55),
      400: lighten(baseColor, 0.25),
      500: baseColor,
      600: darken(baseColor, 0.10),
      700: darken(baseColor, 0.20),
      800: darken(baseColor, 0.30),
      900: darken(baseColor, 0.40),
      950: darken(baseColor, 0.50),
    }
  }

  const generateCssVariables = () => {
    const primaryPalette = generateColorPalette(primaryColor)
    const secondaryPalette = generateColorPalette(secondaryColor)
    
    let css = ':root {\n'
    
    // Primary colors
    Object.entries(primaryPalette).forEach(([key, value]) => {
      css += `  --primary-${key}: ${value};\n`
    })
    
    // Secondary colors
    Object.entries(secondaryPalette).forEach(([key, value]) => {
      css += `  --secondary-${key}: ${value};\n`
    })
    
    css += '}\n'
    
    setCssVariables(css)
    
    // Apply the theme to the current page
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      
      // Apply primary colors
      Object.entries(primaryPalette).forEach(([key, value]) => {
        root.style.setProperty(`--primary-${key}`, value)
      })
      
      // Apply secondary colors
      Object.entries(secondaryPalette).forEach(([key, value]) => {
        root.style.setProperty(`--secondary-${key}`, value)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Theme Customizer
          </h1>
          
          <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="primary-color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-10 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="secondary-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="secondary-color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-10 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={generateCssVariables}
              className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              Generate Theme
            </button>
          </div>
          
          {cssVariables && (
            <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                CSS Variables
              </h2>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
                {cssVariables}
              </pre>
              <p className="mt-4 text-sm text-gray-600">
                Copy these CSS variables to your globals.css file to apply this theme.
              </p>
            </div>
          )}
          
          <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Theme Preview
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary">Primary Button</button>
                  <button className="btn-secondary">Secondary Button</button>
                  <button className="btn-outline">Outline Button</button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Text Colors</h3>
                <div className="space-y-1">
                  <p className="text-primary-600">Primary Text</p>
                  <p className="text-secondary-600">Secondary Text</p>
                  <p className="text-gray-900">Default Text</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Background Colors</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 bg-primary-100 rounded-md flex items-center justify-center text-xs">primary-100</div>
                  <div className="h-10 bg-primary-300 rounded-md flex items-center justify-center text-xs">primary-300</div>
                  <div className="h-10 bg-primary-500 rounded-md flex items-center justify-center text-xs text-white">primary-500</div>
                  <div className="h-10 bg-primary-700 rounded-md flex items-center justify-center text-xs text-white">primary-700</div>
                  <div className="h-10 bg-primary-900 rounded-md flex items-center justify-center text-xs text-white">primary-900</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
