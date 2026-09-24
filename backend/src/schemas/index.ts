import { z } from 'zod';

export const tapSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  source: z.string().optional(),
  location: z.string().optional()
});

export const profileSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(1, 'Full name is required'),
  bio: z.string().optional(),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  github_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  cv_url: z.string().url('Invalid URL').optional().or(z.literal(''))
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(1, 'Message is required')
});

export const crudSchemas: Record<string, z.ZodObject<any>> = {
  portfolios: z.object({
    user_id: z.string().uuid('Invalid User ID').optional(),
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    project_url: z.string().optional().nullable(),
    image_url: z.string().optional().nullable(),
    gallery: z.array(z.string()).optional().nullable(),
    tags: z.array(z.string()).optional().nullable()
  }),
  experiences: z.object({
    user_id: z.string().uuid('Invalid User ID').optional(),
    company_name: z.string().min(1, 'Company name is required').optional(),
    role: z.string().min(1, 'Role is required').optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    is_current: z.boolean().optional()
  }),
  organizations: z.object({
    user_id: z.string().uuid('Invalid User ID').optional(),
    org_name: z.string().min(1, 'Organization name is required').optional(),
    role: z.string().min(1, 'Role is required').optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    is_current: z.boolean().optional()
  })
};
