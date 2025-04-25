import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getAllJobs,
  getJobById,
  getJobsCreatedByAdmin,
  jobPost,
} from "../controllers/job.controller.js";

const router = express.Router();
router.route("/post").post(isAuthenticated, jobPost);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getJobsCreatedByAdmin);
router.route("/get/:id").get( getJobById);

export default router;
