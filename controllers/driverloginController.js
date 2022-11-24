import { PrismaClient } from "@prisma/client";
import { NotFoundError, BadRequestError, UnAuthenticatedError } from "../errors/index.js";
const prisma = new PrismaClient();
import { createJWT, currentTime, OtpGen } from "../utils/index.js";
import { loginDash, registerDash } from "../utils/logger/index.js";

const driverRegister = async (req, res) => {
  const { driverMasterId } = req.body;
  if (!driverMasterId) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }

  let data = {
    AssetService: req.body.AssetService,
    name: req.body.name,
    AadharId: req.body.AadharId,
    mobileNo: req.body.mobileNo,
    otp: 2121,
    ValidateDriver: true,
    driverMasterId: req.body.driverMasterId,
  };
  const user = await prisma.dealerData.findUnique({
    where: {
      driverMasterId: driverMasterId,
    },
  });
  if (user) {
    throw new BadRequestError("User already exist");
  }

  try {
    const User = await prisma.dealerData.create({ data });
    res.status(200).json({ message: "OK", User });
    console.log(User);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the dealerplan",
    });
  }
};

// driverlogin Api
const driverlogin = async (req, res, next) => {
  //* Logical code starts from here
  var { driverMasterId } = req.body;
  var driverMasterId = driverMasterId.toUpperCase();
  console.log(driverMasterId, "driverMasterId");

  if (!driverMasterId) {
    loginDash.log("Please provide all the values");
    throw new BadRequestError("Please provide all the values");
  }

  // checking if user exist in DB
  const user = await prisma.dealerData.findFirst({
    where: {
      bssCode: driverMasterId,
    },
  });
  console.log(user, "USER_BSS-CODE");

  //Throwing an error

  if (!user) {
    // loginDash.log("User is not registered");
    // console.log("User is not Registered");
    return res.json({ status: 404, data: "user not found" });
  }
  // const now = new Date();

  // //calculating current Time
  // var otpCurrentTime = await currentTime(now, 0);

  // //Logic for newUSER ,if user is trying to change the password for the first time
  // if (!user.otp) {
  //     var otp = await OtpGen(); //Generating Otp
  //     var otpTime = await currentTime(now, 1); //calculating time for which otp will be valid
  // }

  // //If user already changed the password and trying for the second time
  // if (user.expiryIn < user.currentIn) {
  //     otpTime = await currentTime(now, 1); //calculating time for which otp will be valid
  //     otp = await OtpGen();
  // }

  // const otpData = await prisma.dealerData.updateMany({
  //     where: {
  //         bssCode: driverMasterId,
  //     },
  //     data: {
  //         otp: 2121,
  //         // expiryIn: otpTime,
  //         // currentIn: otpCurrentTime,
  //     },

  // });
  res.status(200).json({ data: user });
  // console.log(otpData);
};
const driververifyOtp = async (req, res, next) => {
  var { otp, driverMasterId } = req.body;
  var driverMasterId = driverMasterId.toUpperCase();

  console.log(driverMasterId, "driverMasterId");

  // console.log(otp,dealerID,"USER______");
  if (!otp) {
    throw new BadRequestError("Please enter otp");
  }
  const user = await prisma.dealerData.findFirst({
    where: {
      bssCode: driverMasterId,
    },
  });
  console.log(user, "USER");
  if (true) {
    //  console.log("otp verified");
    const token = await createJWT(user);
    res.status(200).json({ OtpVerified: token });
    // console.log(token);
  } else {
    throw new BadRequestError("Otp not verified");
  }
};

export { driverRegister, driverlogin, driververifyOtp };
