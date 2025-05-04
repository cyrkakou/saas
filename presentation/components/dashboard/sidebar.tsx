'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Settings,
  Package,
  Plane,
  Mail,
  FileText,
  Sun,
  LogOut,
  Menu,
  ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/presentation/components/ui/button'
import { useAuth } from '@/presentation/providers/auth-provider'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  isMobile?: boolean
}

export function DashboardSidebar({ collapsed = false, onToggle, isMobile = false }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  // Use the collapsed prop directly instead of internal state
  // This ensures the sidebar responds to changes from the parent component
  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    }
  }

  // Navigation items
  const navItems = [
    {
      title: 'Account',
      href: '/dashboard/account',
      icon: Sun,
    },
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Products',
      href: '/dashboard/products',
      icon: Package,
    },
    {
      title: 'Partnerships',
      href: '/dashboard/partnerships',
      icon: Plane,
    },
    {
      title: 'Invites',
      href: '/dashboard/invites',
      icon: Mail,
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
    {
      title: 'Documentation',
      href: '/dashboard/documentation',
      icon: FileText,
    },
  ]

  // No need for a custom ChevronLeft component as we're importing it from lucide-react

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 shadow-sm",
      collapsed ? "w-16" : "w-64",
      "max-w-[85vw]" // Prevent sidebar from being too wide on small screens
    )}>
      {/* Header with toggle button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <span className="text-lg font-medium text-gray-900">Dashboard</span>
        )}
        {collapsed && (
          <span className="text-lg font-bold text-primary-600">D</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="text-gray-500 hover:text-gray-700 ml-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto py-4 md:py-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary-600",
                  collapsed ? "justify-center" : ""
                )}
              >
                <div className="flex items-center justify-center" style={{ width: '24px', minWidth: '24px' }}>
                  <item.icon className="h-5 w-5" />
                </div>
                {!collapsed && <span className="ml-3">{item.title}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Sign out button at the bottom */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => logout()}
          className={cn(
            "flex items-center py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors w-full",
            collapsed ? "justify-center" : ""
          )}
        >
          <div className="flex items-center justify-center" style={{ width: '24px', minWidth: '24px' }}>
            <LogOut className="h-5 w-5" />
          </div>
          {!collapsed && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
    </div>
  )
}
