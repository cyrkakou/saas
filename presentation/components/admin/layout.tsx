'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/presentation/components/admin/sidebar'
import { Navbar } from '@/presentation/components/admin/navbar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarVisible(false)
      } else {
        setSidebarVisible(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarVisible(!sidebarVisible)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarVisible && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity z-20"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'relative'}
          ${sidebarVisible ? 'block' : isMobile ? 'hidden' : 'block'}
          transition-all duration-300 ease-in-out
        `}
      >
        <Sidebar
          collapsed={!isMobile && sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Main content */}
      <div
        className={`
          flex flex-col flex-1 transition-all duration-300 ease-in-out
          ${sidebarVisible && !isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'}
        `}
      >
        <Navbar onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  )
}
