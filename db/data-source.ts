import { DataSourceOptions, DataSource } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3309,
    username: 'root',
    password: '',
    database: 'Blog',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false // không tự động sinh xuống db
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
