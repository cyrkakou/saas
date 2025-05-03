import { NextRequest, NextResponse } from 'next/server';
import { getReportRepository } from '@/infrastructure/database';
import { CreateReportSchema, ReportType } from '@/core/domain/entities/report';
import { initializeDatabase } from '@/lib/db-init';

/**
 * @route GET /api/v1/reports
 * @desc Get all reports with filtering options
 * @access Private
 */
export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Get report repository
    const reportRepository = await getReportRepository();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as ReportType | null;
    const organizationId = searchParams.get('organizationId');
    const createdById = searchParams.get('createdById');
    const isPublic = searchParams.get('isPublic') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    
    // Get reports based on filters
    let reports;
    
    if (type) {
      reports = await reportRepository.findByType(type);
    } else if (organizationId) {
      reports = await reportRepository.findByOrganization(organizationId);
    } else if (createdById) {
      reports = await reportRepository.findByCreator(createdById);
    } else if (searchParams.has('isPublic')) {
      reports = await reportRepository.findPublic();
    } else {
      reports = await reportRepository.findAll();
    }
    
    // Apply pagination if specified
    if (limit !== undefined && offset !== undefined) {
      reports = reports.slice(offset, offset + limit);
    } else if (limit !== undefined) {
      reports = reports.slice(0, limit);
    }
    
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching reports' },
      { status: 500 }
    );
  }
}

/**
 * @route POST /api/v1/reports
 * @desc Create a new report
 * @access Private
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Parse request body
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateReportSchema.parse(body);
    
    // Get report repository
    const reportRepository = await getReportRepository();
    
    // Create report
    const report = await reportRepository.create(validatedData);
    
    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error('Error creating report:', error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating the report' },
      { status: 500 }
    );
  }
}
