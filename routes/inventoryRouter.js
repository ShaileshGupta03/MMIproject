import express from "express";
const router = express.Router();
import { getByDealerId, getInventory, getvehicleSchemesbyIdVehicle, getByInventoryId } from "../controllers/inventoryController.js";

import { uploadFile } from "../middleware/upload.js";
import { uploadCsv } from "../controllers/uploadCsvController.js";

router.route("/uploadCsv").post(uploadFile.single("file"), uploadCsv);
//  router.route("/updateInventory/:Asset_ID").patch(patchInventory);
// router.route("/updateInOut/:Item_ID").patch(patchInventoryInOut);
router.route("/getAll").get(getInventory);
router.route("/getById/:Asset_ID").get(getByInventoryId);
//  router.route("/getByItemId/:Item_ID").get(getByItemInventory);
router.route("/getdealerbyid/:Dealer_Id").get(getByDealerId);
router.route("/getvehicleschemesid/:vehicleTypeid").get(getvehicleSchemesbyIdVehicle);

export default router;
