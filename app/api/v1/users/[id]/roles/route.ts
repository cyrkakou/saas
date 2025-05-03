import { NextRequest, NextResponse } from 'next/server';
import { getUserRepository, getRoleRepository } from '@/infrastructure/database';
import { initializeDatabase } from '@/lib/db-init';
import { z } from 'zod';

/**
 * @route GET /api/v1/users/:id/roles
 * @desc Get roles for a user
 * @access Private
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const { id } = params;
    
    // Get repositories
    const userRepository = await getUserRepository();
    const roleRepository = await getRoleRepository();
    
    // Check if user exists
    const user = await userRepository.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: `User with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // If user has a role, get the role details
    if (user.roleId) {
      const role = await roleRepository.findById(user.roleId);
      if (role) {
        return NextResponse.json([role]);
      }
    }
    
    // If no role or role not found, return empty array
    return NextResponse.json([]);
  } catch (error: any) {
    console.error(`Error fetching roles for user with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching roles' },
      { status: 500 }
    );
  }
}

/**
 * @route POST /api/v1/users/:id/roles
 * @desc Assign a role to a user
 * @access Private (Admin)
 */
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
      roleId: z.string(),
    });
    
    const { roleId } = schema.parse(body);
    
    // Get repositories
    const userRepository = await getUserRepository();
    const roleRepository = await getRoleRepository();
    
    // Check if user exists
    const user = await userRepository.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: `User with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Check if role exists
    const role = await roleRepository.findById(roleId);
    if (!role) {
      return NextResponse.json(
        { error: `Role with ID '${roleId}' not found` },
        { status: 404 }
      );
    }
    
    // Update user to assign the role
    const updatedUser = await userRepository.update(id, {
      roleId
    });
    
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error(`Error assigning role to user with ID '${params.id}':`, error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while assigning the role' },
      { status: 500 }
    );
  }
}

/**
 * @route DELETE /api/v1/users/:id/roles/:roleId
 * @desc Remove a role from a user
 * @access Private (Admin)
 */
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
      roleId: z.string(),
    });
    
    const { roleId } = schema.parse(body);
    
    // Get repositories
    const userRepository = await getUserRepository();
    
    // Check if user exists
    const user = await userRepository.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: `User with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Check if user has the specified role
    if (user.roleId !== roleId) {
      return NextResponse.json(
        { error: `User with ID '${id}' does not have the role with ID '${roleId}'` },
        { status: 400 }
      );
    }
    
    // Update user to remove the role
    const updatedUser = await userRepository.update(id, {
      roleId: null
    });
    
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error(`Error removing role from user with ID '${params.id}':`, error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while removing the role' },
      { status: 500 }
    );
  }
}
