'use client'

import { useState } from 'react'
import { DateRangeSelector } from './date-range-selector'
import { WidgetSelector } from './widget-selector'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Textarea } from '@/presentation/components/ui/textarea'

interface CustomReportBuilderProps {
  onClose: () => void
  onSave: (report: any) => void
}

export function CustomReportBuilder({ onClose, onSave }: CustomReportBuilderProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(['twitter'])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])

  const handleSave = () => {
    onSave({
      title,
      description,
      dateRange,
      widgets: selectedWidgets,
      accounts: selectedAccounts,
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6">
        <div className="mb-8">
          <Input
            className="text-2xl font-bold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter Custom Report Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            className="mt-2 resize-none border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter Custom Description of your Report"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <DateRangeSelector 
              onRangeChange={setDateRange}
            />
            
            <div>
              <div className="text-sm font-medium mb-2">ACCOUNTS</div>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => {/* Open account selector */}}
              >
                <span>Select Accounts</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {selectedAccounts.length || 0}
                </span>
              </Button>
            </div>
          </div>
          
          <WidgetSelector 
            onWidgetsChange={setSelectedWidgets}
          />
        </div>

        <div className="flex items-center justify-center mt-12">
          <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-gray-400">Add Widgets Here</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
        <Button variant="outline" className="mr-2" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
