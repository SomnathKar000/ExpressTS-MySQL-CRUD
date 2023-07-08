import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomError } from "./errorHandlingMiddleware";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const jwtSecret: string = process.env.JWT_SECRET || "default-secret-key";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token: string = req.headers["auth-token"] as string;
    if (!token) {
      throw new CustomError("Token does not exist", 401);
    }
    const { user }: any = jwt.verify(token, jwtSecret);
    req.user = user;
    next();
  } catch (error) {
    throw new CustomError("Authentication failed", 401);
  }
};
