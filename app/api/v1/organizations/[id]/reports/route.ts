import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationRepository, getReportRepository } from '@/infrastructure/database';
import { initializeDatabase } from '@/lib/db-init';
import { z } from 'zod';

/**
 * @route GET /api/v1/organizations/:id/reports
 * @desc Get reports for an organization
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
    const reportRepository = await getReportRepository();
    
    // Check if organization exists
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      return NextResponse.json(
        { error: `Organization with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Get reports for the organization
    const reports = await reportRepository.findByOrganization(id);
    
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error(`Error fetching reports for organization with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching reports' },
      { status: 500 }
    );
  }
}

/**
 * @route POST /api/v1/organizations/:id/reports
 * @desc Assign a report to an organization
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
      reportId: z.string(),
    });
    
    const { reportId } = schema.parse(body);
    
    // Get repositories
    const organizationRepository = await getOrganizationRepository();
    const reportRepository = await getReportRepository();
    
    // Check if organization exists
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      return NextResponse.json(
        { error: `Organization with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Check if report exists
    const report = await reportRepository.findById(reportId);
    if (!report) {
      return NextResponse.json(
        { error: `Report with ID '${reportId}' not found` },
        { status: 404 }
      );
    }
    
    // Update report to assign it to the organization
    const updatedReport = await reportRepository.update(reportId, {
      organizationId: id
    });
    
    return NextResponse.json(updatedReport);
  } catch (error: any) {
    console.error(`Error assigning report to organization with ID '${params.id}':`, error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while assigning the report' },
      { status: 500 }
    );
  }
}

/**
 * @route DELETE /api/v1/organizations/:id/reports/:reportId
 * @desc Remove a report from an organization
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
      reportId: z.string(),
    });
    
    const { reportId } = schema.parse(body);
    
    // Get repositories
    const organizationRepository = await getOrganizationRepository();
    const reportRepository = await getReportRepository();
    
    // Check if organization exists
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      return NextResponse.json(
        { error: `Organization with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Check if report exists and belongs to the organization
    const report = await reportRepository.findById(reportId);
    if (!report) {
      return NextResponse.json(
        { error: `Report with ID '${reportId}' not found` },
        { status: 404 }
      );
    }
    
    if (report.organizationId !== id) {
      return NextResponse.json(
        { error: `Report with ID '${reportId}' is not assigned to this organization` },
        { status: 400 }
      );
    }
    
    // Update report to remove it from the organization
    const updatedReport = await reportRepository.update(reportId, {
      organizationId: null
    });
    
    return NextResponse.json(updatedReport);
  } catch (error: any) {
    console.error(`Error removing report from organization with ID '${params.id}':`, error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while removing the report' },
      { status: 500 }
    );
  }
}
