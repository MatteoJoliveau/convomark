import 'reflect-metadata';
import { config as dotenv } from 'dotenv';
import './persistence/connection';
import app from './web';
import { getLogger } from './logger';
import { getConnection } from 'typeorm';
dotenv();

const logger = getLogger('convomarkbot');

const port = parseInt(process.env.PORT || '3000');

async function main() {
    await getConnection();
    app.listen(port, () => {
        logger.info(`Application started on port ${port}`);
    });
}

main().catch(logger.error)
