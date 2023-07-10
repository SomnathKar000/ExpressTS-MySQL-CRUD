import { Request, Response } from "express";
import createTable from "../models/userModel";
import validate from "email-validator";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { PoolConnection, RowDataPacket, FieldPacket } from "mysql2/promise";
import pool from "../database/connection";
import bcryptjs from "bcryptjs";
import { AuthenticatedRequest } from "../middleware/authenticationMiddleware";
import { CustomError } from "../middleware/errorHandlingMiddleware";
import dotenv from "dotenv";

dotenv.config();

createTable();

const jwtSecret: string = process.env.JWT_SECRET || "default-secret-key";

const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user.id;
  try {
    const connection: PoolConnection = await pool.getConnection();
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.query(
      "SELECT name, email from Users WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      connection.release();
      throw new CustomError("User not found", 404);
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched user data",
      user: rows[0],
    });
  } catch (error) {
    console.log(error);
    throw new CustomError("User not found", 404);
  }
};

const createUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    throw new CustomError("Invalid credentials", 404);
  }
  if (name.length < 3) {
    throw new CustomError("Invalid user name ", 404);
  }
  if (!validate.validate(email)) {
    throw new CustomError("Invalid email", 404);
  }
  if (password.length < 6) {
    throw new CustomError("Password must be at least 6 characters", 404);
  }

  const connection: PoolConnection = await pool.getConnection();
  const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.query(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  );

  if (rows.length > 0) {
    connection.release();
    throw new CustomError("Email already exists", 409);
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
  res
    .status(200)
    .json({ success: true, message: "User created successfully", token });
};

const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const id: string = req.user.id;
  interface Data {
    updateData: string;
    updateKey: string;
    password: string;
  }
  let { updateData, updateKey, password }: Data = req.body;
  if (
    (updateKey != "email" && updateKey != "password" && updateKey != "name") ||
    !updateData ||
    !password
  ) {
    throw new CustomError("Invalid credentials", 404);
  }
  if (updateKey === "name") {
    if (updateData.length < 3) {
      throw new CustomError("Invalid user name ", 404);
    }
  }
  if (updateKey === "password") {
    if (updateData.length < 6) {
      throw new CustomError("Password must be at least 6 characters", 404);
    }
    const salt: string = bcryptjs.genSaltSync(10);
    updateData = bcryptjs.hashSync(updateData, salt);
  }

  const connection: PoolConnection = await pool.getConnection();
  if (updateKey === "email") {
    if (!validate.validate(updateData)) {
      throw new CustomError("Invalid email", 404);
    }
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.query(
      "SELECT * FROM Users WHERE email = ?",
      [updateData]
    );
    if (rows.length > 0) {
      connection.release();
      throw new CustomError("Email already exists", 409);
    }
  }

  const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.query(
    "SELECT password FROM Users WHERE id =?",
    [id]
  );
  if (rows.length === 0) {
    connection.release();
    throw new CustomError("User not found", 404);
  }
  if (!bcryptjs.compareSync(password.toString(), rows[0].password.toString())) {
    connection.release();
    throw new CustomError("Invalid password", 404);
  }
  await connection.query(`UPDATE Users SET ${updateKey} = ? WHERE id = ?`, [
    updateData,
    id,
  ]);

  res.status(200).json({ success: true, message: "User updated successfully" });
};

const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const id: string = req.user.id;
  const connection: PoolConnection = await pool.getConnection();
  const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.query(
    "SELECT name ,email FROM Users WHERE id= ?",
    [id]
  );
  if (rows.length === 0) {
    connection.release();
    throw new CustomError("User not found", 404);
  }
  await connection.query("DELETE FROM Users WHERE id = ?", [id]);
  res.status(200).json({ success: true, message: "User deleted successfully" });
};

const loginUser = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;
  if (!email || !password) {
    throw new CustomError("Invalid credentials", 400);
  }
  if (!validate.validate(email)) {
    throw new CustomError("Invalid email", 404);
  }
  if (password.length < 6) {
    throw new CustomError("Password must be at least 6 characters", 404);
  }
  try {
    const connection: PoolConnection = await pool.getConnection();
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.query(
      "SELECT password,id FROM Users WHERE email = ?",
      [email]
    );
    connection.release();
    if (rows.length === 0) {
      throw new CustomError("User not found", 404);
    }
    if (
      !bcryptjs.compareSync(password.toString(), rows[0].password.toString())
    ) {
      throw new CustomError("Invalid password", 404);
    }
    const data = {
      user: {
        id: rows[0].id,
      },
    };
    const token: string = jwt.sign(data, jwtSecret);

    res
      .status(200)
      .json({ success: true, message: "User logged in successfully", token });
  } catch (error) {
    console.log(error);
    throw new CustomError("User not found", 404);
  }
};

export { getUser, createUser, updateUser, deleteUser, loginUser };
