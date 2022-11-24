import express from "express";
const router = express.Router();

import { getItem, postBatteryItem, postChargerItem, postCabinateItem, postHarnessItem, postConnectorItem, getByIdItem, deleteItem } from "../controllers/itemController.js";

router.route("/battery/create").post(postBatteryItem);
router.route("/battery/update").put(postBatteryItem);
router.route("/charger/create").post(postChargerItem);
router.route("/charger/update").put(postChargerItem);
router.route("/connector/create").post(postConnectorItem);
router.route("/connector/update").put(postConnectorItem);
router.route("/cabinate/create").post(postCabinateItem);
router.route("/cabinate/update").put(postCabinateItem);
router.route("/harrness/create").post(postHarnessItem);
router.route("/harrness/update").put(postHarnessItem);
router.route("/get").get(getItem);
router.route("/get/:Id").get(getByIdItem);

router.route("/delete/:id").delete(deleteItem);


export default router;
