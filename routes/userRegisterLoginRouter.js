import express from "express";
//import auth from "../middleware/authorization.js";
import { register, login } from "../controllers/userRegisterLoginController.js";
const router = express.Router();

// const prisma = new PrismaClient();

router.route("/register").post(register);

router.route("/login").post(login);

export default router;

// import express from "express";
// // import auth  from "../middleware/authorization.js";
// import { register,login,verifyOtp} from "../controllers/userRegisterLoginController.js";
// const router = express.Router();

// router.get("/prof", (req, res) => {
//   console.log(req.user);
//   return res.json("working");
// });
// router.route("/register").post(register);
// router.route("/login").post(login);
// router.route("/verifyOtp").post(verifyOtp)
// export default router;
