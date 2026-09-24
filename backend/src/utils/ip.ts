import { Request } from 'express';

export const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  let ipStr = '';
  if (typeof forwarded === 'string') {
    ipStr = forwarded;
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    ipStr = forwarded[0] || '';
  }
  return (ipStr ? ipStr.split(',')[0]?.trim() : req.socket?.remoteAddress) || '127.0.0.1';
};
