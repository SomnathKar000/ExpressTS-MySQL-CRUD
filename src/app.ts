require("express-async-errors");
import express from "express";
import userRoute from "./routes/userRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use("/api/v1/user", userRoute);

export default app;
