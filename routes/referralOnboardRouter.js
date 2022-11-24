
import express from "express";

import { referralOnboards,} from "../controllers/referralOnboardController.js";
const router = express.Router();


router.route("/create").post(referralOnboards);


export default router;

