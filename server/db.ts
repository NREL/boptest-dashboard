import {entityList} from './models/Entities';
import 'reflect-metadata';
import {createConnection, getConnection} from 'typeorm';
import {createData} from './testData';

export function connectToDb(withSync: boolean = false) {
  createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL ?? '',
    entities: entityList,
  })
    .then(() => {
      console.log('Connection to postgres created');
      if (withSync) {
        const conn = getConnection();
        conn
          .synchronize()
          .then(() => {
            console.log('models synchronized');
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // createData();
      }
    })
    .catch(error => console.log(error));
}
