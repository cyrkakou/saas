'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from '@/presentation/components/ui/use-toast'

interface Role {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export default function RolesPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/v1/roles')
        if (!response.ok) {
          throw new Error('Failed to fetch roles')
        }
        const data = await response.json()
        setRoles(data)
      } catch (error) {
        console.error('Error fetching roles:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch roles. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle create role
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/v1/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create role')
      }

      const newRole = await response.json()
      setRoles((prev) => [...prev, newRole])
      setOpenCreateDialog(false)
      setFormData({ name: '', description: '' })
      toast({
        title: 'Success',
        description: 'Role created successfully',
      })
    } catch (error: any) {
      console.error('Error creating role:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create role. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Handle edit role
  const handleEditRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentRole) return

    try {
      const response = await fetch(`/api/v1/roles/${currentRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update role')
      }

      const updatedRole = await response.json()
      setRoles((prev) =>
        prev.map((role) => (role.id === updatedRole.id ? updatedRole : role))
      )
      setOpenEditDialog(false)
      setCurrentRole(null)
      setFormData({ name: '', description: '' })
      toast({
        title: 'Success',
        description: 'Role updated successfully',
      })
    } catch (error: any) {
      console.error('Error updating role:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Handle delete role
  const handleDeleteRole = async () => {
    if (!currentRole) return

    try {
      const response = await fetch(`/api/v1/roles/${currentRole.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete role')
      }

      setRoles((prev) => prev.filter((role) => role.id !== currentRole.id))
      setOpenDeleteDialog(false)
      setCurrentRole(null)
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      })
    } catch (error: any) {
      console.error('Error deleting role:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete role. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Open edit dialog
  const openEdit = (role: Role) => {
    setCurrentRole(role)
    setFormData({
      name: role.name,
      description: role.description || '',
    })
    setOpenEditDialog(true)
  }

  // Open delete dialog
  const openDelete = (role: Role) => {
    setCurrentRole(role)
    setOpenDeleteDialog(true)
  }

  // View role permissions
  const viewPermissions = (roleId: string) => {
    router.push(`/admin/roles/${roleId}/permissions`)
    // Note: This will still use the admin UI route, but the API calls will use the new v1 API
  }

  return (
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Roles</h1>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Add a new role to the system. Roles can be assigned to users and have specific permissions.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRole}>
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
          <CardTitle>Manage Roles</CardTitle>
          <CardDescription>
            Create, edit, and delete roles. Assign permissions to roles to control access to features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p>No roles found. Create your first role to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || '-'}</TableCell>
                    <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewPermissions(role.id)}
                        >
                          Permissions
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(role)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDelete(role)}
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

      {/* Edit Role Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRole}>
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

      {/* Delete Role Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              You are about to delete the role: <strong>{currentRole?.name}</strong>
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteRole}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
  )
}
