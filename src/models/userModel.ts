import pool from "../database/connection";
import { CustomError } from "../middleware/errorHandlingMiddleware";

const createTable = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      "CREATE TABLE IF NOT EXISTS Users (id VARCHAR(50) DEFAULT (UUID()), name VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL ,password VARCHAR(70), PRIMARY KEY (id));"
    );
    connection.release();
  } catch (error) {
    console.log("Error creating table", error);
    throw new CustomError("Error creating the Users table", 500);
  }
};

export default createTable;
