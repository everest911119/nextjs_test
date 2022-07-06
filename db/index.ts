import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Users, UserAuth, Articles, Comments, Tags } from './entity/index';
let connectionReadyPromise: Promise<DataSource> | null = null;
const options: DataSourceOptions = {
  type: 'mysql',
  host: 'remotemysql.com',
  port: 3306,
  username: 'ZQB9ItGYxg',
  password: 'NRv80psQAr',
  database: 'ZQB9ItGYxg',
  logging: true,
  synchronize: false,
  entities: [Users, UserAuth, Articles, Comments, Tags],
};
const AppDataSource = new DataSource(options);
// export const database = async () => await AppDataSource.initialize()
export const prepareConnection = () => {
  if (!connectionReadyPromise) {
    connectionReadyPromise = (async () => await AppDataSource.initialize())();
  }
  return connectionReadyPromise;
};
