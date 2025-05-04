import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/presentation/providers/auth-provider'
import { ThemeProvider } from '@/presentation/providers/theme-provider'
import { Toaster } from '@/presentation/components/ui/use-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReportFlow - PowerBuilder Report Viewer',
  description: 'A modern PowerBuilder report viewer built with NextJS, Tailwind CSS, and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
