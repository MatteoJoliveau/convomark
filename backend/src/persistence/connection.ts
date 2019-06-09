import { Connection, createConnection } from "typeorm";
import { getLogger } from "../logger";

export async function createDatabaseConnection(): Promise<Connection> {
   const logger = getLogger("persistence/connection");
   const connection = await createConnection();
   logger.info("Database connection started");
   return connection;
}