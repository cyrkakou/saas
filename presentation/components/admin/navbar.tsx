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
    <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuToggle}
        className="md:hidden mr-2"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="hidden md:flex items-center space-x-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`text-sm font-medium ${
              activeTab === tab.id 
                ? 'text-primary border-b-2 border-primary rounded-none' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      
      <div className="ml-auto flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <ThemeToggle />
        
        <Button variant="primary" size="sm" className="hidden md:flex items-center">
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
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
