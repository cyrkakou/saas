'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Calendar,
  Download
} from 'lucide-react'
import { AdminLayout } from '@/presentation/components/admin/layout'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'

// Mock data
const subscriptions = [
  {
    id: '1',
    customer: 'Acme Inc.',
    plan: 'Enterprise',
    status: 'Active',
    amount: '$599.00',
    nextBilling: 'Jul 22, 2023',
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: '2',
    customer: 'Globex Corporation',
    plan: 'Pro',
    status: 'Active',
    amount: '$299.00',
    nextBilling: 'Aug 15, 2023',
    paymentMethod: 'Mastercard ending in 5555',
  },
  {
    id: '3',
    customer: 'Initech',
    plan: 'Basic',
    status: 'Canceled',
    amount: '$99.00',
    nextBilling: 'N/A',
    paymentMethod: 'PayPal',
  },
  {
    id: '4',
    customer: 'Umbrella Corp',
    plan: 'Enterprise',
    status: 'Past Due',
    amount: '$599.00',
    nextBilling: 'Jun 30, 2023',
    paymentMethod: 'Visa ending in 1234',
  },
  {
    id: '5',
    customer: 'Stark Industries',
    plan: 'Pro',
    status: 'Trial',
    amount: '$0.00',
    nextBilling: 'Jul 10, 2023',
    paymentMethod: 'N/A',
  },
]

// Mock stats
const stats = [
  {
    title: 'Total Revenue',
    value: '$24,567.00',
    change: '+12.5%',
    trend: 'up',
  },
  {
    title: 'Active Subscriptions',
    value: '245',
    change: '+5.2%',
    trend: 'up',
  },
  {
    title: 'Churn Rate',
    value: '3.2%',
    change: '-0.8%',
    trend: 'down',
  },
  {
    title: 'Avg. Revenue Per User',
    value: '$125.40',
    change: '+2.3%',
    trend: 'up',
  },
]

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch = 
      subscription.customer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPlan = planFilter === 'all' || subscription.plan.toLowerCase() === planFilter.toLowerCase()
    const matchesStatus = statusFilter === 'all' || subscription.status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesPlan && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Subscriptions</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stat.trend === 'up' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subscriptions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="past due">Past Due</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.customer}</TableCell>
                    <TableCell>{subscription.plan}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscription.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : subscription.status === 'Trial'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : subscription.status === 'Past Due'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {subscription.status === 'Active' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {subscription.status === 'Trial' && <Clock className="h-3 w-3 mr-1" />}
                        {subscription.status === 'Past Due' && <XCircle className="h-3 w-3 mr-1" />}
                        {subscription.status === 'Canceled' && <XCircle className="h-3 w-3 mr-1" />}
                        {subscription.status}
                      </span>
                    </TableCell>
                    <TableCell>{subscription.amount}</TableCell>
                    <TableCell>{subscription.nextBilling}</TableCell>
                    <TableCell>{subscription.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Update Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            View Billing History
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Cancel Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
