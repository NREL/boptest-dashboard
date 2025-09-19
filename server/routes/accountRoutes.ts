import express from 'express';

import {getAPIKeyByHashedIdentifier, regenerateApiKey} from '../controllers/account';
import {authorizer} from './authRoutes';
import {Account} from './../../common/interfaces';
import {updateDisplayName as persistDisplayName, updateGlobalShare as persistGlobalShare} from '../models/Account';

export const accountRouter = express.Router();

function extractUserFromCookie(req: express.Request): { id?: number; hashedIdentifier?: string; shareAllResults?: boolean | null; displayName?: string } {
  if (!req.headers.cookie) {
    return {};
  }

  const cookies = req.headers.cookie.split(';');
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith('auth_user=')) {
      try {
        const value = decodeURIComponent(trimmedCookie.substring('auth_user='.length));
        const userData = JSON.parse(value);
        const id = userData.id || userData.userId;
        return {
          id: typeof id === 'number' ? id : parseInt(id, 10),
          hashedIdentifier: userData.hashedIdentifier,
          shareAllResults: userData.shareAllResults,
          displayName: userData.displayName,
        };
      } catch (error) {
        console.error('Error parsing auth_user cookie:', error);
      }
    }
  }

  return {};
}

function updateAuthCookie(
  req: express.Request,
  res: express.Response,
  updates: Record<string, unknown>
) {
  const existing = extractUserFromCookie(req);
  if (!existing.id && !existing.hashedIdentifier) {
    return;
  }

  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  res.cookie('auth_user', JSON.stringify({
    ...existing,
    ...updates,
  }), {
    maxAge: 8 * 60 * 60 * 1000,
    httpOnly: false,
    path: '/',
    sameSite: 'lax',
    domain: cookieDomain,
  });
}

// Info endpoint
accountRouter.get('/info', (req: express.Request, res: express.Response) => {
  if (req.session && req.session.userId) {
    return res.json({
      displayName: req.session.displayName || '',
      hashedIdentifier: req.session.hashedIdentifier || '',
      privileged: false,
      userId: Number(req.session.userId),
      shareAllResults: req.session.shareAllResults || false,
    });
  }

  if (req.user) {
    return res.json({
      displayName: req.user.displayName || '',
      hashedIdentifier: req.user.hashedIdentifier || '',
      privileged: req.user.privileged || false,
      userId: req.user.id ? Number(req.user.id) : 0,
      shareAllResults: req.user.shareAllResults || false,
    });
  }

  res.json({
    displayName: '',
    hashedIdentifier: '',
    privileged: false,
    userId: 0,
    shareAllResults: false,
  });
});

// Display name update endpoint
accountRouter.patch('/display-name', async (req: express.Request, res: express.Response) => {
  try {
    let userId: number | null = null;

    if (req.headers.cookie) {
      const {id} = extractUserFromCookie(req);
      if (id) {
        userId = id;
      }
    }

    if (!userId && req.session && req.session.userId) {
      userId = Number(req.session.userId);
    }

    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    const newDisplayName = req.body.newDisplayName;
    if (!newDisplayName) {
      return res.status(400).json({error: 'Display name is required'});
    }

    const updatedAccount = await persistDisplayName(userId, newDisplayName);
    if (!updatedAccount) {
      return res.status(404).json({error: 'Account not found'});
    }

    if (req.session) {
      req.session.displayName = newDisplayName;
    }

    updateAuthCookie(req, res, {displayName: newDisplayName});

    res.json({success: true, displayName: newDisplayName});
  } catch (err) {
    console.error('Server error updating display name:', err);
    res.status(500).json({error: 'Server error'});
  }
});

// API key endpoint - with cookie support
accountRouter.get('/key', (req: express.Request, res: express.Response) => {
  let hashedIdentifier: string | null = null;

  if (req.user && req.user.hashedIdentifier) {
    hashedIdentifier = req.user.hashedIdentifier;
  } else if (req.session && req.session.hashedIdentifier) {
    hashedIdentifier = req.session.hashedIdentifier;
  } else if (req.headers.cookie) {
    hashedIdentifier = extractUserFromCookie(req).hashedIdentifier || null;
  }

  if (!hashedIdentifier) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  getAPIKeyByHashedIdentifier(hashedIdentifier)
    .then((user: Account) => {
      res.json({apiKey: user.apiKey});
    })
    .catch(err => {
      console.error('Error retrieving API key:', err);
      res.status(500).json({error: 'Failed to get API key'});
    });
});

// Regenerate API key endpoint - with cookie support
accountRouter.post('/regenerate-key', (req: express.Request, res: express.Response) => {
  let hashedIdentifier: string | null = null;

  if (req.user && req.user.hashedIdentifier) {
    hashedIdentifier = req.user.hashedIdentifier;
  } else if (req.session && req.session.hashedIdentifier) {
    hashedIdentifier = req.session.hashedIdentifier;
  } else if (req.headers.cookie) {
    hashedIdentifier = extractUserFromCookie(req).hashedIdentifier || null;
  }

  if (!hashedIdentifier) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  regenerateApiKey(hashedIdentifier)
    .then((user: Account) => {
      res.json({apiKey: user.apiKey, success: true});
    })
    .catch(err => {
      console.error('Error regenerating API key:', err);
      res.status(500).json({error: 'Failed to regenerate API key', details: err.message});
    });
});

accountRouter.use(authorizer);

// Global share endpoint
accountRouter.patch('/global-share', async (req: express.Request, res: express.Response) => {
  try {
    let userId: number | null = null;

    if (req.user && req.user.id) {
      userId = req.user.id;
    } else if (req.session && req.session.userId) {
      userId = Number(req.session.userId);
    } else if (req.headers.cookie) {
      const {id} = extractUserFromCookie(req);
      if (id) {
        userId = id;
      }
    }

    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    const shareAllResults = req.body.shareAllResults ?? null;
    const updatedAccount = await persistGlobalShare(userId, shareAllResults);
    if (!updatedAccount) {
      return res.status(404).json({error: 'Account not found'});
    }

    if (req.session) {
      req.session.shareAllResults = shareAllResults;
    }

    updateAuthCookie(req, res, {shareAllResults});

    res.json({success: true});
  } catch (err) {
    console.error('Error updating share settings:', err);
    res.status(500).json({error: 'Server error'});
  }
});
