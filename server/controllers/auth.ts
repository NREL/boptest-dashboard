import { Account } from '../../common/interfaces';
import { updateDisplayName } from '../models/Account';

// Keep testing mode flag
const TESTING: boolean = process.env.CONTEXT! === 'testing';

/**
 * Update a user's display name
 * Now using OAuth-only authentication
 */
export function updateUserDisplayName(userId: number, newDisplayName: string): Promise<void> {
  return updateDisplayName(userId, newDisplayName);
}

/**
 * This file has been simplified to only support OAuth authentication.
 * The previous email/password authentication methods have been removed.
 * See the oauth.ts file for the implementation of OAuth authentication.
 */