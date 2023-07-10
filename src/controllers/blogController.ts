import { Request, Response } from "express";
import blogModel from "../models/blogModel";
import pool from "../database/connection";
import { v4 as uuidv4 } from "uuid";
import { CustomError } from "../middleware/errorHandlingMiddleware";
import { PoolConnection, RowDataPacket, FieldPacket } from "mysql2/promise";
import { AuthenticatedRequest } from "../middleware/authenticationMiddleware";

blogModel();

const createBlog = async (req: AuthenticatedRequest, res: Response) => {
  const userId: string = req.user.id;
  const title: string = req.body.title;
  const content: string = req.body.content;

  const type: string = req.body.type === "private" ? "private" : "public";
  if (!title || !content || title.length < 3 || content.length < 3) {
    throw new CustomError("Invalid blog details", 404);
  }

  const blogId: string = uuidv4();
  const connection: PoolConnection = await pool.getConnection();
  const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.query(
    "SELECT name FROM Users WHERE id=?",
    [userId]
  );
  if (rows.length === 0) {
    connection.release();
    throw new CustomError("User not found", 404);
  }
  const authorName: string = rows[0].name;
  try {
    await connection.query(
      "INSERT INTO Blogs (id,title,content,author_id,author_name,type) VALUES (?,?,?,?,?,?);",
      [blogId, title, content, userId, authorName, type]
    );
    connection.release();
    res
      .status(200)
      .json({ success: true, message: "Blog created successfully" });
  } catch (error) {
    console.log(error);
    throw new CustomError("Error while creating blog", 404);
  }
};

const getUserBlogs = async (req: AuthenticatedRequest, res: Response) => {
  const id: string = req.user.id;
  const connection: PoolConnection = await pool.getConnection();
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.query(
      "SELECT id,title,content,author_name ,type,created_at,updated_at FROM Blogs WHERE author_id=?",
      [id]
    );
    connection.release();
    res.status(200).json({
      success: true,
      message: "User blogs retrieved successfully",
      Blogs: rows,
    });
  } catch (error) {
    console.log(error);
    throw new CustomError("Error while getting user posts", 404);
  }
};

const getAllPublicBlogs = async (req: Request, res: Response) => {
  try {
    const connection: PoolConnection = await pool.getConnection();
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.query(
      "SELECT id,title,content,author_name,created_at,updated_at FROM Blogs WHERE type='public';"
    );
    if (rows.length === 0) {
      connection.release();
      throw new CustomError("No public blogs found", 404);
    }
    connection.release();
    res.status(200).json({
      success: true,
      message: "Public blogs retrieved successfully",
      Blogs: rows,
    });
  } catch (error) {
    console.log(error);
    throw new CustomError("Error while getting all public posts", 404);
  }
};

const updateBlog = async (req: AuthenticatedRequest, res: Response) => {
  const userId: string = req.user.id;
  const blogId: string = req.params.id;
  const content: string = req.body.content || "";
  const title: string = req.body.title || "";
  const type: string | undefined =
    req.body.type === "public" || req.body.type === "private"
      ? req.body.type
      : undefined;
  if (!blogId) {
    throw new CustomError("Invalid blog id", 404);
  }
  if (
    (title.length < 3 && title !== "") ||
    (content.length < 3 && content !== "")
  ) {
    throw new CustomError("Invalid blog details", 404);
  }
  let query: string = "UPDATE Blogs SET ";
  let queryParams: string[] = [];

  if (title !== "") {
    query += "title = ?, ";
    queryParams.push(title);
  }

  if (content !== "") {
    query += "content = ?, ";
    queryParams.push(content);
  }

  if (type !== undefined) {
    query += "type = ?, ";
    queryParams.push(type);
  }

  const date = new Date();
  const formattedDate: string = date.toISOString();
  query += "updated_at = ? WHERE id = ? AND author_id = ?";
  queryParams.push(formattedDate, blogId, userId);

  try {
    const connection: PoolConnection = await pool.getConnection();
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.query(
      query,
      queryParams
    );
    console.log(typeof rows, rows);
    if (rows.length === 0) {
      connection.release();
      throw new CustomError("Blog not found", 404);
    }
    connection.release();
    res
      .status(200)
      .json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    console.log(error);
    throw new CustomError("Error while updating blog", 404);
  }
};

const deleteBlog = async (req: AuthenticatedRequest, res: Response) => {
  const blogId: string = req.params.id;
  const userId: string = req.user.id;
  if (!blogId) {
    throw new CustomError("Invalid blog id", 404);
  }
  try {
    const connection: PoolConnection = await pool.getConnection();
    await connection.query("DELETE FROM Blogs WHERE id = ? AND author_id = ?", [
      blogId,
      userId,
    ]);
    connection.release();
    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    throw new CustomError("Error while deleting blog", 404);
  }
};

export { createBlog, getUserBlogs, getAllPublicBlogs, updateBlog, deleteBlog };
