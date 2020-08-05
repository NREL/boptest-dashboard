import {getRepository} from 'typeorm';
import {Account, AccountEntity} from '../models/Account';

export function getAccounts(): Promise<Account[]> {
  // request data
  const accountsRepository = getRepository<Account>(AccountEntity);
  return accountsRepository.find({relations: ['results']});
}
