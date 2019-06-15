const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, NODE_ENV } = process.env;

const directory = NODE_ENV === 'production' ? 'dist' : 'src';
const extension = NODE_ENV === 'production' ? 'js' : 'ts';

module.exports = {
    type: "postgres",
    host: POSTGRES_HOST || 'localhost',
    port: parseInt(POSTGRES_PORT || '5432'),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    synchronize: false,
    logging: false,
    uuidExtension: 'pgcrypto',
    entities: [
        __dirname + `/${directory}/entity/**/*.${extension}`
    ],
    migrations: [
        __dirname + `/${directory}/migration/**/*.${extension}`
    ],
    subscribers: [
        __dirname + `/${directory}/subscriber/**/*.${extension}`
    ],
    cli: {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
}