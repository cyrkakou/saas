import { NextRequest, NextResponse } from 'next/server';
import { getRoleRepository, getPermissionRepository } from '@/infrastructure/database';
import { initializeDatabase } from '@/lib/db-init';
import { z } from 'zod';

// GET /api/admin/roles/[id]/permissions - Get permissions for a role
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const { id } = params;
    
    // Get repositories
    const roleRepository = await getRoleRepository();
    const permissionRepository = await getPermissionRepository();
    
    // Check if role exists
    const role = await roleRepository.findById(id);
    if (!role) {
      return NextResponse.json(
        { error: `Role with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Get permission IDs for the role
    const permissionIds = await roleRepository.getPermissions(id);
    
    // Get permission details
    const permissions = await Promise.all(
      permissionIds.map(async (permissionId) => {
        return await permissionRepository.findById(permissionId);
      })
    );
    
    // Filter out null values (permissions that might have been deleted)
    const validPermissions = permissions.filter(Boolean);
    
    return NextResponse.json(validPermissions);
  } catch (error: any) {
    console.error(`Error fetching permissions for role with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching permissions' },
      { status: 500 }
    );
  }
}

// POST /api/admin/roles/[id]/permissions - Assign permissions to a role
export async function POST(
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
    const schema = z.object({
      permissionIds: z.array(z.string()),
    });
    
    const { permissionIds } = schema.parse(body);
    
    // Get repositories
    const roleRepository = await getRoleRepository();
    const permissionRepository = await getPermissionRepository();
    
    // Check if role exists
    const role = await roleRepository.findById(id);
    if (!role) {
      return NextResponse.json(
        { error: `Role with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Verify all permissions exist
    for (const permissionId of permissionIds) {
      const permission = await permissionRepository.findById(permissionId);
      if (!permission) {
        return NextResponse.json(
          { error: `Permission with ID '${permissionId}' not found` },
          { status: 404 }
        );
      }
    }
    
    // Assign permissions to role
    const success = await roleRepository.assignPermissions(id, permissionIds);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to assign permissions to role' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error assigning permissions to role with ID '${params.id}':`, error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while assigning permissions' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/roles/[id]/permissions - Remove permissions from a role
export async function DELETE(
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
    const schema = z.object({
      permissionIds: z.array(z.string()),
    });
    
    const { permissionIds } = schema.parse(body);
    
    // Get repositories
    const roleRepository = await getRoleRepository();
    
    // Check if role exists
    const role = await roleRepository.findById(id);
    if (!role) {
      return NextResponse.json(
        { error: `Role with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Remove permissions from role
    const success = await roleRepository.removePermissions(id, permissionIds);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to remove permissions from role' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error removing permissions from role with ID '${params.id}':`, error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while removing permissions' },
      { status: 500 }
    );
  }
}
