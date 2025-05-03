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
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { toast } from '@/presentation/components/ui/use-toast'
import { ArrowLeft, Plus, Shield } from 'lucide-react'

interface Role {
  id: string
  name: string
  description?: string
}

interface Permission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
}

export default function RolePermissionsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [role, setRole] = useState<Role | null>(null)
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([])
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [openAddDialog, setOpenAddDialog] = useState(false)

  // Fetch role and permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch role details
        const roleResponse = await fetch(`/api/v1/roles/${id}`)
        if (!roleResponse.ok) {
          throw new Error('Failed to fetch role')
        }
        const roleData = await roleResponse.json()
        setRole(roleData)

        // Fetch role permissions
        const permissionsResponse = await fetch(`/api/v1/roles/${id}/permissions`)
        if (!permissionsResponse.ok) {
          throw new Error('Failed to fetch role permissions')
        }
        const permissionsData = await permissionsResponse.json()
        setRolePermissions(permissionsData)

        // Fetch all permissions
        const allPermissionsResponse = await fetch('/api/v1/permissions')
        if (!allPermissionsResponse.ok) {
          throw new Error('Failed to fetch all permissions')
        }
        const allPermissionsData = await allPermissionsResponse.json()
        setAllPermissions(allPermissionsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch data. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Handle permission selection
  const handlePermissionSelect = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId)
      } else {
        return [...prev, permissionId]
      }
    })
  }

  // Handle add permissions
  const handleAddPermissions = async () => {
    if (selectedPermissions.length === 0) {
      toast({
        title: 'Warning',
        description: 'Please select at least one permission to add.',
        variant: 'default',
      })
      return
    }

    try {
      const response = await fetch(`/api/v1/roles/${id}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissionIds: selectedPermissions }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add permissions')
      }

      // Refresh role permissions
      const permissionsResponse = await fetch(`/api/v1/roles/${id}/permissions`)
      if (!permissionsResponse.ok) {
        throw new Error('Failed to fetch updated permissions')
      }
      const permissionsData = await permissionsResponse.json()
      setRolePermissions(permissionsData)

      setOpenAddDialog(false)
      setSelectedPermissions([])
      toast({
        title: 'Success',
        description: 'Permissions added successfully',
      })
    } catch (error: any) {
      console.error('Error adding permissions:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to add permissions. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Handle remove permission
  const handleRemovePermission = async (permissionId: string) => {
    try {
      const response = await fetch(`/api/v1/roles/${id}/permissions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissionIds: [permissionId] }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove permission')
      }

      // Update local state
      setRolePermissions((prev) => prev.filter((permission) => permission.id !== permissionId))
      toast({
        title: 'Success',
        description: 'Permission removed successfully',
      })
    } catch (error: any) {
      console.error('Error removing permission:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove permission. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Get available permissions (not already assigned to the role)
  const getAvailablePermissions = () => {
    const rolePermissionIds = rolePermissions.map((permission) => permission.id)
    return allPermissions.filter((permission) => !rolePermissionIds.includes(permission.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/admin/roles')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Role Permissions</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading...</p>
        </div>
      ) : !role ? (
        <div className="flex justify-center items-center h-40">
          <p>Role not found</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{role.name}</CardTitle>
              <CardDescription>{role.description || 'No description provided'}</CardDescription>
            </CardHeader>
          </Card>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Permissions</h2>
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Permissions
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Permissions to Role</DialogTitle>
                  <DialogDescription>
                    Select permissions to add to this role.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 max-h-[60vh] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getAvailablePermissions().length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            No available permissions to add
                          </TableCell>
                        </TableRow>
                      ) : (
                        getAvailablePermissions().map((permission) => (
                          <TableRow key={permission.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedPermissions.includes(permission.id)}
                                onCheckedChange={() => handlePermissionSelect(permission.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{permission.name}</TableCell>
                            <TableCell>{permission.resource}</TableCell>
                            <TableCell className="capitalize">{permission.action}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpenAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddPermissions}>
                    Add Selected
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              {rolePermissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-4">
                  <Shield className="h-12 w-12 text-gray-300" />
                  <p className="text-gray-500">No permissions assigned to this role yet</p>
                  <Button onClick={() => setOpenAddDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Permissions
                  </Button>
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
                    {rolePermissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">{permission.name}</TableCell>
                        <TableCell>{permission.resource}</TableCell>
                        <TableCell className="capitalize">{permission.action}</TableCell>
                        <TableCell>{permission.description || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePermission(permission.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
