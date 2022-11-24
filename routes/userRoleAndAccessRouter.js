import express from "express";
const router = express.Router();

import {
  getApplicationType,
  deleteByIdAllTable,
  updateApplication,
  getApplicationTypeByName,
  getUserType,
  getSegmentMaster,
  getApplicableServiceSegment,
  //   getAModuleMaster,
  getRoleSegmentMapping,
  getRoleModuleMapping,
  getRoleModuleMappingByID,
  getRoleMaster,
  createRole,
  deleteRole,
  updateRole,
  postAdminData,
  updateAdmin,
  updateDriver,
  updateDealer,
  postDriverData,
  postDealerData,
} from "../controllers/userRoleAndAccessController.js";

router.route("/getuser").get(getUserType);
router.route("/deleteApplication/:id").delete(deleteByIdAllTable);
router.route("/updateApplication/:id").put(updateApplication);
router.route("/getApplicationByName").get(getApplicationTypeByName);
router.route("/getApplication").get(getApplicationType);
router.route("/getsegmentMaster").get(getSegmentMaster);
router.route("/getApplicableServiceSegment").get(getApplicableServiceSegment);
router.route("/getRoleMaster").get(getRoleMaster);
router.route("/getRoleMapping").get(getRoleSegmentMapping);


router.route("/create").post(createRole);
router.route("/delete/:id").delete(deleteRole);
router.route("/update/:id").put(updateRole);
router.route("/getRoleModuleMapping").get(getRoleModuleMapping);
router.route("/getRoleModuleMapping/:id").get(getRoleModuleMappingByID);
router.route("/postAdminData").post(postAdminData);
router.route("/postDriverData").post(postDriverData);
router.route("/postDealerData").post(postDealerData);
router.route("/updateList/:id").put(updateAdmin);
router.route("/updateDriver/:id").put(updateDriver);
router.route("/updateDealer/:id").put(updateDealer);


export default router;
