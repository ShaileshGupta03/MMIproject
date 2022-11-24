import express from "express";
const router = express.Router();
//!upload file
import { upload, getListFiles,downloadFile} from '../controllers/imgReadControlles.js'

router.route("/upload").post(upload);
router.route("/files").get(getListFiles);
router.route("/files/:name").get(downloadFile)

export default router
