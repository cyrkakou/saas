import { NextRequest, NextResponse } from 'next/server';
import { getPermissionRepository } from '@/infrastructure/database';
import { CreatePermissionSchema } from '@/core/domain/entities/permission';
import { initializeDatabase } from '@/lib/db-init';

/**
 * @route GET /api/v1/permissions
 * @desc Get all permissions
 * @access Private (Admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Get permission repository
    const permissionRepository = await getPermissionRepository();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    
    // Get permissions
    let permissions;
    if (resource) {
      permissions = await permissionRepository.findByResource(resource);
    } else {
      permissions = await permissionRepository.findAll();
    }
    
    // Apply pagination if specified
    if (limit !== undefined && offset !== undefined) {
      permissions = permissions.slice(offset, offset + limit);
    } else if (limit !== undefined) {
      permissions = permissions.slice(0, limit);
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

/**
 * @route POST /api/v1/permissions
 * @desc Create a new permission
 * @access Private (Admin)
 */
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
