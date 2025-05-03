import { NextRequest, NextResponse } from 'next/server';
import { getRoleRepository } from '@/infrastructure/database';
import { UpdateRoleSchema } from '@/core/domain/entities/role';
import { initializeDatabase } from '@/lib/db-init';

// GET /api/admin/roles/[id] - Get a role by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const { id } = params;
    
    // Get role repository
    const roleRepository = await getRoleRepository();
    
    // Get role by ID
    const role = await roleRepository.findById(id);
    
    if (!role) {
      return NextResponse.json(
        { error: `Role with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(role);
  } catch (error: any) {
    console.error(`Error fetching role with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching the role' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/roles/[id] - Update a role
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
    const validatedData = UpdateRoleSchema.parse(body);
    
    // Get role repository
    const roleRepository = await getRoleRepository();
    
    // Check if role exists
    const existingRole = await roleRepository.findById(id);
    if (!existingRole) {
      return NextResponse.json(
        { error: `Role with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // If name is being updated, check if it's already taken
    if (validatedData.name && validatedData.name !== existingRole.name) {
      const roleWithSameName = await roleRepository.findByName(validatedData.name);
      if (roleWithSameName && roleWithSameName.id !== id) {
        return NextResponse.json(
          { error: `Role with name '${validatedData.name}' already exists` },
          { status: 409 }
        );
      }
    }
    
    // Update role
    const updatedRole = await roleRepository.update(id, validatedData);
    
    return NextResponse.json(updatedRole);
  } catch (error: any) {
    console.error(`Error updating role with ID '${params.id}':`, error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating the role' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/roles/[id] - Delete a role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const { id } = params;
    
    // Get role repository
    const roleRepository = await getRoleRepository();
    
    // Check if role exists
    const existingRole = await roleRepository.findById(id);
    if (!existingRole) {
      return NextResponse.json(
        { error: `Role with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Delete role
    const deleted = await roleRepository.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: `Failed to delete role with ID '${id}'` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting role with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while deleting the role' },
      { status: 500 }
    );
  }
}
