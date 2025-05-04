'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/presentation/providers/auth-provider'
import { Bell, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/presentation/components/ui/button'

interface AppLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  title?: string
}

export function AppLayout({ children, sidebar, title = 'Dashboard' }: AppLayoutProps) {
  const { user } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(true)

  useEffect(() => {
    // Check if we're on a mobile device
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      const tablet = window.innerWidth >= 768 && window.innerWidth < 1024

      setIsMobile(mobile)

      // Auto-collapse sidebar on tablet, hide on mobile
      if (mobile) {
        setSidebarVisible(false)
      } else if (tablet) {
        setSidebarCollapsed(true)
        setSidebarVisible(true)
      } else {
        setSidebarVisible(true)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      // On mobile, toggle visibility
      setSidebarVisible(!sidebarVisible)
    } else {
      // On desktop/tablet, toggle collapsed state
      setSidebarCollapsed(!sidebarCollapsed)
      // Store the preference in localStorage for persistence
      try {
        localStorage.setItem('sidebarCollapsed', String(!sidebarCollapsed))
      } catch (error) {
        // Handle localStorage not being available
        console.warn('Could not save to localStorage:', error)
      }
    }
  }

  // Function to close the sidebar (for mobile overlay clicks)
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarVisible(false)
    }
  }

  // Load sidebar state from localStorage on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('sidebarCollapsed')
      if (savedState !== null) {
        setSidebarCollapsed(savedState === 'true')
      }
    } catch (error) {
      // Handle localStorage not being available (e.g., during SSR)
      console.warn('Could not access localStorage:', error)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-screen">
        {/* Mobile overlay */}
        {isMobile && sidebarVisible && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-30 transition-all duration-300",
          isMobile && !sidebarVisible ? "-translate-x-full" : "translate-x-0"
        )}>
          {/* Pass the collapsed state to the sidebar component */}
          {React.cloneElement(sidebar as React.ReactElement, {
            collapsed: !isMobile && sidebarCollapsed,
            onToggle: toggleSidebar,
            isMobile
          })}
        </div>

        {/* Mobile header with menu button (only visible on mobile) */}
        {isMobile && (
          <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</span>
          </div>
        )}

        {/* Main content */}
        <div className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          isMobile ? "ml-0 mt-16" : (sidebarCollapsed ? "ml-16" : "ml-64")
        )}>
          {/* Header */}
          {/* Desktop/Tablet header (hidden on mobile) */}
          <header className={cn(
            "flex h-16 items-center justify-between border-b bg-white dark:bg-gray-800 px-6",
            isMobile ? "hidden" : "flex"
          )}>
            <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h1>
            <div className="flex items-center space-x-4">
              <button className="relative rounded-md bg-gray-100 dark:bg-gray-700 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-4">
                <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || 'User'}</span>
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <span className="font-medium text-sm">{user?.name?.[0] || 'U'}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">{children}</main>
        </div>
      </div>
    </div>
  )
}
