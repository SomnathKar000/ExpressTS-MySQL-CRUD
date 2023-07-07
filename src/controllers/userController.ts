import { Request, Response } from "express";
import createTable from "../models/userModel";
import validate from "email-validator";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Pool, RowDataPacket } from "mysql2/promise";
import pool from "../database/connection";
import bcryptjs from "bcryptjs";
import { CustomError } from "../middleware/errorHandlingMiddleware";

createTable();

const jwtSecret: string = "abcdef" || process.env.SECRET_KEY;

const getUser = (req: Request, res: Response) => {
  res.json({ success: true, msg: "Get user route" });
};

const createUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    throw new CustomError("Invalid credentials", 404);
  }
  if (!validate.validate(email)) {
    throw new CustomError("Invalid email", 404);
  }
  if (password.length < 6) {
    throw new CustomError("Password must be at least 6 characters", 404);
  }

  const connection: Pool = await pool.getConnection();
  const [rows]: [RowDataPacket[]] = await connection.query(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  );

  if (rows.length > 0) {
    throw new CustomError("Email already exists", 409);
    connection.release();
  }

  const id: string = uuidv4();
  const salt: string = bcryptjs.genSaltSync(10);
  const securePassword: string = bcryptjs.hashSync(password, salt);
  const data = {
    user: {
      id: id,
    },
  };
  const token: string = jwt.sign(data, jwtSecret);

  await connection.query(
    "INSERT INTO Users (id,email, password, name) VALUES (?,?, ?, ?)",
    [id, email, securePassword, name]
  );
  connection.release();
  res.json({ success: true, msg: "User created successfully", token });
};

const updateUser = (req: Request, res: Response) => {
  res.json({ success: true, msg: "Update user route" });
};

const deleteUser = (req: Request, res: Response) => {
  res.json({ success: true, msg: "Delete user route" });
};

export { getUser, createUser, updateUser, deleteUser };
