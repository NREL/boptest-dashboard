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
      createAccount(account);
    })
  );
}
