import {SignupData} from './../../common/interfaces';
import {getRepository} from 'typeorm';
import {Account} from '../../common/interfaces';
import {AccountEntity, createAccount} from '../models/Account';

import crypto from 'crypto';

export function getAccount(id: number): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  return repo.findOneOrFail(id);
}

// NOT Used
// export function getAccounts(): Promise<Account[]> {
//   // request data
//   const accountsRepository = getRepository<Account>(AccountEntity);
//   return accountsRepository.find({relations: ['results']});
// }

export function createAccounts(accounts: any): Promise<Account[]> {
  return Promise.all(
    accounts.map((account: any) => {
      return createAccount(account);
    })
  );
}

export function getUser(email: string): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  return repo.findOneOrFail({
    email: email,
  });
}

export function createAccountFromSignup(
  signupData: SignupData
) {
  const repo = getRepository<Account>(AccountEntity);

  const apiKey = createApiKey();

  const accountData = {
    name: signupData.username,
    email: signupData.email,
    apiKey: apiKey,
  };

  return repo.save(accountData);
}

function createApiKey(): string {
  return crypto.randomBytes(60).toString('hex');
}
