import { Account } from '../common/interfaces';

declare global {
  namespace Express {
    interface User extends Account {
      privileged?: boolean;
    }
    
    interface Request {
      user?: User;
    }

    interface Session {
      displayName?: string;
      userId?: string;
      hashedIdentifier?: string;
      shareAllResults?: boolean | null;
      csrfToken?: string;
    }
  }
}
