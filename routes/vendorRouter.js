import express from "express";
const router = express.Router();
import { getVendor, postGeneral, postCommunication, postInvoicing, postReceiving, postForeignTrade, postTaxInformation, getByIdVendor } from "../controllers/vendorController.js";

router.route("/genaral").post(postGeneral);
router.route("/communication").post(postCommunication);
router.route("/invoice").post(postInvoicing);
router.route("/receive").post(postReceiving);
router.route("/foreignTrade").post(postForeignTrade);
router.route("/taxInfo").post(postTaxInformation);
router.route("/get").get(getVendor);
router.route("/get/:Id").get(getByIdVendor);

export default router;
