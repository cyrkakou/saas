import { NextRequest, NextResponse } from 'next/server';
import { getPermissionRepository } from '@/infrastructure/database';
import { CreatePermissionSchema } from '@/core/domain/entities/permission';
import { initializeDatabase } from '@/lib/db-init';

// GET /api/admin/permissions - Get all permissions
export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Get permission repository
    const permissionRepository = await getPermissionRepository();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource');
    
    // Get permissions
    let permissions;
    if (resource) {
      permissions = await permissionRepository.findByResource(resource);
    } else {
      permissions = await permissionRepository.findAll();
    }
    
    return NextResponse.json(permissions);
  } catch (error: any) {
    console.error('Error fetching permissions:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching permissions' },
      { status: 500 }
    );
  }
}

// POST /api/admin/permissions - Create a new permission
export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Parse request body
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreatePermissionSchema.parse(body);
    
    // Get permission repository
    const permissionRepository = await getPermissionRepository();
    
    // Check if permission with the same name already exists
    const existingPermission = await permissionRepository.findByName(validatedData.name);
    if (existingPermission) {
      return NextResponse.json(
        { error: `Permission with name '${validatedData.name}' already exists` },
        { status: 409 }
      );
    }
    
    // Create permission
    const permission = await permissionRepository.create(validatedData);
    
    return NextResponse.json(permission, { status: 201 });
  } catch (error: any) {
    console.error('Error creating permission:', error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating the permission' },
      { status: 500 }
    );
  }
}
