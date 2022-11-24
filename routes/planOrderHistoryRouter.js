import express from "express";
const router = express.Router();

import { buyPlan, getPlan, createPlanOrder, putPlan, deletePlan, getByPlanId } from "../controllers/planOrderHistoryController.js";

router.route("/buyPlan").post(buyPlan);


router.route("/create").post(createPlanOrder);
router.route("/update/:id").put(putPlan);
router.route("/get").get(getPlan);
router.route("/get/:id").get(getByPlanId);
router.route("/delete/:id").delete(deletePlan);

export default router;
