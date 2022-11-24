import express from "express";
import auth from "../middleware/authorization.js";
import { register, login, verifyOtp } from "../controllers/authController.js";
const router = express.Router();

// const prisma = new PrismaClient();

router.get("/prof", (req, res) => {
  console.log(req.user);
  return res.json("working");
});

router.route("/register").post(register);
/**
 * @swagger
 * /api/b1/auth/register:
 *  post:
 *   security:              # <--- ADD THIS
 *     - bearerAuth: []     # <--- ADD THIS
 *   produces:
 *     - application/json
 *   summary: register
 *   description: register
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body of the team
 *      schema:
 *       type: object
 *       properties:
 *         mobileNo :
 *          type: string
 *          description: register .
 *          example: "9115******"
 *   requestBody:
 *
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *         mobileNo :
 *          type: string
 *          description: register .
 *          example: ""
 *
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
router.route("/loginOtp").post(login);
/**
 * @swagger
 * /api/b1/auth/loginOtp:
 *  post:
 *   security:              # <--- ADD THIS
 *     - bearerAuth: []     # <--- ADD THIS
 *   produces:
 *     - application/json
 *   summary: loginOtp
 *   description: loginOtp
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body of the team
 *      schema:
 *       type: object
 *       properties:
 *         driverId :
 *          type: string
 *          description: loginOtp .
 *          example: D453
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *         driverId :
 *          type: string
 *          description: loginOtp .
 *          example: ""
 *
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */

router.route("/verifyOtp").post(verifyOtp);
/**
 * @swagger
 * /api/b1/auth/verifyOtp:
 *  post:
 *   security:              # <--- ADD THIS
 *     - bearerAuth: []     # <--- ADD THIS
 *   produces:
 *     - application/json
 *   summary: verifyOtp
 *   description: verifyOtp
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body of the team
 *      schema:
 *       type: object
 *       properties:
 *         driverId :
 *          type: string
 *          description: verifyOtp .
 *          example: D534
 *         code :
 *          type: string
 *          description: verifyOtp .
 *          example: "1234"
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *         driverId :
 *          type: string
 *          description: verifyOtp .
 *          example: ""
 *         code :
 *          type: string
 *          description: verifyOtp .
 *          example:
 *
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */

export default router;
