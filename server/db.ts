import {Sequelize} from 'sequelize';

// stop gap for now, need to error check later
const dbUrl: string = process.env.DATABASE_URL ?? '';
export const db = new Sequelize(dbUrl);

export function authDbConnection() {
  db.authenticate()
    .then(() => {
      console.log('Connection has been successful');
    })
    .catch(err => {
      console.log('unable to establish connection: ', err);
    });
}

export function syncModels() {
  db.sync({force: true});
}
