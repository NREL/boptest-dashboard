import {SignupData} from './../../common/interfaces';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {getRepository} from 'typeorm';
import {Account, AccountEntity, createAccount} from '../models/Account';

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

  // going to need to make our api key here
  // const apiKey = createApiKey();
  const apiKey = '123apikey';

  // probably need to store tokens somehow too from cognito

  const accountData = {
    name: signupData.username,
    email: signupData.email,
    apiKey: apiKey,
  };

  return repo.save(accountData);
}
