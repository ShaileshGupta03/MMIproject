import express from "express";
const router = express.Router();
import { getassetType, postassetType, deleteassetType } from "../controllers/assetType.js";

router.route("/create").post(postassetType);
router.route("/get").get(getassetType);
router.route("/delete/:id").delete(deleteassetType);

export default router;
