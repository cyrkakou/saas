import { Report, CreateReportInput, UpdateReportInput, ReportType } from '../entities/report';

/**
 * Report repository interface
 */
export interface ReportRepository {
  /**
   * Find a report by ID
   */
  findById(id: string): Promise<Report | null>;

  /**
   * Find reports by type
   */
  findByType(type: ReportType): Promise<Report[]>;

  /**
   * Find reports by organization
   */
  findByOrganization(organizationId: string): Promise<Report[]>;

  /**
   * Find reports by creator
   */
  findByCreator(userId: string): Promise<Report[]>;

  /**
   * Find all reports
   */
  findAll(): Promise<Report[]>;

  /**
   * Find all public reports
   */
  findPublic(): Promise<Report[]>;

  /**
   * Create a new report
   */
  create(data: CreateReportInput): Promise<Report>;

  /**
   * Update a report
   */
  update(id: string, data: UpdateReportInput): Promise<Report>;

  /**
   * Delete a report
   */
  delete(id: string): Promise<boolean>;
}
