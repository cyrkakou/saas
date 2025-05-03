'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  ChevronLeft,
  BarChart3,
  FileText,
  Image,
  MessageSquare,
  Rss,
  Shield,
  Building,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/presentation/providers/auth-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/presentation/components/ui/button'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const mainNavItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Roles',
      href: '/admin/roles',
      icon: Shield,
    },
    {
      title: 'Permissions',
      href: '/admin/permissions',
      icon: Shield,
    },
    {
      title: 'Organizations',
      href: '/admin/organizations',
      icon: Building,
    },
    {
      title: 'Subscriptions',
      href: '/admin/subscriptions',
      icon: CreditCard,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ]

  const contentNavItems = [
    {
      title: 'Articles',
      href: '/admin/content/articles',
      icon: FileText,
    },
    {
      title: 'Images',
      href: '/admin/content/images',
      icon: Image,
    },
    {
      title: 'My Posts',
      href: '/admin/content/posts',
      icon: MessageSquare,
    },
    {
      title: 'RSS',
      href: '/admin/content/rss',
      icon: Rss,
    },
  ]

  const analyticsNavItems = [
    {
      title: 'Overview',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: 'Reports',
      href: '/admin/reports',
      icon: FileText,
    },
  ]

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 shadow-sm",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          {!collapsed && (
            <span className="text-xl font-bold text-primary-600">Admin</span>
          )}
          {collapsed && (
            <span className="text-xl font-bold text-primary-600">A</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("ml-auto", collapsed ? "rotate-180" : "")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-8">
          <div>
            <h3 className={cn(
              "font-medium uppercase text-xs",
              collapsed ? "sr-only" : "px-3 mb-3 text-gray-500 dark:text-gray-400"
            )}>
              Main
            </h3>
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className={cn(
                      "flex items-center py-2 px-3 rounded-md text-sm font-medium",
                      pathname === item.href
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400",
                      collapsed ? "justify-center" : ""
                    )}>
                      <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                      {!collapsed && <span>{item.title}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={cn(
              "font-medium uppercase text-xs",
              collapsed ? "sr-only" : "px-3 mb-3 text-gray-500 dark:text-gray-400"
            )}>
              Content
            </h3>
            <ul className="space-y-1">
              {contentNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className={cn(
                      "flex items-center py-2 px-3 rounded-md text-sm font-medium",
                      pathname === item.href
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400",
                      collapsed ? "justify-center" : ""
                    )}>
                      <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                      {!collapsed && <span>{item.title}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={cn(
              "font-medium uppercase text-xs",
              collapsed ? "sr-only" : "px-3 mb-3 text-gray-500 dark:text-gray-400"
            )}>
              Analytics
            </h3>
            <ul className="space-y-1">
              {analyticsNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className={cn(
                      "flex items-center py-2 px-3 rounded-md text-sm font-medium",
                      pathname === item.href
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400",
                      collapsed ? "justify-center" : ""
                    )}>
                      <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                      {!collapsed && <span>{item.title}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Sign out button at the bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => logout()}
          className={cn(
            "flex items-center py-2 px-3 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 w-full",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )
}
