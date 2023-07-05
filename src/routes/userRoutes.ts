import express from "express";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

router.route("/").get(getUser);
router.route("/").post(createUser);
router.route("/").put(updateUser);
router.route("/").delete(deleteUser);

export default router;
