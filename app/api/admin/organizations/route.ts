import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationRepository } from '@/infrastructure/database';
import { CreateOrganizationSchema } from '@/core/domain/entities/organization';
import { initializeDatabase } from '@/lib/db-init';

// GET /api/admin/organizations - Get all organizations
export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Get organization repository
    const organizationRepository = await getOrganizationRepository();
    
    // Get all organizations
    const organizations = await organizationRepository.findAll();
    
    return NextResponse.json(organizations);
  } catch (error: any) {
    console.error('Error fetching organizations:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching organizations' },
      { status: 500 }
    );
  }
}

// POST /api/admin/organizations - Create a new organization
export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Parse request body
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateOrganizationSchema.parse(body);
    
    // Get organization repository
    const organizationRepository = await getOrganizationRepository();
    
    // Check if organization with the same name already exists
    const existingOrganization = await organizationRepository.findByName(validatedData.name);
    if (existingOrganization) {
      return NextResponse.json(
        { error: `Organization with name '${validatedData.name}' already exists` },
        { status: 409 }
      );
    }
    
    // Create organization
    const organization = await organizationRepository.create(validatedData);
    
    return NextResponse.json(organization, { status: 201 });
  } catch (error: any) {
    console.error('Error creating organization:', error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating the organization' },
      { status: 500 }
    );
  }
}
