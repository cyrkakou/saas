import { NextRequest, NextResponse } from 'next/server';
import { getUserRepository, getReportRepository } from '@/infrastructure/database';
import { initializeDatabase } from '@/lib/db-init';
import { z } from 'zod';

/**
 * @route GET /api/v1/users/:id/reports
 * @desc Get reports created by a user
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
    const reportRepository = await getReportRepository();
    
    // Check if user exists
    const user = await userRepository.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: `User with ID '${id}' not found` },
        { status: 404 }
      );
    }
    
    // Get reports created by the user
    const reports = await reportRepository.findByCreator(id);
    
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error(`Error fetching reports for user with ID '${params.id}':`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching reports' },
      { status: 500 }
    );
  }
}

/**
 * @route POST /api/v1/users/:id/reports
 * @desc Assign a report to a user (as creator)
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
    const userRepository = await getUserRepository();
    const reportRepository = await getReportRepository();
    
    // Check if user exists
    const user = await userRepository.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: `User with ID '${id}' not found` },
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
    
    // Update report to assign it to the user
    const updatedReport = await reportRepository.update(reportId, {
      createdById: id
    });
    
    return NextResponse.json(updatedReport);
  } catch (error: any) {
    console.error(`Error assigning report to user with ID '${params.id}':`, error);
    
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
