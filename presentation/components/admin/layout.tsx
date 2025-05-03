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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {sidebarVisible && (
        <div className={isMobile ? "fixed inset-0 z-40 lg:hidden" : ""}>
          {isMobile && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
              onClick={toggleSidebar}
            ></div>
          )}
          <div className={`${isMobile ? "fixed inset-y-0 left-0 z-40 w-64" : ""}`}>
            <Sidebar 
              collapsed={!isMobile && sidebarCollapsed} 
              onToggle={toggleSidebar} 
            />
          </div>
        </div>
      )}
      
      <div className={`flex flex-col flex-1 transition-all duration-300 ${
        sidebarVisible && !isMobile 
          ? (sidebarCollapsed ? "ml-16" : "ml-64") 
          : "ml-0"
      }`}>
        <Navbar onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  )
}
