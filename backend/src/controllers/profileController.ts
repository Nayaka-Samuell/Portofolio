import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { profileSchema } from '../schemas';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, full_name, bio, avatar_url, contact_email, phone, linkedin_url, github_url, cv_url')
      .eq('username', username)
      .single();

    if (userError || !user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

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
  } catch (error: unknown) {
    console.error('Error fetching profile:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const upsertProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = profileSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.issues });
      return;
    }

    const { 
      username, email, full_name, bio, avatar_url, 
      contact_email, phone, linkedin_url, github_url, cv_url
    } = parseResult.data;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    let result;
    if (existingUser) {
      result = await supabase
        .from('users')
        .update({
          email, full_name, bio, avatar_url, 
          contact_email, phone, linkedin_url, github_url, cv_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('users')
        .insert([{
          username, email, full_name, bio, avatar_url, 
          contact_email, phone, linkedin_url, github_url, cv_url
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
  } catch (error: unknown) {
    console.error('Error creating/updating profile:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const uploadCV = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const username = req.body.username || req.query.username;

    if (!file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }
    if (!username) {
      res.status(400).json({ success: false, error: 'Username is required' });
      return;
    }

    const { data: user } = await supabase.from('users').select('id').eq('username', username).single();
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${username}-cv-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage.from('cvs').getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from('users')
      .update({ cv_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) throw updateError;

    res.json({ success: true, message: 'CV uploaded successfully', data: { cv_url: publicUrl } });
  } catch (error: unknown) {
    console.error('Error uploading CV:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
