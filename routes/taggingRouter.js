import express from "express";
const router = express.Router();
import {getTagging,getTaggingById,postTagging,deleteTagging,updateTagging} from "../controllers/taggingController.js"
router.route("/getAll").get(getTagging)
router.route("/getById/:Id").get(getTaggingById)
router.route("/create").post(postTagging)
router.route("/delete/:Id").delete(deleteTagging);
router.route("/update/:Id").put(updateTagging);
export default router;