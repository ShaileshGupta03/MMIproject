import express  from "express";


import { createGroupName,getGroupName,updateGroupName,deleteGroupName,createPaymentType,getAllPaymentType,getPaymentTypeById,updatePaymentType,deletePaymentType} from '../controllers/enablePaymentTypeController.js'

const router = express.Router();


//GroupName

router.route("/createGroupName").post(createGroupName);
router.route("/getGroupName").get(getGroupName);
router.route("/updateGroupName/:id").put(updateGroupName);
router.route("/deleteGroupName/:id").delete(deleteGroupName);
// router.route("/groupName").get(groupName);

//PaymentType
router.route("/createPaymentType").post(createPaymentType);
router.route("/getAllPaymentType").get(getAllPaymentType);
router.route("/getPaymentType/:id").get(getPaymentTypeById);
router.route("/updatePaymentType/:id").put(updatePaymentType);
router.route("/deletePaymentType/:id").delete(deletePaymentType);

export default router;
