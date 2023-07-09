import pool from "../database/connection";
import { CustomError } from "../middleware/errorHandlingMiddleware";

const createTable = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      "CREATE TABLE IF NOT EXISTS Blogs (id VARCHAR(50) DEFAULT (UUID()), title VARCHAR(50) NOT NULL, content TEXT NOT NULL, author_id VARCHAR(50) NOT NULL, author_name VARCHAR(50) NOT NULL , type ENUM('public','private') DEFAULT 'public', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id));"
    );
    connection.release();
  } catch (error) {
    console.log(error);
    throw new CustomError("Error creating the Blogs table", 500);
  }
};

export default createTable;
