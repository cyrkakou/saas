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
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/presentation/components/ui/button'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  
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

  const analyticsNavItems = [
    {
      title: 'Overview',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: 'Reports',
      href: '/admin/analytics/reports',
      icon: FileText,
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
  ]

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          {!collapsed && (
            <span className="text-xl font-bold text-primary">Admin</span>
          )}
          {collapsed && (
            <span className="text-xl font-bold text-primary">A</span>
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
        <nav className="px-2 space-y-6">
          <div>
            <h3 className={cn(
              "font-medium",
              collapsed ? "sr-only" : "px-2 mb-2 text-gray-500 dark:text-gray-400"
            )}>
              Main
            </h3>
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className={cn(
                      "flex items-center py-2 px-2 rounded-md text-sm font-medium",
                      pathname === item.href 
                        ? "bg-gray-100 dark:bg-gray-800 text-primary" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800",
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
              "font-medium",
              collapsed ? "sr-only" : "px-2 mb-2 text-gray-500 dark:text-gray-400"
            )}>
              Analytics
            </h3>
            <ul className="space-y-1">
              {analyticsNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className={cn(
                      "flex items-center py-2 px-2 rounded-md text-sm font-medium",
                      pathname === item.href 
                        ? "bg-gray-100 dark:bg-gray-800 text-primary" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800",
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
              "font-medium",
              collapsed ? "sr-only" : "px-2 mb-2 text-gray-500 dark:text-gray-400"
            )}>
              Content
            </h3>
            <ul className="space-y-1">
              {contentNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className={cn(
                      "flex items-center py-2 px-2 rounded-md text-sm font-medium",
                      pathname === item.href 
                        ? "bg-gray-100 dark:bg-gray-800 text-primary" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800",
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
    </div>
  )
}
