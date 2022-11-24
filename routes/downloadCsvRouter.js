import express from "express";
const router = express.Router();


import {inventoryCsv,referralOnboardCsv,personalDetailCsv,documentCsv,vehicleDetailCsv,vehicleOwnerCsv,guarantorDetailCsv} from '../controllers/downloadCsvcontroller.js'

router.route("/referralOnboard").get(referralOnboardCsv);
router.route("/personalDetail").get(personalDetailCsv);
router.route("/document").get(documentCsv); 
router.route("/vehicleDetail").get(vehicleDetailCsv);
router.route("/vehicleOwner").get(vehicleOwnerCsv);
router.route("/guarantorDetail").get(guarantorDetailCsv);

router.route("/inventory").get(inventoryCsv);
export default router;