import express from "express";
const router = express.Router();
import { getCityByState,
        postCityByState, 
        getClusterByCity,
        postClusterByCity,
        getZoneByCluster,
        postZoneByCluster, 
        } from '../controllers/mappingController.js'

router.route("/getCityByState/:id").get(getCityByState);
router.route("/postCityByState").post(postCityByState);
router.route("/getClusterByCity/:id").get(getClusterByCity);
router.route("/postClusterByCity").post(postClusterByCity);
router.route("/getZoneByCluster/:id").post(getZoneByCluster);
router.route("/postZoneByCluster").post(postZoneByCluster);


export default router;
