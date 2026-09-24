import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { crudSchemas } from '../schemas';

const validEntities = ['portfolios', 'experiences', 'organizations'];

export const getEntityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const entity = req.params.entity as string;
    const id = req.params.id as string;
    
    if (!validEntities.includes(entity)) {
      res.status(404).json({ success: false, error: 'Endpoint not found' });
      return;
    }

    const { data, error } = await supabase.from(entity).select('*').eq('id', id).single();
    
    if (error) {
      if (error.code === 'PGRST116' || error.code === '22P02') {
        res.status(404).json({ success: false, error: `${entity} not found` });
        return;
      }
      throw error;
    }
    
    if (!data) {
      res.status(404).json({ success: false, error: `${entity} not found` });
      return;
    }

    // Unified format transformation to prevent Frontend crashes
    let unifiedData: Record<string, unknown> = {};
    
    if (entity === 'portfolios') {
      unifiedData = {
        name: data.title || '',
        role: 'Project / Portfolio',
        period: data.created_at ? new Date(data.created_at).getFullYear().toString() : '',
        description: data.description || '',
        detail_content: data.content || '',
        logo: data.image_url || '',
      };
    } else if (entity === 'experiences') {
      unifiedData = {
        name: data.company_name || '',
        role: data.role || '',
        period: `${data.start_date || ''} - ${data.is_current ? 'Present' : (data.end_date || 'Present')}`,
        description: data.description || '',
        detail_content: data.description || '', 
        logo: '',
      };
    } else if (entity === 'organizations') {
      unifiedData = {
        name: data.org_name || '',
        role: data.role || '',
        period: `${data.start_date || ''} - ${data.is_current ? 'Present' : (data.end_date || 'Present')}`,
        description: data.description || '',
        detail_content: data.description || '',
        logo: '',
      };
    }

    res.json({ success: true, data: { ...data, ...unifiedData } });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const createEntity = async (req: Request, res: Response): Promise<void> => {
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

    const parsedData = parseResult.data as Record<string, unknown>;
    if (!parsedData.user_id) {
      res.status(400).json({ success: false, error: 'user_id is required for creation' });
      return;
    }

    const { data, error } = await supabase.from(entity).insert([parsedData]).select().single();
    if (error) throw error;

    res.status(201).json({ success: true, message: `${entity} created`, data });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateEntity = async (req: Request, res: Response): Promise<void> => {
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

    const parsedData = parseResult.data as Record<string, unknown>;
    const payload = { ...parsedData, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from(entity).update(payload).eq('id', id).select().single();
    if (error) throw error;

    res.json({ success: true, message: `${entity} updated`, data });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteEntity = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
