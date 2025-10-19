'use client'

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'

// Modern red-based color scheme
const customConfig = {
  ...defaultConfig,
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: '#fef2f2' },
          100: { value: '#fee2e2' },
          200: { value: '#fecaca' },
          300: { value: '#fca5a5' },
          400: { value: '#f87171' },
          500: { value: '#ef4444' },
          600: { value: '#dc2626' },
          700: { value: '#b91c1c' },
          800: { value: '#991b1b' },
          900: { value: '#7f1d1d' },
          950: { value: '#450a0a' },
        },
        accent: {
          50: { value: '#fff1f2' },
          100: { value: '#ffe4e6' },
          200: { value: '#fecdd3' },
          300: { value: '#fda4af' },
          400: { value: '#fb7185' },
          500: { value: '#f43f5e' },
          600: { value: '#e11d48' },
          700: { value: '#be123c' },
          800: { value: '#9f1239' },
          900: { value: '#881337' },
          950: { value: '#4c0519' },
        },
      },
    },
  },
}

const system = createSystem(customConfig)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      {children}
    </ChakraProvider>
  )
}
