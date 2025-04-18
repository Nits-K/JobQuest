import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from "../utils/db.js";
import userRoute from "../routes/user.route.js";
import companyRoute from "../routes/company.route.js";
import jobRoute from "../routes/job.route.js"
import applicationRoute from "../routes/application.route.js"
import { createServer } from "http";
import { parse } from "url";


dotenv.config({});
const app = express();
connectDB();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors(
  {
      origin: ["https://job-quest-frontend.vercel.app"],
      methods: ["POST", "GET"],
      credentials: true
  }
));

app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);


app.get("/",(req,res)=>{
  res.json("Ma ki chooot")
})

export default function handler(req, res) {
  const server = createServer(app);
  const parsedUrl = parse(req.url, true);
  req.query = parsedUrl.query;
  return server.emit("request", req, res);
}