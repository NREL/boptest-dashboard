import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {Strategy as GitHubStrategy} from 'passport-github2';
import {
  getAccountByHashedIdentifier, 
  createAccountFromOAuth,
  createHashedIdentifier
} from './controllers/account';

// OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const CALLBACK_URL_BASE = process.env.CALLBACK_URL_BASE || 'http://localhost:8080';

interface OAuthUserData {
  providerId: string;
  provider: string;
}

// Configure Passport
export function configurePassport(): void {
  try {
    // Google OAuth Strategy
    passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${CALLBACK_URL_BASE}/api/auth/google/callback`
    }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const hashedIdentifier = createHashedIdentifier(profile.id);
      
      getAccountByHashedIdentifier(hashedIdentifier)
        .then((existingAccount) => {
          done(null, existingAccount);
        })
        .catch(() => {
          const userData: OAuthUserData = {
            providerId: profile.id,
            provider: 'google'
          };
          
          createAccountFromOAuth(userData)
            .then((newAccount) => {
              done(null, newAccount);
            })
            .catch((err) => {
              done(err, null);
            });
        });
    }));

    // GitHub OAuth Strategy
    passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${CALLBACK_URL_BASE}/api/auth/github/callback`
    }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const hashedIdentifier = createHashedIdentifier(profile.id);
      
      getAccountByHashedIdentifier(hashedIdentifier)
        .then((existingAccount) => {
          done(null, existingAccount);
        })
        .catch(() => {
          const userData: OAuthUserData = {
            providerId: profile.id,
            provider: 'github'
          };
          
          createAccountFromOAuth(userData)
            .then((newAccount) => {
              done(null, newAccount);
            })
            .catch((err) => {
              done(err, null);
            });
        });
    }));
    
    console.log('OAuth strategies configured successfully');
  } catch (error) {
    console.error('Error configuring OAuth strategies:', error);
  }
}