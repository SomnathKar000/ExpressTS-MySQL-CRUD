require("express-async-errors");

import express from "express";
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

app.use(errorHandlingMiddleware);

const port = 5000 || process.env.PORT;

app.listen(port, () => console.log(`Server is listening on port ${port}`));
