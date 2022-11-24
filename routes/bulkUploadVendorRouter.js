import express from "express";
const router = express.Router();
import {uploadFile} from '../middleware/upload.js'

import { postbulkVendor,postbulkVendorGet } from "../controllers/bulkUploadVendorController.js";

router.route("/uploadCsv").post(uploadFile.single("file"),postbulkVendor);
router.route("/GetbulkVendor").get(postbulkVendorGet);

export default router;
