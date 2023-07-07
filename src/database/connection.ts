import { createPool, Pool } from "mysql2/promise";
import databaseConfig from "../config/database";

const pool: Pool = createPool(databaseConfig);

export default pool;
