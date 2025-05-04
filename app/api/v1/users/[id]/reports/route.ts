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
    const validationSchema = z.object({
      reportId: z.string(),
    });

    const { reportId } = validationSchema.parse(body);

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

    // Since createdById is omitted from UpdateReportSchema, we need to use a workaround
    // First, get the current report data
    const currentReport = await reportRepository.findById(reportId);

    // Then update with allowed fields
    const updatedReport = await reportRepository.update(reportId, {
      name: currentReport?.name || '',
      description: currentReport?.description,
      type: currentReport?.type,
      config: currentReport?.config || '{}',
      organizationId: currentReport?.organizationId,
      isPublic: currentReport?.isPublic
    });

    // Now manually update the database to set createdById
    const db = await import('@/infrastructure/database/core/database-service').then(m => m.getDb());
    const schema = await import('@/infrastructure/database/core/database-service').then(m => m.getSchema());
    const { eq } = await import('drizzle-orm');

    await db.update(schema.reports)
      .set({ createdById: id })
      .where(eq(schema.reports.id, reportId));

    // Get the updated report
    const finalReport = await reportRepository.findById(reportId);

    return NextResponse.json(finalReport);
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
