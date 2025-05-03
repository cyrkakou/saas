import { NextRequest, NextResponse } from 'next/server';
import { getReportRepository } from '@/infrastructure/database';
import { UpdateReportSchema } from '@/core/domain/entities/report';
import { initializeDatabase } from '@/lib/db-init';

/**
 * @route GET /api/v1/reports/:id
 * @desc Get a report by ID
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
    
    // Get report repository
    const reportRepository = await getReportRepository();
    
    // Get report by ID
    const report = await reportRepository.findById(id);
    
    if (!report) {
      return NextResponse.json(
        { error: `Report with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(report);
  } catch (error: any) {
    console.error(`Error fetching report with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching the report' },
      { status: 500 }
    );
  }
}

/**
 * @route PUT /api/v1/reports/:id
 * @desc Update a report
 * @access Private
 */
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
    const validatedData = UpdateReportSchema.parse(body);
    
    // Get report repository
    const reportRepository = await getReportRepository();
    
    // Check if report exists
    const existingReport = await reportRepository.findById(id);
    if (!existingReport) {
      return NextResponse.json(
        { error: `Report with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Update report
    const updatedReport = await reportRepository.update(id, validatedData);
    
    return NextResponse.json(updatedReport);
  } catch (error: any) {
    console.error(`Error updating report with ID '${params.id}':`, error);
    
    // Check if it's a validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating the report' },
      { status: 500 }
    );
  }
}

/**
 * @route DELETE /api/v1/reports/:id
 * @desc Delete a report
 * @access Private
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const { id } = params;
    
    // Get report repository
    const reportRepository = await getReportRepository();
    
    // Check if report exists
    const existingReport = await reportRepository.findById(id);
    if (!existingReport) {
      return NextResponse.json(
        { error: `Report with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Delete report
    const deleted = await reportRepository.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: `Failed to delete report with ID '${id}'` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting report with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while deleting the report' },
      { status: 500 }
    );
  }
}
