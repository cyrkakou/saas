import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationRepository } from '@/infrastructure/database';
import { UpdateOrganizationSchema } from '@/core/domain/entities/organization';
import { initializeDatabase } from '@/lib/db-init';

// GET /api/admin/organizations/[id] - Get an organization by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const { id } = params;
    
    // Get organization repository
    const organizationRepository = await getOrganizationRepository();
    
    // Get organization by ID
    const organization = await organizationRepository.findById(id);
    
    if (!organization) {
      return NextResponse.json(
        { error: `Organization with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(organization);
  } catch (error: any) {
    console.error(`Error fetching organization with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching the organization' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/organizations/[id] - Update an organization
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
    const validatedData = UpdateOrganizationSchema.parse(body);
    
    // Get organization repository
    const organizationRepository = await getOrganizationRepository();
    
    // Check if organization exists
    const existingOrganization = await organizationRepository.findById(id);
    if (!existingOrganization) {
      return NextResponse.json(
        { error: `Organization with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // If name is being updated, check if it's already taken
    if (validatedData.name && validatedData.name !== existingOrganization.name) {
      const organizationWithSameName = await organizationRepository.findByName(validatedData.name);
      if (organizationWithSameName && organizationWithSameName.id !== id) {
        return NextResponse.json(
          { error: `Organization with name '${validatedData.name}' already exists` },
          { status: 409 }
        );
      }
    }
    
    // Update organization
    const updatedOrganization = await organizationRepository.update(id, validatedData);
    
    return NextResponse.json(updatedOrganization);
  } catch (error: any) {
    console.error(`Error updating organization with ID '${params.id}':`, error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating the organization' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/organizations/[id] - Delete an organization
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const { id } = params;
    
    // Get organization repository
    const organizationRepository = await getOrganizationRepository();
    
    // Check if organization exists
    const existingOrganization = await organizationRepository.findById(id);
    if (!existingOrganization) {
      return NextResponse.json(
        { error: `Organization with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Delete organization
    const deleted = await organizationRepository.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: `Failed to delete organization with ID '${id}'` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting organization with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while deleting the organization' },
      { status: 500 }
    );
  }
}
