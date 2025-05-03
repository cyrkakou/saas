import { NextRequest, NextResponse } from 'next/server';
import { getRoleRepository } from '@/infrastructure/database';
import { CreateRoleSchema } from '@/core/domain/entities/role';
import { initializeDatabase } from '@/lib/db-init';

/**
 * @route GET /api/v1/roles
 * @desc Get all roles
 * @access Private (Admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Get role repository
    const roleRepository = await getRoleRepository();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    
    // Get all roles
    let roles = await roleRepository.findAll();
    
    // Apply pagination if specified
    if (limit !== undefined && offset !== undefined) {
      roles = roles.slice(offset, offset + limit);
    } else if (limit !== undefined) {
      roles = roles.slice(0, limit);
    }
    
    return NextResponse.json(roles);
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching roles' },
      { status: 500 }
    );
  }
}

/**
 * @route POST /api/v1/roles
 * @desc Create a new role
 * @access Private (Admin)
 */
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
