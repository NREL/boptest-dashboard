import {SignupData} from './../../common/interfaces';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {getRepository} from 'typeorm';
import {Account, AccountEntity, createAccount} from '../models/Account';

import crypto from 'crypto';

export function getAccount(id: number): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  return repo.findOneOrFail(id);
}

export function getAccounts(): Promise<Account[]> {
  // request data
  const accountsRepository = getRepository<Account>(AccountEntity);
  return accountsRepository.find({relations: ['results']});
}

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

export function createAccountFromCognitoUser(
  user: CognitoUser,
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
