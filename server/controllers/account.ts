import {SignupData} from './../../common/interfaces';
import {getRepository} from 'typeorm';
import {Account} from '../../common/interfaces';
import {AccountEntity, createAccount} from '../models/Account';

import crypto from 'crypto';

export function getAccountById(id: number): Promise<Account> {
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

export function getAccountByEmail(email: string): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  return repo.findOneOrFail({
    email: email,
  });
}

export function getAPIKeyByEmail(email: string): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  return repo.findOneOrFail({
    email: email,
  },{
    select: ['apiKey']
  });
}

export function getAccountByAPIKey(key: string): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  return repo.findOneOrFail({
    apiKey: key,
  });
}

export function createAccountFromSignup(
  signupData: SignupData,
  userSub: string
) {
  const repo = getRepository<Account>(AccountEntity);

  const apiKey = createApiKey();
  const salt = createSalt();

  const accountData = {
    sub: userSub,
    name: signupData.username,
    email: signupData.email,
    apiKey: apiKey,
    apiKeySalt: salt,
  };

  return repo.save(accountData);
}

function createApiKey(): string {
  return crypto.randomBytes(60).toString('hex');
}

function createSalt(): string {
  return crypto.randomBytes(60).toString('hex');
}
