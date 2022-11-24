import express from "express";
import {qrGenrator,postDealerDataCoordinates} from '../controllers/dashboardController.js'
import {createReferralData,getReferralData} from '../controllers/dashboardReferralController.js'
import {postDealerDataNewCoordinates} from '../controllers/dashboardControllerNew.js'

const router = express.Router();

// router.route("/postDealerDataCoordinates").post(postDealerDataCoordinates);

router.route("/postDealerDataCoordinates").post(postDealerDataCoordinates);
router.route("/postDealerDataNewCoordinates").post(postDealerDataNewCoordinates);
router.route("/createReferralData").post(createReferralData);
router.route("/getReferralData").post(getReferralData)
router.route("/qrGenrator").post(qrGenrator)

/**
 * @swagger
 * /api/b1/dashboard/qrGenrator:
 *  post:
 *   security:              # <--- ADD THIS
 *     - bearerAuth: []     # <--- ADD THIS
 *   produces:
 *     - application/json
 *   summary: qrGenrator
 *   description: qrGenrator
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body of the team
 *      schema:
 *       type: object
 *       properties:
 *        Bearer-Token :
 *         type: string
 *         description: qrGenrator .
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJpYXQiOjE2NTg5ODU2MjYsImV4cCI6MTY1OTA3MjAyNn0.PWXSaU3qnD6fHn1Q0V8VboddIgO"
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object       
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
router.route("/postDealerDataCoordinates").post(postDealerDataCoordinates);
/**
 * @swagger
 * /api/b1/dashboard/postDealerDataCoordinates:
 *  post:
 *   security:              # <--- ADD THIS
 *     - bearerAuth: []     # <--- ADD THIS
 *   produces:
 *     - application/json
 *   summary: postDealerDataCoordinates
 *   description: postDealerDataCoordinates
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body of the team
 *      schema:
 *       type: object
 *       properties:
 *        lat2 :
 *         type: string
 *         description: postDealerDataCoordinates .
 *         example: "28.712547645907975"
 *        lon2 :
 *         type: string
 *         description: postDealerDataCoordinates .
 *         example: "77.0812398422741"
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        lat2 :
 *         type: string
 *         description: postDealerDataCoordinates .
 *         example: ""
 *        lon2 :
 *         type: string
 *         description: postDealerDataCoordinates .
 *         example: ""
 *        
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
router.route("/createReferralData").post(createReferralData);
/**
 * @swagger
 * /api/b1/dashboard/createReferralData:
 *  post:
 *   security:              # <--- ADD THIS
 *     - bearerAuth: []     # <--- ADD THIS
 *   produces:
 *     - application/json
 *   summary: createReferralData
 *   description: createReferralData
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body of the team
 *      schema:
 *       type: object
 *       properties:
 *        referralName :
 *         type: string
 *         description: createReferralData .
 *         example: "veeresh"
 *        referralContactNumber :
 *         type: string
 *         description: createReferralData .
 *         example: "123456489"
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object 
 *       properties:
 *        referralName :
 *         type: string
 *         description: createReferralData .
 *         example: ""
 *        referralContactNumber :
 *         type: string
 *         description: createReferralData .
 *         example:
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
router.route("/getReferralData").post(getReferralData)
/**
 * @swagger
 * /api/b1/dashboard/getReferralData:
 *  post:
 *   security:              # <--- ADD THIS
 *     - bearerAuth: []     # <--- ADD THIS
 *   produces:
 *     - application/json
 *   summary: getReferralData
 *   description: getReferralData
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body of the team
 *      schema:
 *       type: object
 *       properties:
 *        referralName :
 *         type: string
 *         description: getReferralData .
 *         example: "veeresh"
 * 
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        referralName :
 *         type: string
 *         description: getReferralData .
 *         example: ""
 *        
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
 router.route("/postDealerDataNewCoordinates").post(postDealerDataNewCoordinates);

export default router;
