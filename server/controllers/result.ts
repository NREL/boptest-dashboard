import {getRepository} from 'typeorm';
import {Result, ResultEntity} from './../models/Result';

export function getResults(): Promise<Result[]> {
  // request data
  const resultsRepository = getRepository<Result>(ResultEntity);
  return resultsRepository.find({
    relations: ['account', 'controller', 'kpi', 'testcase'],
  });
}
