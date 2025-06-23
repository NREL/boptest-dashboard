import express from 'express';

import {AccountEntity} from '../models/Account';
import {getAPIKeyByHashedIdentifier, regenerateApiKey} from '../controllers/account';
import {authorizer} from './authRoutes';
import {Account} from './../../common/interfaces';
import {getRepository} from 'typeorm';

export const accountRouter = express.Router();

// Info endpoint
accountRouter.get('/info', (req: express.Request, res: express.Response) => {
  if (req.session && req.session.userId) {
    const response = {
      displayName: req.session.displayName || '',
      hashedIdentifier: req.session.hashedIdentifier || '',
      privileged: false,
      userId: req.session.userId ? Number(req.session.userId) : 0,
      shareAllResults: req.session.shareAllResults || false
    };
    return res.json(response);
  }
  
  if (req.user) {
    const response = {
      displayName: req.user.displayName || '',
      hashedIdentifier: req.user.hashedIdentifier || '',
      privileged: req.user.privileged || false,
      userId: req.user.id ? Number(req.user.id) : 0,
      shareAllResults: req.user.shareAllResults || false
    };
    return res.json(response);
  }
  
  res.json({
    displayName: '',
    hashedIdentifier: '',
    privileged: false,
    userId: 0,
    shareAllResults: false
  });
});

// Display name update endpoint
accountRouter.patch('/display-name', (req: express.Request, res: express.Response) => {
  try {
    // Get user ID from cookie
    let userId: number | null = null;
    if (req.headers.cookie) {
      const cookies: string[] = req.headers.cookie.split(';');
      for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith('auth_user=')) {
          try {
            const cookieValue = decodeURIComponent(trimmedCookie.substring('auth_user='.length));
            const userData = JSON.parse(cookieValue);
            userId = userData.id || userData.userId;
          } catch (e) {
            console.error('Error parsing cookie:', e);
          }
        }
      }
    }
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const newDisplayName = req.body.newDisplayName;
    if (!newDisplayName) {
      return res.status(400).json({ error: 'Display name is required' });
    }
    
    // Update in database
    const repo = getRepository<Account>(AccountEntity);
    repo.query('UPDATE accounts SET "displayName" = $1 WHERE id = $2 RETURNING id, "displayName"', [newDisplayName, userId])
      .then((result) => {
        // Update session
        if (req.session) {
          req.session.displayName = newDisplayName;
        }
        
        // Return success
        res.json({ success: true, displayName: newDisplayName });
      })
      .catch((err) => {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
      });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Move the API key endpoint before authorizer to ensure it's accessible with cookies
// API key endpoint - with cookie support
accountRouter.get('/key', (req: express.Request, res: express.Response) => {
  // Try to get hashedIdentifier from various sources
  let hashedIdentifier: string | null = null;
  
  // Check if user is already set by authorizer middleware
  if (req.user && req.user.hashedIdentifier) {
    hashedIdentifier = req.user.hashedIdentifier;
  } 
  // Check session data
  else if (req.session && req.session.hashedIdentifier) {
    hashedIdentifier = req.session.hashedIdentifier;
  }
  // Check auth_user cookie as fallback
  else if (req.headers.cookie) {
    try {
      const cookies: string[] = req.headers.cookie.split(';');
      for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith('auth_user=')) {
          try {
            const cookieValue = decodeURIComponent(trimmedCookie.substring('auth_user='.length));
            const userData = JSON.parse(cookieValue);
            if (userData && userData.hashedIdentifier) {
              hashedIdentifier = userData.hashedIdentifier;
              break;
            }
          } catch (e) {
            console.error('Error parsing auth_user cookie:', e);
          }
        }
      }
    } catch (e) {
      console.error('Error processing cookies:', e);
    }
  }
  
  // If we couldn't find a hashedIdentifier, return unauthorized
  if (!hashedIdentifier) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  
  // Get the API key using the hashedIdentifier
  getAPIKeyByHashedIdentifier(hashedIdentifier)
    .then((user: Account) => {
      res.json({"apiKey": user.apiKey});
    })
    .catch((err) => {
      console.error('Error retrieving API key:', err);
      res.status(500).json({ error: 'Failed to get API key' });
    });
});

