
import express from "express";
import auth from "../middleware/authorization.js";
import { dealerTransaction,handleDealerTransaction } from "../controllers/dealerTransactionController.js";
const router = express.Router();

router.get("/prof", (req, res) => {
    console.log(req.user);
    return res.json("working");
  });

router.route("/dealerTransaction").post(dealerTransaction);

export default router;

