import express from "express";
const router = express.Router();
import {postDoucment} from "../controllers/doucmentController.js"
router.route("/upload").post(postDoucment)
export default router;