import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../utils/db.js";
import userRoute from "../routes/user.route.js";
import companyRoute from "../routes/company.route.js";
import jobRoute from "../routes/job.route.js";
import applicationRoute from "../routes/application.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://job-quest-frontend.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use("/v1/user", userRoute);
app.use("/v1/company", companyRoute);
app.use("/v1/job", jobRoute);
app.use("/v1/application", applicationRoute);

app.get("/", (req, res) => {
  res.json("API working ");
});

// 👇👇 This is the only thing Vercel needs for the handler:
export default app;
