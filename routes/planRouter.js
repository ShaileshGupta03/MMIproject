import express from "express";
const router = express.Router();
import { getPlan, postPlan, putPlan, deletePlan, getByPlanId } from "../controllers/planController.js";

router.route("/create").post(postPlan);
router.route("/update/:id").put(putPlan);
router.route("/get").get(getPlan);
router.route("/get/:id").get(getByPlanId);
router.route("/delete/:id").delete(deletePlan);

export default router;
