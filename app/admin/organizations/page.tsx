'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import { Plus, Pencil, Trash2, Users, ExternalLink } from 'lucide-react'
import { toast } from '@/presentation/components/ui/use-toast'

interface Organization {
  id: string
  name: string
  description?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  logo?: string
  createdAt: string
  updatedAt: string
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    logo: '',
  })

  // Fetch organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('/api/v1/organizations')
        if (!response.ok) {
          throw new Error('Failed to fetch organizations')
        }
        const data = await response.json()
        setOrganizations(data)
      } catch (error) {
        console.error('Error fetching organizations:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch organizations. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle create organization
  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/v1/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create organization')
      }

      const newOrganization = await response.json()
      setOrganizations((prev) => [...prev, newOrganization])
      setOpenCreateDialog(false)
      setFormData({
        name: '',
        description: '',
        website: '',
        email: '',
        phone: '',
        address: '',
        logo: '',
      })
      toast({
        title: 'Success',
        description: 'Organization created successfully',
      })
    } catch (error: any) {
      console.error('Error creating organization:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create organization. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Handle edit organization
  const handleEditOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOrganization) return

    try {
      const response = await fetch(`/api/v1/organizations/${currentOrganization.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update organization')
      }

      const updatedOrganization = await response.json()
      setOrganizations((prev) =>
        prev.map((org) => (org.id === updatedOrganization.id ? updatedOrganization : org))
      )
      setOpenEditDialog(false)
      setCurrentOrganization(null)
      setFormData({
        name: '',
        description: '',
        website: '',
        email: '',
        phone: '',
        address: '',
        logo: '',
      })
      toast({
        title: 'Success',
        description: 'Organization updated successfully',
      })
    } catch (error: any) {
      console.error('Error updating organization:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update organization. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Handle delete organization
  const handleDeleteOrganization = async () => {
    if (!currentOrganization) return

    try {
      const response = await fetch(`/api/v1/organizations/${currentOrganization.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete organization')
      }

      setOrganizations((prev) => prev.filter((org) => org.id !== currentOrganization.id))
      setOpenDeleteDialog(false)
      setCurrentOrganization(null)
      toast({
        title: 'Success',
        description: 'Organization deleted successfully',
      })
    } catch (error: any) {
      console.error('Error deleting organization:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete organization. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Open edit dialog
  const openEdit = (organization: Organization) => {
    setCurrentOrganization(organization)
    setFormData({
      name: organization.name,
      description: organization.description || '',
      website: organization.website || '',
      email: organization.email || '',
      phone: organization.phone || '',
      address: organization.address || '',
      logo: organization.logo || '',
    })
    setOpenEditDialog(true)
  }

  // Open delete dialog
  const openDelete = (organization: Organization) => {
    setCurrentOrganization(organization)
    setOpenDeleteDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateOrganization}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, Country"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Organizations</CardTitle>
          <CardDescription>
            Create, edit, and delete organizations. Organizations can have users and resources associated with them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading organizations...</p>
            </div>
          ) : organizations.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p>No organizations found. Create your first organization to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((organization) => (
                  <TableRow key={organization.id}>
                    <TableCell className="font-medium">{organization.name}</TableCell>
                    <TableCell>{organization.email || '-'}</TableCell>
                    <TableCell>
                      {organization.website ? (
                        <a
                          href={organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          {new URL(organization.website).hostname}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{new Date(organization.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* View users */}}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Users
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(organization)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDelete(organization)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Organization Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update the organization details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditOrganization}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-website">Website</Label>
                  <Input
                    id="edit-website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St, City, Country"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-logo">Logo URL</Label>
                <Input
                  id="edit-logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Organization Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this organization? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              You are about to delete the organization: <strong>{currentOrganization?.name}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This will also remove all associated data, including users and resources.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteOrganization}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
