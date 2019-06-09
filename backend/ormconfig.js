require('dotenv').config();

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

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
        __dirname + "/src/entity/**/*.ts"
    ],
    migrations: [
        __dirname + "/src/migration/**/*.ts"
    ],
    subscribers: [
        __dirname + "/src/subscriber/**/*.ts"
    ],
    cli: {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
}