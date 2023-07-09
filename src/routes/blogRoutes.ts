import express from "express";
import {
  createBlog,
  getUserBlogs,
  getAllPublicBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";
import { authenticate as authenticationMiddleware } from "../middleware/authenticationMiddleware";

const router = express.Router();

router.route("/public").get(getAllPublicBlogs);
router.route("/").get(authenticationMiddleware, getUserBlogs);
router.route("/").post(authenticationMiddleware, createBlog);
router.route("/:id").put(authenticationMiddleware, updateBlog);
router.route("/:id").delete(authenticationMiddleware, deleteBlog);

export default router;
