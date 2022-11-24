import express from "express";
const router = express.Router();


import {uploadFile} from '../middleware/upload.js';

import {uploadCsv} from '../controllers/uploadCsvController.js';

router.route("/uploadCsv").post(uploadFile.single("file"),uploadCsv);


export default router;