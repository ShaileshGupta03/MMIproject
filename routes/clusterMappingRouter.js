import express from "express";
const router = express.Router();
import {
    getMapping,
    getMappingById,
    postCountry,
    postState,
    getState,
    updateState,
    deleteState,
    getCityByState,
    postCityByState,
    updateCity,
    deleteCity,
    getClusterByCity,
    postClusterByCity,
    updateCluster,
    deleteCluster,
    getZoneByCluster,
    postZoneByCluster,
    putMapping,
    deleteZone,
    getZoneById,

} from '../controllers/clusterMappingController.js'

router.route("/postCountry").post(postCountry);
router.route("/postState").post(postState);
router.route("/getMapping/").get(getMapping);
router.route("/getMappingById/:id").get(getMappingById);
router.route("/getState").get(getState);
router.route("/put/State").put(updateState);
router.route("/deleteState/:id").put(deleteState);
router.route("/getCityByState/:id").get(getCityByState);
router.route("/postCityByState").post(postCityByState);
router.route("/put/City").put(updateCity);
router.route("/deleteCity/:id").put(deleteCity);
router.route("/getClusterByCity/").get(getClusterByCity);
router.route("/postClusterByCity").post(postClusterByCity);
router.route("/putCluster/:id").put(updateCluster);
router.route("/deleteCluster/:id").put(deleteCluster);
router.route("/getZoneByCluster").get(getZoneByCluster);
router.route("/getZoneById/:id").get(getZoneById);
router.route("/postZoneByCluster").post(postZoneByCluster);
router.route("/updateMapping/:id").patch(putMapping);
router.route("/deleteZone/:id").patch(deleteZone);
export default router;