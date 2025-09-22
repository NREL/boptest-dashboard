import crypto from 'crypto';
import {Request, Response} from 'express';

export const CSRF_HEADER_NAME = 'x-csrf-token';

export function ensureSessionCsrfToken(req: Request): string {
  if (!req.session) {
    throw new Error('Session is not initialized');
  }

  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  return req.session.csrfToken;
}

export function validateSessionCsrf(req: Request, res: Response): boolean {
  // Skip CSRF validation when using API keys (Authorization header present)
  if (req.headers.authorization) {
    return true;
  }

  if (!req.session || !req.session.csrfToken) {
    res.status(403).json({error: 'Missing CSRF token'});
    return false;
  }

  const headerValue = req.headers[CSRF_HEADER_NAME] as string | undefined;

  if (!headerValue || headerValue !== req.session.csrfToken) {
    res.status(403).json({error: 'Invalid CSRF token'});
    return false;
  }

  return true;
}
