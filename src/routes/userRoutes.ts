import express from "express";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticate as authenticationMiddleware } from "../middleware/authenticationMiddleware";

const router = express.Router();

router.route("/").get(authenticationMiddleware, getUser);
router.route("/").post(createUser);
router.route("/").put(authenticationMiddleware, updateUser);
router.route("/").delete(authenticationMiddleware, deleteUser);

export default router;
