import { Request, Response } from "express";

const getUser = (req: Request, res: Response) => {
  res.json({ success: true, msg: "Get user route" });
};

const createUser = (req: Request, res: Response) => {
  res.json({ success: true, msg: "Create user route" });
};

const updateUser = (req: Request, res: Response) => {
  res.json({ success: true, msg: "Update user route" });
};

const deleteUser = (req: Request, res: Response) => {
  res.json({ success: true, msg: "Delete user route" });
};

export { getUser, createUser, updateUser, deleteUser };
