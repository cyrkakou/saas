'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportCardProps {
  title: string
  description: string
  icon: LucideIcon
  color?: 'blue' | 'purple' | 'green' | 'red' | 'orange'
  onClick?: () => void
}

export function ReportCard({
  title,
  description,
  icon: Icon,
  color = 'blue',
  onClick
}: ReportCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-all hover:shadow-md",
        onClick ? "hover:bg-gray-50 dark:hover:bg-gray-800/50" : ""
      )}
      onClick={onClick}
    >
      <div className={cn("p-3 rounded-full mb-4", colorClasses[color])}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{description}</p>
      <div className="mt-3 text-xs text-primary-600 dark:text-primary-400">
        Tap to explore
      </div>
    </div>
  )
}
