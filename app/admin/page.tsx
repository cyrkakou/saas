'use client'

import { useState } from 'react'
import {
  BarChart2,
  Calendar,
  Clock,
  Plus
} from 'lucide-react'

import { ReportCard } from '@/presentation/components/admin/dashboard/report-card'
import { CustomReportBuilder } from '@/presentation/components/admin/dashboard/custom-report-builder'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'

export default function AdminDashboardPage() {
  const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false)
  const [customReports, setCustomReports] = useState<any[]>([])

  const handleSaveReport = (report: any) => {
    setCustomReports((prev) => [...prev, report])
    setIsReportBuilderOpen(false)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Your Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-solid transition-all"
            onClick={() => setIsReportBuilderOpen(true)}
          >
            <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Build Report</h3>
          </div>

          <ReportCard
            title="Monthly Report"
            description="Description of your report goes here. Tap to explore."
            icon={Calendar}
            color="purple"
          />

          <ReportCard
            title="Quarterly Report"
            description="Description of your report goes here. Tap to explore."
            icon={BarChart2}
            color="green"
          />

          <ReportCard
            title="Yearly Reports"
            description="Description of your report goes here. Tap to explore."
            icon={Clock}
            color="blue"
          />

          {customReports.map((report, index) => (
            <ReportCard
              key={index}
              title={report.title || "Custom Report"}
              description={report.description || "Custom report description"}
              icon={BarChart2}
              color="orange"
            />
          ))}
        </div>
      </div>

      <Dialog open={isReportBuilderOpen} onOpenChange={setIsReportBuilderOpen}>
        <DialogContent className="sm:max-w-[900px] h-[80vh] max-h-[800px] p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CustomReportBuilder
            onClose={() => setIsReportBuilderOpen(false)}
            onSave={handleSaveReport}
          />
        </DialogContent>
      </Dialog>
    </>

  )
}
