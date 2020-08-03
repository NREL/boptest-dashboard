import {getRepository} from 'typeorm';
import {Account, AccountEntity} from './../models/Account';

//const category = await categoryRepository.findOne(1); // category is properly typed!

// insert a new category into the database
// const categoryDTO = {
//   // note that the ID is autogenerated; see the schema above
//   name: 'new category',
// };
// const newCategory = await categoryRepository.save(categoryDTO);

export function getAccounts(): Promise<Account[]> {
  // request data
  const accountsRepository = getRepository<Account>(AccountEntity);
  return accountsRepository.find({relations: ['results']});
}
