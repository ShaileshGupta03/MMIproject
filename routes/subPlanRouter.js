import express from "express";
const router = express.Router();
import { getsubPlan, postsubPlan, putsubPlan, deletesubPlan } from "../controllers/subPlanController.js";

router.route("/create").post(postsubPlan);
router.route("/update/:id").put(putsubPlan);
router.route("/get").get(getsubPlan);
router.route("/delete/:id").delete(deletesubPlan);

export default router;
