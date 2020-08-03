import {accountRouter} from 'routes/accountRoutes';
import {getRepository} from 'typeorm';

import {AccountEntity, Account} from './models/Account';
import {Result, ResultEntity} from './models/Result';

export function createData() {
  const accountsRepository = getRepository<Account>(AccountEntity);
  const resultRepo = getRepository<Result>(ResultEntity);

  const resultData = {
    isShared: true,
    dateRun: new Date(),
  };

  const res = resultRepo.create(resultData);

  const accountData = {
    name: 'Chris',
    email: 'chris@gmail.com',
    password: 'pass',
    apiKey: 'api',
    results: [res],
  };

  accountsRepository
    .save(accountData)
    .then(account => {
      console.log('we saved both!');
      console.log('accountId', account.id);
      console.log('results', account.results);
    })
    .catch(err => console.log('unable to save account'));

  // const resultObj = resultRepo
  //   .save(resultData)
  //   .then(result => {
  //     console.log('saved the result');

  //     const accountData = {
  //       name: 'Chris',
  //       email: 'chris@gmail.com',
  //       password: 'pass',
  //       apiKey: 'api',
  //       results: [result],
  //     };

  //     console.log('about to save the account');
  //     accountsRepository
  //       .save(accountData)
  //       .then(() => console.log('made the account'))
  //       .catch(err => console.log('could not make account', err));
  //   })
  //   .catch(err => console.log('could not make the result', err));
}
