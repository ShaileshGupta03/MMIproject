import express from "express";
const router = express.Router();
import { postInventoryManagement, putInventoryManagement, deleteInventoryManagement, getInventoryManagement, getByInventoryManagementId} from '../controllers/inventorymanagementtransferController.js'

router.route("/get").get(getInventoryManagement);
router.route("/get/:Asset_Id").get(getByInventoryManagementId);
router.route("/createPlant_Dealer").post(postInventoryManagement);
router.route("/replaceInventory/:Asset_Id").put(putInventoryManagement);
router.route("/deleteInventory/:Asset_Id").put(deleteInventoryManagement);

//InventoryManagementTransferRole
//router.route("/createPlant_Dealer").post(postTransferPlant_Dealer);
//router.route("/createDealer").post(postTransferDealer);



export default router;
