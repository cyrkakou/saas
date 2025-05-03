'use client'

import { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/presentation/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/presentation/components/ui/popover'
import { Calendar as CalendarComponent } from '@/presentation/components/ui/calendar'

interface DateRangeSelectorProps {
  className?: string
  onRangeChange?: (range: { from: Date; to: Date }) => void
}

export function DateRangeSelector({ className, onRangeChange }: DateRangeSelectorProps) {
  const [date, setDate] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (range: { from: Date; to: Date }) => {
    setDate(range)
    if (range.from && range.to) {
      onRangeChange?.(range)
    }
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="text-sm font-medium mb-2">SELECT DATE RANGE</div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-between text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "MM/dd/yyyy")} - {format(date.to, "MM/dd/yyyy")}
                  </>
                ) : (
                  format(date.from, "MM/dd/yyyy")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <div className="text-xs text-gray-500 mt-1">
        or {format(date.from, "M/d/yyyy")} - {format(date.to, "M/d/yyyy")}
      </div>
    </div>
  )
}
