'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { AppLayout } from '@/presentation/components/shared/app-layout'
import { Sidebar } from '@/presentation/components/admin/sidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppLayout
        sidebar={<Sidebar collapsed={false} onToggle={() => {}} />}
        title="Admin Dashboard"
      >
        {children}
      </AppLayout>
    </ThemeProvider>
  )
}
