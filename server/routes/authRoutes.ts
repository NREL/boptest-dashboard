import express from 'express';
import passport from 'passport';
import {Account} from './../../common/interfaces';
import {getAccountById, getAccountByAPIKey} from '../controllers/account';
import {configurePassport} from '../oauth';

// Get super users from environment (now using hashedIdentifiers)
const superUsers: string = process.env.SUPER_USERS || '';
const superUserIds: string[] = superUsers.split(',');

// Middleware to authorize a request using a key or a session
export function authorizer(req: express.Request, res: express.Response, next: express.NextFunction) {
  const key = req.header('Authorization');

  if (key) {
    getAccountByAPIKey(key).then((account: Account) => {
      req.user = account;
      // Super users are now identified by hashedIdentifier
      req.user.privileged = superUserIds.includes(account.hashedIdentifier);
      next();
    }).catch(err => {
      res.status(401).json({error: 'Not Authorized'});
    });
  } else if(req.session && req.session.userId) {
    getAccountById(parseInt(req.session.userId)).then((account: Account) => {
      req.user = account;
      next();
    }).catch(err => {
      res.status(500).json(err);
    });
  } else {
    res.status(401).json({error: 'Not Authorized'});
  }
};

export const authRouter = express.Router();

// Configure passport for OAuth
authRouter.use(passport.initialize());
configurePassport();

// OAuth routes
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

authRouter.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: express.Request, res: express.Response) => {
    // Set session variables (PII-free)
    if (req.user && req.session) {
      const user = req.user as Account;
      req.session.displayName = user.displayName;
      req.session.userId = `${user.id}`;
      req.session.hashedIdentifier = user.hashedIdentifier;
      req.session.shareAllResults = user.shareAllResults;
      
      // Get the domain for cookies from environment, default to undefined (current domain)
      const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
      
      // Set a simple cookie for additional authentication tracking
      res.cookie('auth_status', 'logged_in', { 
        maxAge: 8*60*60*1000, // 8 hours
        httpOnly: false, // Allow JavaScript to read this cookie
        path: '/',
        sameSite: 'lax', // Balance between security and functionality
        domain: cookieDomain
      });
      
      // Set a cookie with user data as a fallback for session persistence
      res.cookie('auth_user', JSON.stringify({
        displayName: user.displayName,
        hashedIdentifier: user.hashedIdentifier,
        userId: user.id
      }), { 
        maxAge: 8*60*60*1000, // 8 hours
        httpOnly: false, // Allow JavaScript to read this cookie
        path: '/',
        sameSite: 'lax', // Balance between security and functionality
        domain: cookieDomain
      });
      
      // Save the session explicitly with a callback
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
        }
        // Always redirect with the success parameter and timestamp
        // The timestamp ensures the URL is always unique to prevent caching issues
        res.redirect('/?login=success&t=' + new Date().getTime());
      });
    } else {
      console.error('Google OAuth Callback - No user or session');
      res.redirect('/login?error=no_user_or_session');
    }
  }
);

authRouter.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}));

authRouter.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req: express.Request, res: express.Response) => {
    // Set session variables (PII-free)
    if (req.user && req.session) {
      const user = req.user as Account;
      req.session.displayName = user.displayName;
      req.session.userId = `${user.id}`;
      req.session.hashedIdentifier = user.hashedIdentifier;
      req.session.shareAllResults = user.shareAllResults;
      
      // Get the domain for cookies from environment, default to undefined (current domain)
      const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
      
      // Set a simple cookie for additional authentication tracking
      res.cookie('auth_status', 'logged_in', { 
        maxAge: 8*60*60*1000, // 8 hours
        httpOnly: false, // Allow JavaScript to read this cookie
        path: '/',
        sameSite: 'lax', // Balance between security and functionality
        domain: cookieDomain
      });
      
      // Set a cookie with user data as a fallback for session persistence
      res.cookie('auth_user', JSON.stringify({
        displayName: user.displayName,
        hashedIdentifier: user.hashedIdentifier,
        userId: user.id
      }), { 
        maxAge: 8*60*60*1000, // 8 hours
        httpOnly: false, // Allow JavaScript to read this cookie
        path: '/',
        sameSite: 'lax', // Balance between security and functionality
        domain: cookieDomain
      });
      
      // Save the session explicitly with a callback
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
        }
        // Always redirect with the success parameter and timestamp
        // The timestamp ensures the URL is always unique to prevent caching issues
        res.redirect('/?login=success&t=' + new Date().getTime());
      });
    } else {
      console.error('GitHub OAuth Callback - No user or session');
      res.redirect('/login?error=no_user_or_session');
    }
  }
);

