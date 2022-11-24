import express from "express";
const router = express.Router();
import { getsubSubPlan, postsubSubPlan, putsubSubPlan, deletesubSubPlan,getPlanByCityIdAndVehicleId } from "../controllers/subsubPlanController.js";

router.route("/create").post(postsubSubPlan);
router.route("/update/:id").put(putsubSubPlan);
router.route("/get").get(getsubSubPlan);
router.route("/delete/:id").delete(deletesubSubPlan);
router.route("/get/city/:city_id/vehicle/:vehicle_type").get(getPlanByCityIdAndVehicleId);

export default router;
