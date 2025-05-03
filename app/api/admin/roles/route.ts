import { NextRequest, NextResponse } from 'next/server';
import { getRoleRepository } from '@/infrastructure/database';
import { CreateRoleSchema, UpdateRoleSchema } from '@/core/domain/entities/role';
import { initializeDatabase } from '@/lib/db-init';

// GET /api/admin/roles - Get all roles
export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Get role repository
    const roleRepository = await getRoleRepository();
    
    // Get all roles
    const roles = await roleRepository.findAll();
    
    return NextResponse.json(roles);
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching roles' },
      { status: 500 }
    );
  }
}

// POST /api/admin/roles - Create a new role
export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Parse request body
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateRoleSchema.parse(body);
    
    // Get role repository
    const roleRepository = await getRoleRepository();
    
    // Check if role with the same name already exists
    const existingRole = await roleRepository.findByName(validatedData.name);
    if (existingRole) {
      return NextResponse.json(
        { error: `Role with name '${validatedData.name}' already exists` },
        { status: 409 }
      );
    }
    
    // Create role
    const role = await roleRepository.create(validatedData);
    
    return NextResponse.json(role, { status: 201 });
  } catch (error: any) {
    console.error('Error creating role:', error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating the role' },
      { status: 500 }
    );
  }
}
