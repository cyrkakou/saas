'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  Settings,
  Menu,
  PenSquare
} from 'lucide-react'
import { ThemeToggle } from '@/presentation/components/ui/theme-toggle'
import { Button } from '@/presentation/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'

interface NavbarProps {
  onMenuToggle: () => void
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const [activeTab, setActiveTab] = useState('content')

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'manage', label: 'Manage' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'accounts', label: 'Accounts' },
  ]

  return (
    <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4 w-full sticky top-0 z-10">
      <div className="flex items-center md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex justify-center md:justify-start">
        <div className="flex items-center space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-2 py-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        <ThemeToggle />

        <Button
          variant="default"
          size="sm"
          className="hidden md:flex items-center bg-primary-600 hover:bg-primary-700 text-white"
        >
          <PenSquare className="h-4 w-4 mr-2" />
          Compose
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
