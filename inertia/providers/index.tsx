import React from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '@/components/ui/sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="task-manager-theme">
      <Toaster richColors closeButton />
      {children}
    </ThemeProvider>
  )
}