// Regenerate API key endpoint - with cookie support
accountRouter.post('/regenerate-key', (req: express.Request, res: express.Response) => {
  // Try to get hashedIdentifier from various sources
  let hashedIdentifier: string | null = null;
  
  // Check if user is already set by authorizer middleware
  if (req.user && req.user.hashedIdentifier) {
    hashedIdentifier = req.user.hashedIdentifier;
  } 
  // Check session data
  else if (req.session && req.session.hashedIdentifier) {
    hashedIdentifier = req.session.hashedIdentifier;
  }
  // Check auth_user cookie as fallback
  else if (req.headers.cookie) {
    try {
      const cookies: string[] = req.headers.cookie.split(';');
      for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith('auth_user=')) {
          try {
            const cookieValue = decodeURIComponent(trimmedCookie.substring('auth_user='.length));
            const userData = JSON.parse(cookieValue);
            if (userData && userData.hashedIdentifier) {
              hashedIdentifier = userData.hashedIdentifier;
              break;
            }
          } catch (e) {
            console.error('Error parsing auth_user cookie:', e);
          }
        }
      }
    } catch (e) {
      console.error('Error processing cookies:', e);
    }
  }
  
  // If we couldn't find a hashedIdentifier, return unauthorized
  if (!hashedIdentifier) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  
  console.log(`Attempting to regenerate API key for hashedIdentifier: ${hashedIdentifier}`);
  
  // Regenerate the API key
  regenerateApiKey(hashedIdentifier)
    .then((user: Account) => {
      console.log('Successfully regenerated API key');
      res.json({"apiKey": user.apiKey, "success": true});
    })
    .catch((err) => {
      console.error('Error regenerating API key:', err);
      res.status(500).json({ error: 'Failed to regenerate API key', details: err.message });
    });
});

// Use authorizer for remaining routes
accountRouter.use(authorizer);

// Global share endpoint - with cookie support
accountRouter.patch('/global-share', (req: express.Request, res: express.Response) => {
  // Try to get userId from various sources
  let userId: number | null = null;
  
  // Check if user is already set by authorizer middleware
  if (req.user && req.user.id) {
    userId = req.user.id;
  } 
  // Check session data
  else if (req.session && req.session.userId) {
    userId = parseInt(req.session.userId);
  }
  // Check auth_user cookie as fallback
  else if (req.headers.cookie) {
    try {
      const cookies: string[] = req.headers.cookie.split(';');
      for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith('auth_user=')) {
          try {
            const cookieValue = decodeURIComponent(trimmedCookie.substring('auth_user='.length));
            const userData = JSON.parse(cookieValue);
            if (userData && (userData.id || userData.userId)) {
              userId = parseInt(userData.id || userData.userId);
              break;
            }
          } catch (e) {
            console.error('Error parsing auth_user cookie:', e);
          }
        }
      }
    } catch (e) {
      console.error('Error processing cookies:', e);
    }
  }
  
  // If we couldn't find a userId, return unauthorized
  if (!userId) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  
  const repo = getRepository<Account>(AccountEntity);
  repo.query('UPDATE accounts SET "shareAllResults" = $1 WHERE id = $2', [req.body.shareAllResults, userId])
    .then(() => {
      // Update session if available
      if (req.session) {
        req.session.shareAllResults = req.body.shareAllResults;
      }
      
      // Update cookie as well
      try {
        if (req.headers.cookie) {
          const cookies: string[] = req.headers.cookie.split(';');
          for (const cookie of cookies) {
            const trimmedCookie = cookie.trim();
            if (trimmedCookie.startsWith('auth_user=')) {
              try {
                const cookieValue = decodeURIComponent(trimmedCookie.substring('auth_user='.length));
                const userData = JSON.parse(cookieValue);
                
                // Get domain for cookies
                const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
                
                // Set updated cookie
                res.cookie('auth_user', JSON.stringify({
                  ...userData,
                  shareAllResults: req.body.shareAllResults
                }), { 
                  maxAge: 8*60*60*1000, // 8 hours
                  httpOnly: false,
                  path: '/',
                  sameSite: 'lax',
                  domain: cookieDomain
                });
                
                break;
              } catch (e) {
                // Silent fail - we still updated the database
              }
            }
          }
        }
      } catch (e) {
        // Silent fail - we still updated the database
      }
      
      res.json({ success: true });
    })
    .catch((err) => {
      console.error('Error updating share settings:', err);
      res.status(500).json({ error: 'Database error' });
    });
});