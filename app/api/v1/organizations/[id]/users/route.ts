import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationRepository, getUserRepository } from '@/infrastructure/database';
import { initializeDatabase } from '@/lib/db-init';
import { z } from 'zod';

/**
 * @route GET /api/v1/organizations/:id/users
 * @desc Get users in an organization
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
    const organizationRepository = await getOrganizationRepository();
    const userRepository = await getUserRepository();

    // Check if organization exists
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      return NextResponse.json(
        { error: `Organization with ID '${id}' not found` },
        { status: 404 }
      );
    }

    // Get all users
    const allUsers = await userRepository.findAll();

    // Filter users by organization
    const organizationUsers = allUsers.filter(user => user.organizationId === id);

    return NextResponse.json(organizationUsers);
  } catch (error: any) {
    console.error(`Error fetching users for organization with ID '${params.id}':`, error);

    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
}

/**
 * @route POST /api/v1/organizations/:id/users
 * @desc Add a user to an organization
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
      userId: z.string(),
    });

    const { userId } = schema.parse(body);

    // Get repositories
    const organizationRepository = await getOrganizationRepository();
    const userRepository = await getUserRepository();

    // Check if organization exists
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      return NextResponse.json(
        { error: `Organization with ID '${id}' not found` },
        { status: 404 }
      );
    }

    // Check if user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: `User with ID '${userId}' not found` },
        { status: 404 }
      );
    }

    // Check if user is already in the organization
    if (user.organizationId === id) {
      return NextResponse.json(
        { error: `User with ID '${userId}' is already in this organization` },
        { status: 409 }
      );
    }

    // Update user to add them to the organization
    const updatedUser = await userRepository.update(userId, {
      organizationId: id
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error(`Error adding user to organization with ID '${params.id}':`, error);

    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'An error occurred while adding the user' },
      { status: 500 }
    );
  }
}

/**
 * @route DELETE /api/v1/organizations/:id/users/:userId
 * @desc Remove a user from an organization
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
      userId: z.string(),
    });

    const { userId } = schema.parse(body);

    // Get repositories
    const organizationRepository = await getOrganizationRepository();
    const userRepository = await getUserRepository();

    // Check if organization exists
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      return NextResponse.json(
        { error: `Organization with ID '${id}' not found` },
        { status: 404 }
      );
    }

    // Check if user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: `User with ID '${userId}' not found` },
        { status: 404 }
      );
    }

    // Check if user is in the organization
    if (user.organizationId !== id) {
      return NextResponse.json(
        { error: `User with ID '${userId}' is not in this organization` },
        { status: 400 }
      );
    }

    // Update user to remove them from the organization
    const updatedUser = await userRepository.update(userId, {
      organizationId: undefined
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error(`Error removing user from organization with ID '${params.id}':`, error);

    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'An error occurred while removing the user' },
      { status: 500 }
    );
  }
}
