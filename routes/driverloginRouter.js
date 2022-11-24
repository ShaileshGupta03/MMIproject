
import express from "express";
import auth from "../middleware/authorization.js";
import { driverRegister,driverlogin, driververifyOtp } from "../controllers/driverloginController.js";
const router = express.Router();

router.get("/prof", (req, res) => {
    console.log(req.user);
    return res.json("working");
  });

router.route("/driverregister").post(driverRegister);
router.route("/driverlogin").post(driverlogin);
router.route("/driververifyOtp").post(driververifyOtp);

export default router;

