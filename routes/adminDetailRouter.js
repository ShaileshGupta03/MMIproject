import express from "express";
const router = express.Router();

import { getallDriver, updateAllDriver,updateDriverCurrent, deleteAllDriver, getByDriverID, getDriverPersonalDetail, updateDriverPersonalDetail, getDriverVehicleDetail, updateDriverVehicleDetail, getDriverVehicleOwner, updateDriverVehicleOwner, getDriverReferrerOnboard, updateDriverReferrerOnboard, getDriverDocuments, updateDriverDocuments, getDriverGuarantorDetail, updateDriverGuarantorDetail, getDriverCurrentAddress, updateDriverCurrentAddress,PostRaiseConcern } from "../controllers/adminDetailController.js";

router.route("/getallDriver").get(getallDriver);
router.route("/updateAllDriver/:driverID").put(updateAllDriver);

router.route("/updateDriverCurrent/:driverID").put(updateDriverCurrent);

router.route("/deleteAllDriver/:driverID").delete(deleteAllDriver);

router.route("/getByDriverID/:driverID").get(getByDriverID);
router.route("/driverPersonalDetail/:driverMasterId").get(getDriverPersonalDetail);
router.route("/driverPersonalDetail/:driverMasterId").put(updateDriverPersonalDetail);
router.route("/driverVehicleDetail/:driverMasterId").get(getDriverVehicleDetail);
router.route("/driverVehicleDetail/:driverMasterId").put(updateDriverVehicleDetail);
router.route("/driverVehicleOwner/:driverMasterId").get(getDriverVehicleOwner);
router.route("/driverVehicleOwner/:driverMasterId").put(updateDriverVehicleOwner);
router.route("/driverReferrerOnboard/:Scheme_ID").get(getDriverReferrerOnboard);
router.route("/driverReferrerOnboard/:id").put(updateDriverReferrerOnboard);
router.route("/driverDocuments/:driverMasterId").get(getDriverDocuments);
router.route("/driverDocuments/:driverMasterId").put(updateDriverDocuments);
router.route("/driverGuarantorDetail/:driverMasterId").get(getDriverGuarantorDetail);
router.route("/driverGuarantorDetail/:driverMasterId").put(updateDriverGuarantorDetail);
router.route("/driverCurrentAddress/:driverMasterId").get(getDriverCurrentAddress);
router.route("/driverCurrentAddress/:driverMasterId").put(updateDriverCurrentAddress);//PostRaiseConcern

router.route("/postConcern").post(PostRaiseConcern);

export default router;