// Direct endpoint to check authentication status
authRouter.get('/status', (req: express.Request, res: express.Response) => {
  // Try to identify the user from various sources
  let userId: string | number | null = null;
  let displayName: string | null = null;
  let hashedIdentifier: string | null = null;
  let shareAllResults: boolean | null = null;
  
  // First, check if we have a session with user data
  if (req.session && req.session.userId) {
    userId = req.session.userId;
    displayName = req.session.displayName || '';
    hashedIdentifier = req.session.hashedIdentifier || '';
    shareAllResults = req.session.shareAllResults || false;
  } 
  // Next, check if we have user data from passport
  else if (req.user) {
    userId = req.user.id;
    displayName = req.user.displayName || '';
    hashedIdentifier = req.user.hashedIdentifier || '';
    shareAllResults = req.user.shareAllResults || false;
  }
  // Finally, check for auth_user cookie as a fallback
  else if (req.headers.cookie) {
    const cookies: string[] = req.headers.cookie.split(';');
    for (const cookie of cookies) {
      const trimmedCookie = cookie.trim();
      if (trimmedCookie.startsWith('auth_user=')) {
        try {
          const cookieValue = decodeURIComponent(trimmedCookie.substring('auth_user='.length));
          const userData = JSON.parse(cookieValue);
          
          userId = userData.id || userData.userId;
          displayName = userData.displayName || '';
          hashedIdentifier = userData.hashedIdentifier || '';
          // Note: We don't set shareAllResults from cookie as it's not stored there
          
          // If we have a userId from cookie, try to fetch the latest user data
          if (userId) {
            import('../controllers/account').then(module => {
              module.getAccountById(Number(userId))
                .then(account => {
                  // Update session with fresh data if available
                  if (req.session) {
                    req.session.displayName = account.displayName;
                    req.session.userId = `${account.id}`;
                    req.session.hashedIdentifier = account.hashedIdentifier;
                    req.session.shareAllResults = account.shareAllResults;
                  }
                })
                .catch(err => {
                  // Silently fail, we'll use the cookie data
                });
            });
          }
        } catch (e) {
          // Silently fail on cookie parsing issues
        }
      }
    }
  }
  
  // Enable test user if explicitly requested (development only)
  const useTestUser = req.query.test_user === 'true';
  
  if (useTestUser && process.env.CONTEXT === 'dev') {
    return res.json({
      authenticated: true,
      user: {
        displayName: 'Test User',
        hashedIdentifier: 'test-user-hash',
        userId: '999',
        shareAllResults: false
      }
    });
  }
  
  // Return authenticated response if we found a user
  if (userId) {
    // Check if user is an admin (super user)
    const isAdmin = hashedIdentifier ? superUserIds.includes(hashedIdentifier) : false;
    
    return res.json({
      authenticated: true,
      user: {
        displayName: displayName || '',
        hashedIdentifier: hashedIdentifier || '',
        userId: userId.toString(),
        shareAllResults: shareAllResults || false,
        isAdmin: isAdmin
      }
    });
  }
  
  // Default to not authenticated
  return res.json({
    authenticated: false
  });
});

// Update display name endpoint
authRouter.post('/updateDisplayName', authorizer, (req: express.Request, res: express.Response) => {
  if (!req.user || !req.body.displayName) {
    return res.status(400).json({error: 'Missing display name'});
  }
  
  const userId = req.user.id;
  const newDisplayName = req.body.displayName;
  
  // Import is used here to avoid circular dependencies
  import('../models/Account').then(module => {
    module.updateDisplayName(userId, newDisplayName)
      .then(() => {
        if (req.session) {
          req.session.displayName = newDisplayName;
        }
        res.status(200).send('Display name updated successfully');
      })
      .catch(err => res.status(500).json(err));
  }).catch(err => {
    res.status(500).json({error: 'Failed to import Account module', details: err});
  });
});

// Logout endpoint
authRouter.post('/logout', (req: express.Request, res: express.Response) => {
  // Get the domain for cookies from environment, default to undefined (current domain)
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  
  // Clear all auth cookies with proper options
  res.clearCookie('auth_status', {
    path: '/',
    domain: cookieDomain
  });
  
  res.clearCookie('auth_user', {
    path: '/',
    domain: cookieDomain
  });
  
  // Clear session cookie
  if (process.env.SESSION_NAME) {
    res.clearCookie(process.env.SESSION_NAME, {
      path: '/',
      domain: cookieDomain
    });
  }
  
  // Destroy the session
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.log('Unable to destroy session', err);
      }
    });
  }
  
  // Always return success to avoid confusing the user
  res.status(200).send('Logged out successfully');
});