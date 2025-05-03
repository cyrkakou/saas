import { NextRequest, NextResponse } from 'next/server';
import { getPermissionRepository } from '@/infrastructure/database';
import { UpdatePermissionSchema } from '@/core/domain/entities/permission';
import { initializeDatabase } from '@/lib/db-init';

// GET /api/admin/permissions/[id] - Get a permission by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const { id } = params;
    
    // Get permission repository
    const permissionRepository = await getPermissionRepository();
    
    // Get permission by ID
    const permission = await permissionRepository.findById(id);
    
    if (!permission) {
      return NextResponse.json(
        { error: `Permission with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(permission);
  } catch (error: any) {
    console.error(`Error fetching permission with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching the permission' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/permissions/[id] - Update a permission
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const { id } = params;
    
    // Parse request body
    const body = await request.json();
    
    // Validate request body
    const validatedData = UpdatePermissionSchema.parse(body);
    
    // Get permission repository
    const permissionRepository = await getPermissionRepository();
    
    // Check if permission exists
    const existingPermission = await permissionRepository.findById(id);
    if (!existingPermission) {
      return NextResponse.json(
        { error: `Permission with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // If name is being updated, check if it's already taken
    if (validatedData.name && validatedData.name !== existingPermission.name) {
      const permissionWithSameName = await permissionRepository.findByName(validatedData.name);
      if (permissionWithSameName && permissionWithSameName.id !== id) {
        return NextResponse.json(
          { error: `Permission with name '${validatedData.name}' already exists` },
          { status: 409 }
        );
      }
    }
    
    // Update permission
    const updatedPermission = await permissionRepository.update(id, validatedData);
    
    return NextResponse.json(updatedPermission);
  } catch (error: any) {
    console.error(`Error updating permission with ID '${params.id}':`, error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating the permission' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/permissions/[id] - Delete a permission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const { id } = params;
    
    // Get permission repository
    const permissionRepository = await getPermissionRepository();
    
    // Check if permission exists
    const existingPermission = await permissionRepository.findById(id);
    if (!existingPermission) {
      return NextResponse.json(
        { error: `Permission with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Delete permission
    const deleted = await permissionRepository.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: `Failed to delete permission with ID '${id}'` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting permission with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while deleting the permission' },
      { status: 500 }
    );
  }
}
