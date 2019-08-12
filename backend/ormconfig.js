const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

module.exports = {
  type: 'postgres',
  host: POSTGRES_HOST || 'localhost',
  port: +(POSTGRES_PORT || '5432'),
  username: POSTGRES_USER || 'convomark',
  password: POSTGRES_PASSWORD || 'convomark',
  database: POSTGRES_DB || 'convomark_development',
  synchronize: false,
  uuidExtension: 'pgcrypto',
  entities: [__dirname + `/dist/entities/*.js`],
  migrations: [__dirname + `/dist/migrations/*.js`],
  subscribers: [__dirname + `/dist/subscribers/*.js`],
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
};
