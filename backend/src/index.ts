import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import { createClient } from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Webhook Helper
const sendWebhookNotification = async (message: string) => {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message, content: message }) // 'text' for slack/mattermost, 'content' for discord
    });
  } catch (error) {
    console.error('Webhook notification failed:', error);
  }
};

// Utility to get IP address safely
const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  let ipStr = '';
  if (typeof forwarded === 'string') {
    ipStr = forwarded;
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    ipStr = forwarded[0] || '';
  }
  return (ipStr ? ipStr.split(',')[0]?.trim() : req.socket?.remoteAddress) || '127.0.0.1';
};

// 1. Setup Express & Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- Rate Limiting ---
const tapRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIp(req),
});

// --- Zod Schemas ---
const tapSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  source: z.string().optional(),
  location: z.string().optional()
});

const profileSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(1, 'Full name is required'),
  bio: z.string().optional(),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  github_url: z.string().url('Invalid URL').optional().or(z.literal(''))
});

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(1, 'Message is required')
});

const crudSchemas: Record<string, z.ZodObject<any>> = {
  portfolios: z.object({
    user_id: z.string().uuid('Invalid User ID').optional(),
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    project_url: z.string().optional().nullable(),
    image_url: z.string().optional().nullable(),
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

// --- Admin Auth Middleware ---
const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  let username = '';
  let password = '';
  
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Basic ')) {
    const b64auth = authHeader.split(' ')[1] || '';
    const decoded = Buffer.from(b64auth, 'base64').toString();
    const splitIndex = decoded.indexOf(':');
    if (splitIndex !== -1) {
      username = decoded.substring(0, splitIndex);
      password = decoded.substring(splitIndex + 1);
    }
  } else {
    username = (req.headers['x-admin-username'] as string) || (req.body?.adminUsername as string) || (req.query?.adminUsername as string) || '';
    password = (req.headers['x-admin-password'] as string) || (req.body?.adminPassword as string) || (req.query?.adminPassword as string) || '';
  }

  const validUsername = process.env.ADMIN_USERNAME || 'Nayaka21060112';
  const validPassword = process.env.ADMIN_PASSWORD || 'Akuganteng_21';

  if (username === validUsername && password === validPassword) {
    next();
  } else {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid Username or Password' });
  }
};

// --- REST API Endpoints ---

// GET /api/export-cv/:username
// Generate PDF Resume real-time
app.get('/api/export-cv/:username', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    const { data: user } = await supabase.from('users').select('*').eq('username', username).single();
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const [
      { data: experiences },
      { data: organizations },
      { data: portfolios }
    ] = await Promise.all([
      supabase.from('experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
      supabase.from('organizations').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
      supabase.from('portfolios').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    const doc = new PDFDocument({ margin: 50 });
    const filename = `${user.full_name.replace(/\s+/g, '_')}_CV.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(24).text(user.full_name, { align: 'center' });
    doc.fontSize(12).text(`${user.email} | ${user.phone || ''}`, { align: 'center' });
    doc.moveDown();
    
    if (user.bio) {
      doc.fontSize(14).text('Profile', { underline: true });
      doc.fontSize(12).text(user.bio);
      doc.moveDown();
    }

    if (experiences && experiences.length > 0) {
      doc.fontSize(14).text('Experience', { underline: true });
      experiences.forEach((exp: any) => {
        doc.fontSize(12).font('Helvetica-Bold').text(`${exp.role} at ${exp.company_name}`);
        doc.font('Helvetica').text(`${exp.start_date} - ${exp.is_current ? 'Present' : (exp.end_date || '')}`);
        if (exp.description) doc.text(exp.description);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    if (organizations && organizations.length > 0) {
      doc.fontSize(14).text('Organizations', { underline: true });
      organizations.forEach((org: any) => {
        doc.fontSize(12).font('Helvetica-Bold').text(`${org.role} at ${org.org_name}`);
        doc.font('Helvetica').text(`${org.start_date} - ${org.is_current ? 'Present' : (org.end_date || '')}`);
        if (org.description) doc.text(org.description);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    if (portfolios && portfolios.length > 0) {
      doc.fontSize(14).text('Projects', { underline: true });
      portfolios.forEach((port: any) => {
        doc.fontSize(12).font('Helvetica-Bold').text(port.title);
        if (port.project_url) doc.font('Helvetica-Oblique').text(port.project_url, { link: port.project_url, underline: true });
        if (port.description) doc.font('Helvetica').text(port.description);
        doc.moveDown(0.5);
      });
    }

    doc.end();
  } catch (error: any) {
    console.error('Error generating PDF:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error generating PDF' });
  }
});

// POST /api/contact
// Contact Form Endpoint
app.post('/api/contact', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.issues });
      return;
    }

    const { name, email, message } = parseResult.data;
    
    // Notify via Webhook
    await sendWebhookNotification(`📩 **New Contact Message**\n**From:** ${name} (${email})\n**Message:**\n${message}`);

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error: any) {
    console.error('Error in contact form:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/auth/login
// Endpoint for Frontend CMS login
app.post('/api/auth/login', (req: Request, res: Response): void => {
  const { username, password } = req.body;
  
  const validUsername = process.env.ADMIN_USERNAME || 'Nayaka21060112';
  const validPassword = process.env.ADMIN_PASSWORD || 'Akuganteng_21';

  if (username === validUsername && password === validPassword) {
    // Return success. You can also generate a JWT token here if your frontend requires it.
    res.json({ 
      success: true, 
      message: 'Login successful',
      data: {
        token: Buffer.from(`${username}:${password}`).toString('base64') // Basic Auth token for subsequent requests
      }
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid Username or Password' });
  }
});

// GET /api/profile/:username
// Fetch user profile, portfolios, experiences, and organizations
app.get('/api/profile/:username', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    // Fetch user profile
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, full_name, bio, avatar_url, contact_email, phone, linkedin_url, github_url')
      .eq('username', username)
      .single();

    if (userError || !user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Fetch user portfolios, experiences, and organizations concurrently
    const [
      { data: portfolios, error: portError },
      { data: experiences, error: expError },
      { data: organizations, error: orgError }
    ] = await Promise.all([
      supabase.from('portfolios').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
      supabase.from('organizations').select('*').eq('user_id', user.id).order('start_date', { ascending: false })
    ]);

    if (portError) throw portError;
    if (expError) throw expError;
    if (orgError) throw orgError;

    res.json({
      success: true,
      data: {
        profile: user,
        portfolios: portfolios || [],
        experiences: experiences || [],
        organizations: organizations || []
      }
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/analytics/tap
// Record a tap on the NFC/QR card (Rate Limited)
app.post('/api/analytics/tap', tapRateLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = tapSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.issues });
      return;
    }

    const { username, source, location } = parseResult.data;

    // Find the user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (userError || !user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = getClientIp(req);
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

    // Record tap
    const { error: tapError } = await supabase
      .from('tap_analytics')
      .insert([
        {
          user_id: user.id,
          source: source || 'direct',
          user_agent: userAgent,
          ip_hash: ipHash,
          location: location || null
        }
      ]);

    if (tapError) throw tapError;

    // Send Webhook Notification async
    sendWebhookNotification(`🔔 **NFC/QR Card Tapped!**\n**User:** ${username}\n**Source:** ${source || 'direct'}\n**IP Hash:** ${ipHash}`);

    res.status(201).json({ success: true, message: 'Tap recorded successfully' });
  } catch (error: any) {
    console.error('Error recording tap:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/profile
// Create or update a user profile (Admin Protected)
app.post('/api/profile', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = profileSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.issues });
      return;
    }

    const { 
      username, email, full_name, bio, avatar_url, 
      contact_email, phone, linkedin_url, github_url 
    } = parseResult.data;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    let result;
    if (existingUser) {
      // Update existing
      result = await supabase
        .from('users')
        .update({
          email, full_name, bio, avatar_url, 
          contact_email, phone, linkedin_url, github_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id)
        .select()
        .single();
    } else {
      // Insert new
      result = await supabase
        .from('users')
        .insert([{
          username, email, full_name, bio, avatar_url, 
          contact_email, phone, linkedin_url, github_url
        }])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    res.status(existingUser ? 200 : 201).json({ 
      success: true, 
      message: existingUser ? 'Profile updated' : 'Profile created',
      data: result.data 
    });
  } catch (error: any) {
    console.error('Error creating/updating profile:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/dashboard
// Admin dashboard analytics overview
app.get('/api/dashboard', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: taps, error } = await supabase
      .from('tap_analytics')
      .select('*')
      .order('tapped_at', { ascending: true });

    if (error) throw error;
    if (!taps) {
      res.json({ success: true, data: { totalTaps: 0, recentTaps: [] } });
      return;
    }

    res.json({
      success: true,
      data: {
        totalTaps: taps.length,
        recentTaps: taps.slice(-10).reverse()
      }
    });
  } catch (error: any) {
    console.error('Error fetching dashboard:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// --- Dynamic CRUD for Portfolios, Experiences, Organizations ---
const validEntities = ['portfolios', 'experiences', 'organizations'];

app.post('/api/:entity', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const entity = req.params.entity as string;
    if (!validEntities.includes(entity)) {
      res.status(404).json({ success: false, error: 'Endpoint not found' });
      return;
    }

    const schema = crudSchemas[entity];
    if (!schema) {
      res.status(404).json({ success: false, error: 'Endpoint not found' });
      return;
    }
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.issues });
      return;
    }

    // Require user_id for creation
    const parsedData = parseResult.data as Record<string, any>;
    if (!parsedData.user_id) {
      res.status(400).json({ success: false, error: 'user_id is required for creation' });
      return;
    }

    const { data, error } = await supabase.from(entity).insert([parsedData]).select().single();
    if (error) throw error;

    res.status(201).json({ success: true, message: `${entity} created`, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/:entity/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const entity = req.params.entity as string;
    const id = req.params.id as string;
    if (!validEntities.includes(entity)) {
      res.status(404).json({ success: false, error: 'Endpoint not found' });
      return;
    }

    const schema = crudSchemas[entity];
    if (!schema) {
      res.status(404).json({ success: false, error: 'Endpoint not found' });
      return;
    }
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.issues });
      return;
    }

    const parsedData = parseResult.data as Record<string, any>;
    const payload = { ...parsedData, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from(entity).update(payload).eq('id', id).select().single();
    if (error) throw error;

    res.json({ success: true, message: `${entity} updated`, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/:entity/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const entity = req.params.entity as string;
    const id = req.params.id as string;
    if (!validEntities.includes(entity)) {
      res.status(404).json({ success: false, error: 'Endpoint not found' });
      return;
    }

    const { error } = await supabase.from(entity).delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: `${entity} deleted successfully` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
