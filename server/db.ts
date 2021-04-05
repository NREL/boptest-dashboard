import {createConnection, getConnection} from 'typeorm';
import {entityList} from './models/Entities';

export function connectToDb(withSync: boolean) {
  createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL ?? '',
    entities: entityList
  })
    .then(() => {
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
        //
      }
    })
    .catch(error => console.log(error));
}