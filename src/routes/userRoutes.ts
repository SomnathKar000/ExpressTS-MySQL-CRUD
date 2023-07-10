import express from "express";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/userController";
import { authenticate as authenticationMiddleware } from "../middleware/authenticationMiddleware";

const router = express.Router();
router.route("/").post(createUser);
router.route("/login").post(loginUser);
router.route("/").get(authenticationMiddleware, getUser);
router.route("/").put(authenticationMiddleware, updateUser);
router.route("/").delete(authenticationMiddleware, deleteUser);

export default router;
