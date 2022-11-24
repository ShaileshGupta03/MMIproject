import express from "express";
const router = express.Router();

import { register, login, amountReceived, accounts, accountsById, dealerTransactionsById, dealerConsolidateReport, dealerLedger, dealerWiseApp } from "../controllers/adminController.js";
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/received-amount").post(amountReceived);
router.route("/accounts").get(accounts);
router.route("/accounts/:id").get(accountsById);
router.route("/dealer-transactions/:id").get(dealerTransactionsById);
router.route("/dealer-consolidate-report").get(dealerConsolidateReport);
router.route("/dealer-ledger/:dealerId").get(dealerLedger);
router.route("/dealer-wise-app/:dealerId").get(dealerWiseApp);

export default router;
