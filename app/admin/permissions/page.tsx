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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from '@/presentation/components/ui/use-toast'
import { PermissionAction } from '@/core/domain/entities/permission'

interface Permission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
  createdAt: string
  updatedAt: string
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    resource: '',
    action: PermissionAction.READ,
  })

  // Fetch permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch('/api/v1/permissions')
        if (!response.ok) {
          throw new Error('Failed to fetch permissions')
        }
        const data = await response.json()
        setPermissions(data)
      } catch (error) {
        console.error('Error fetching permissions:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch permissions. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [])

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle create permission
  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/v1/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create permission')
      }

      const newPermission = await response.json()
      setPermissions((prev) => [...prev, newPermission])
      setOpenCreateDialog(false)
      setFormData({
        name: '',
        description: '',
        resource: '',
        action: PermissionAction.READ,
      })
      toast({
        title: 'Success',
        description: 'Permission created successfully',
      })
    } catch (error: any) {
      console.error('Error creating permission:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create permission. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Handle edit permission
  const handleEditPermission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPermission) return

    try {
      const response = await fetch(`/api/v1/permissions/${currentPermission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update permission')
      }

      const updatedPermission = await response.json()
      setPermissions((prev) =>
        prev.map((permission) => (permission.id === updatedPermission.id ? updatedPermission : permission))
      )
      setOpenEditDialog(false)
      setCurrentPermission(null)
      setFormData({
        name: '',
        description: '',
        resource: '',
        action: PermissionAction.READ,
      })
      toast({
        title: 'Success',
        description: 'Permission updated successfully',
      })
    } catch (error: any) {
      console.error('Error updating permission:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update permission. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Handle delete permission
  const handleDeletePermission = async () => {
    if (!currentPermission) return

    try {
      const response = await fetch(`/api/v1/permissions/${currentPermission.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete permission')
      }

      setPermissions((prev) => prev.filter((permission) => permission.id !== currentPermission.id))
      setOpenDeleteDialog(false)
      setCurrentPermission(null)
      toast({
        title: 'Success',
        description: 'Permission deleted successfully',
      })
    } catch (error: any) {
      console.error('Error deleting permission:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete permission. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Open edit dialog
  const openEdit = (permission: Permission) => {
    setCurrentPermission(permission)
    setFormData({
      name: permission.name,
      description: permission.description || '',
      resource: permission.resource,
      action: permission.action as PermissionAction,
    })
    setOpenEditDialog(true)
  }

  // Open delete dialog
  const openDelete = (permission: Permission) => {
    setCurrentPermission(permission)
    setOpenDeleteDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Permissions</h1>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Permission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
              <DialogDescription>
                Add a new permission to the system. Permissions define what actions users can perform on resources.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePermission}>
              <div className="grid gap-4 py-4">
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
                  <Label htmlFor="resource">Resource</Label>
                  <Input
                    id="resource"
                    name="resource"
                    value={formData.resource}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., users, roles, reports"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action">Action</Label>
                  <Select
                    value={formData.action}
                    onValueChange={(value) => handleSelectChange('action', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PermissionAction.CREATE}>Create</SelectItem>
                      <SelectItem value={PermissionAction.READ}>Read</SelectItem>
                      <SelectItem value={PermissionAction.UPDATE}>Update</SelectItem>
                      <SelectItem value={PermissionAction.DELETE}>Delete</SelectItem>
                      <SelectItem value={PermissionAction.MANAGE}>Manage</SelectItem>
                    </SelectContent>
                  </Select>
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
          <CardTitle>Manage Permissions</CardTitle>
          <CardDescription>
            Create, edit, and delete permissions. Permissions can be assigned to roles to control access to features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading permissions...</p>
            </div>
          ) : permissions.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p>No permissions found. Create your first permission to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell>{permission.resource}</TableCell>
                    <TableCell className="capitalize">{permission.action}</TableCell>
                    <TableCell>{permission.description || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(permission)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDelete(permission)}
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

      {/* Edit Permission Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>
              Update the permission details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPermission}>
            <div className="grid gap-4 py-4">
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
                <Label htmlFor="edit-resource">Resource</Label>
                <Input
                  id="edit-resource"
                  name="resource"
                  value={formData.resource}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-action">Action</Label>
                <Select
                  value={formData.action}
                  onValueChange={(value) => handleSelectChange('action', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PermissionAction.CREATE}>Create</SelectItem>
                    <SelectItem value={PermissionAction.READ}>Read</SelectItem>
                    <SelectItem value={PermissionAction.UPDATE}>Update</SelectItem>
                    <SelectItem value={PermissionAction.DELETE}>Delete</SelectItem>
                    <SelectItem value={PermissionAction.MANAGE}>Manage</SelectItem>
                  </SelectContent>
                </Select>
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

      {/* Delete Permission Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Permission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this permission? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              You are about to delete the permission: <strong>{currentPermission?.name}</strong>
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeletePermission}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
