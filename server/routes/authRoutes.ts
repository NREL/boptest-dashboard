import express from 'express';
import passport from 'passport';
import {Account} from './../../common/interfaces';
import {getAccountById, getAccountByAPIKey} from '../controllers/account';
import {configurePassport} from '../oauth';
import {ensureSessionCsrfToken} from '../utils/security';

type PrivilegedAccount = Account & {
  privileged?: boolean;
};

const superUsers: string = process.env.SUPER_USERS || '';
const superUserIds: string[] = superUsers
  .split(',')
  .map(id => id.trim())
  .filter(id => id.length > 0);

export function authorizer(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const key = req.header('Authorization');

  if (key) {
    getAccountByAPIKey(key)
      .then((account: Account) => {
        const enriched: PrivilegedAccount = {
          ...account,
          privileged: superUserIds.includes(account.hashedIdentifier),
        };
        req.user = enriched;
        next();
      })
      .catch(() => {
        res.status(401).json({error: 'Not Authorized'});
      });
    return;
  }

  if (req.session && req.session.userId) {
    const id = Number(req.session.userId);
    if (Number.isNaN(id)) {
      res.status(401).json({error: 'Not Authorized'});
      return;
    }

    getAccountById(id)
      .then((account: Account) => {
        const enriched: PrivilegedAccount = {
          ...account,
          privileged: superUserIds.includes(account.hashedIdentifier),
        };
        req.user = enriched;
        next();
      })
      .catch(() => {
        res.status(401).json({error: 'Not Authorized'});
      });
    return;
  }

  res.status(401).json({error: 'Not Authorized'});
}

export const authRouter = express.Router();

authRouter.use(passport.initialize());
configurePassport();

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {failureRedirect: '/login', session: true}),
  (req: express.Request, res: express.Response) => {
    if (!req.user || !req.session) {
      res.redirect('/login?error=no_user_or_session');
      return;
    }

    const user = req.user as Account;
    req.session.displayName = user.displayName;
    req.session.userId = `${user.id}`;
    req.session.hashedIdentifier = user.hashedIdentifier;
    req.session.shareAllResults = user.shareAllResults;
    ensureSessionCsrfToken(req);

    req.session.save(err => {
      if (err) {
        console.error('Error saving session:', err);
      }
      res.redirect('/?login=success&t=' + Date.now());
    });
  }
);

authRouter.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
  })
);

authRouter.get(
  '/github/callback',
  passport.authenticate('github', {failureRedirect: '/login', session: true}),
  (req: express.Request, res: express.Response) => {
    if (!req.user || !req.session) {
      res.redirect('/login?error=no_user_or_session');
      return;
    }

    const user = req.user as Account;
    req.session.displayName = user.displayName;
    req.session.userId = `${user.id}`;
    req.session.hashedIdentifier = user.hashedIdentifier;
    req.session.shareAllResults = user.shareAllResults;
    ensureSessionCsrfToken(req);

    req.session.save(err => {
      if (err) {
        console.error('Error saving session:', err);
      }
      res.redirect('/?login=success&t=' + Date.now());
    });
  }
);

authRouter.get('/status', async (req: express.Request, res: express.Response) => {
  try {
    let account: Account | null = null;

    if (req.session && req.session.userId) {
      const id = Number(req.session.userId);
      if (!Number.isNaN(id)) {
        account = await getAccountById(id);
      }
    } else if (req.user) {
      account = req.user as Account;
    } else if (req.headers.authorization) {
      account = await getAccountByAPIKey(req.headers.authorization);
    }

    if (!account) {
      return res.json({authenticated: false});
    }

    const isAdmin = superUserIds.includes(account.hashedIdentifier);
    let csrfToken: string | null = null;

    if (req.session) {
      csrfToken = ensureSessionCsrfToken(req);
    }

    return res.json({
      authenticated: true,
      user: {
        displayName: account.displayName,
        hashedIdentifier: account.hashedIdentifier,
        userId: `${account.id}`,
        shareAllResults: account.shareAllResults,
        isAdmin,
      },
      csrfToken,
    });
  } catch (error) {
    console.error('Error resolving auth status:', error);
    return res.json({authenticated: false});
  }
});

authRouter.post('/logout', (req: express.Request, res: express.Response) => {
  if (req.session) {
    req.session.csrfToken = undefined;
    req.session.destroy(err => {
      if (err) {
        console.error('Unable to destroy session', err);
      }
    });
  }

  if (process.env.SESSION_NAME) {
    res.clearCookie(process.env.SESSION_NAME, {
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });
  }

  res.status(200).send('Logged out successfully');
});
