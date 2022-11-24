import express, { Router } from "express";
// import multer   from "multer";



import { createVehicleDetail, getVehicleDetail, createVehicleOwner, getVehicleOwner, createGuarantorDetail, getGuarantorDetail, vehicleType, getvehicleTypeByID, imgUploader, imgUploaderOwner, imgGuarantorInfo } from "../controllers/dashboardDealerController.js";

const router = express.Router();

// Driver vehicleInfo
router.route("/createVehicleDetail").post(imgUploader, createVehicleDetail);
router.route("/vehicleType").get(vehicleType);
router.route("/vehicleType/:vehicleTypeId").get(getvehicleTypeByID);
router.route("/getVehicleDetail").get(getVehicleDetail);
// router.route("/getVehicleType").get(getVehicleType);

router.route("/createVehicleOwner").post(imgUploaderOwner, createVehicleOwner);
// router.route("/createVehicle1").post(imgUploader1); //use

router.route("/getVehicleOwner").get(getVehicleOwner);
router.route("/createGuarantorDetail").post(imgGuarantorInfo, createGuarantorDetail);
router.route("/getGuarantorDetail").get(getGuarantorDetail);

export default router;
