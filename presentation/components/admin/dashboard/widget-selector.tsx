'use client'

import { useState } from 'react'
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  PlusCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WidgetOption {
  id: string
  name: string
  icon: React.ElementType
  color: string
}

interface WidgetSelectorProps {
  className?: string
  onWidgetsChange?: (widgets: string[]) => void
}

export function WidgetSelector({ className, onWidgetsChange }: WidgetSelectorProps) {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(['twitter'])
  
  const widgetOptions: WidgetOption[] = [
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  ]

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets((prev) => {
      const newSelection = prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId]
      
      onWidgetsChange?.(newSelection)
      return newSelection
    })
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="text-sm font-medium mb-2">ADD WIDGETS</div>
      <div className="space-y-2">
        {widgetOptions.map((widget) => {
          const Icon = widget.icon
          const isSelected = selectedWidgets.includes(widget.id)
          
          return (
            <div 
              key={widget.id}
              className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => toggleWidget(widget.id)}
            >
              <div className="flex items-center">
                <Icon className={cn("h-5 w-5 mr-2", widget.color)} />
                <span className="text-sm font-medium">{widget.name}</span>
              </div>
              <div>
                {isSelected ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-center p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
        <PlusCircle className="h-5 w-5 mr-2 text-gray-400" />
        <span className="text-sm text-gray-500">Add More Widgets</span>
      </div>
    </div>
  )
}
