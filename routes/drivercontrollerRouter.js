import express from "express";
const router = express.Router();
import { currentAddres, document, documentTable, imgUploadDocument, persnoalDetails, bankName, tagingMaster } from "../controllers/driverController.js";
import { dealerTranDetalis, getDriverDetails, getDriverDetailsScreen2, subscribePlanForDriver, assignBattery, swampBattery, submitBattery, dealerConsolidateReportByDealerId, duplicateBattery, verifyGeoFence, getReports } from "../controllers/dealerFlow.js";

//Driver router
router.route("/currentAddres").post(currentAddres);
router.route("/document").post(document);
router.route("/persnalDetails").post(persnoalDetails);
router.route("/bankname/:banknameid").get(bankName)
router.route("/tagingMaster").post(tagingMaster)

//document Table
router.route("/documentTable").post(imgUploadDocument, documentTable);

// getDriverDetails;
router.route("/getDriverDetailscreen1/:driverId").get(getDriverDetails);
router.route("/getDriverDetailscreen2/:driverID").get(getDriverDetailsScreen2);
router.route("/getDriverDetailscreen3/:dealerId").get(dealerTranDetalis);

//plan router
router.route("/buyPlan").post(subscribePlanForDriver);
router.route("/duplicateBattery/batteryId/:batteryId/dealerId/:dealerId").get(duplicateBattery);
router.route("/assignBatterToDriver").post(assignBattery);
router.route("/swampBattery").post(swampBattery);
router.route("/submitBattery").post(submitBattery);
router.route("/verifyGeoFence").post(verifyGeoFence)
router.route("/getReports").get(getReports)
//  dealer Consolidate Report dealerWise
router.route("/dealer-consolidate-report-by-dealerid/:dealerId").get(dealerConsolidateReportByDealerId)
export default router;
