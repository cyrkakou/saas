import { z } from 'zod';

// Report type enum
export enum ReportType {
  FINANCIAL = 'financial',
  USAGE = 'usage',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom',
}

// Report entity schema
export const ReportSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum([
    ReportType.FINANCIAL,
    ReportType.USAGE,
    ReportType.PERFORMANCE,
    ReportType.CUSTOM,
  ]),
  config: z.string(), // JSON configuration for the report
  createdById: z.string().optional(),
  organizationId: z.string().optional(),
  isPublic: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Report entity type
export type Report = z.infer<typeof ReportSchema>;

// Create report input schema
export const CreateReportSchema = ReportSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;

// Update report input schema
export const UpdateReportSchema = ReportSchema.partial().omit({ 
  id: true, 
  createdById: true,
  createdAt: true, 
  updatedAt: true 
});

export type UpdateReportInput = z.infer<typeof UpdateReportSchema>;
