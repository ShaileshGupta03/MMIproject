import express from "express";
const router = express.Router();

import {getInventory, patchInventory,getByInventoryId,putAssetIdInventory} from '../controllers/inventoryController.js'
// router.route("/updateAll/Asset_ID/:Asset_ID").put(putAssetIdInventory);
router.route("/updateInventory/:Item_ID").patch(patchInventory);
router.route("/getAll").get(getInventory);
router.route("/getById/:Vendor_ID").get(getByInventoryId);

export default router;