import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { tapSchema } from '../schemas';
import { getClientIp } from '../utils/ip';
import { sendWebhookNotification } from '../utils/webhook';
import crypto from 'crypto';

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: unknown) {
    console.error('Error fetching dashboard:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const recordTap = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = tapSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.issues });
      return;
    }

    const { username, source, location } = parseResult.data;

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

    sendWebhookNotification(`🔔 **NFC/QR Card Tapped!**\n**User:** ${username}\n**Source:** ${source || 'direct'}\n**IP Hash:** ${ipHash}`);

    res.status(201).json({ success: true, message: 'Tap recorded successfully' });
  } catch (error: unknown) {
    console.error('Error recording tap:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
