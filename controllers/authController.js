import { PrismaClient, Prisma } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
import { NotFoundError, BadRequestError, UnAuthenticatedError } from "../errors/index.js";
const prisma = new PrismaClient();
import { hashPassword, createJWT, comparePassword, currentTime, OtpGen } from "../utils/index.js";

import { StatusCodes } from "http-status-codes";
import { loginDash, registerDash } from "../utils/logger/index.js";
import bcrypt from "bcrypt";

//! Register User
const register = async (req, res) => {
  const { mobileNo } = req.body;
  if (!mobileNo) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }
  // let driverID = `D${Math.floor(1000 + Math.random() * 9000)}`;
  let driverID = await prisma.$queryRaw(Prisma.sql`select count(*) from "Driver" d `);

  console.log("Driver id", driverID[0].count);

  let onboardingId = `DT${(driverID[0].count)}`

  // let bssCode = `CDEL${Math.floor(Math.random() * 1000 + 1)}`;
  console.log("onboardingId", onboardingId);
  // console.log("DEL", bssCode);
  let data = {
    driver: req.body.driver,
    AadharId: req.body.AadharId,
    AssetService: req.body.AssetService,
    mobileNo: req.body.mobileNo,
    driverID: onboardingId,
    driverOldId: onboardingId,
    bssCode: req.body.bssCode,
    // vehicleType:4,
    cashback: 0,
    code: 2121,
  };
  const user = await prisma.Driver.findUnique({
    where: {
      // driver: driver,
      mobileNo: mobileNo,

    },
  });
  console.log("usermobile date", mobileNo);
  if (user) {
    throw new BadRequestError("User already exist");
  }

  try {
    const User = await prisma.Driver.create({ data });
    res.status(200).json({ message: "OK", User });

    console.log(User);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the dealerplan",
    });
  }
};

//!LOGIN USER
const login = async (req, res) => {
  //* Logical code starts from here
  var { driverId } = req.body;
  console.log(driverId, "driverId");
  var driverId = driverId.toUpperCase();
  // console.log(driverId);
  if (!driverId) {
    return res.json({ status: 404, data: "driverId not found " });
  }

  //checking if user exist in DB
  const user = await prisma.users.findFirst({
    where: {
      user_id: driverId,
    },
  });

  const batteryData = await prisma.battery.findMany({
    where: {
      driverId: driverId,
      name: "OUT"
    },
    select: {
      batteryId: true,
      name: true

    }

  });

  console.log(batteryData, "batteryData");


  //Throwing an error
  if (!user) {
    return res.json({ status: 404, data: "driverId not found " });
  }

  const validDriver = await prisma.userRoles.findFirst({
    where: {
      user_id: user.id
    }
  })
  console.log("USER ID IN USER ROLE TABLE IS ", validDriver)

  if (validDriver.role_id === 1) {

    console.log("VALID DRIVER FOUND")

    const now = new Date();
    //Logic for newUSER ,if user is trying to change the password for the first time
    if (!user.code) {
      var otp = await OtpGen(); //Generating Otp
      var otpTime = await currentTime(now, 1); //calculating time for which otp will be valid
    }

    //If user already changed the password and trying for the second time
    if (user.expiryIn < user.currentIn) {
      otpTime = await currentTime(now, 1); //calculating time for which otp will be valid
      otp = await OtpGen();
    }

    //  const otpData = await prisma.driver.update({
    //    where: {
    //     mobileNo: user.mobileNo,
    //    },
    //    data: {
    //      code: 2121,
    //      expiryIn: otpTime,
    //      currentIn: otpCurrentTime,
    //    },
    //    select: {
    //      id: true,
    //      mobileNo: true,
    //      driverId: true,
    //      code: true,
    //    },
    //  });
    res.status(200).json({ data: user, batteryData, status: 200 });
  };
}
//!Verify otp
const verifyOtp = async (req, res, next) => {
  var { code, driverId } = req.body;
  var driverId = driverId.toUpperCase();
  console.log(driverId, "driverId");

  if (!code) {
    throw new BadRequestError("Please enter otp");
  }
  console.log("driver id", driverId);
  const user = await prisma.Driver.findUnique({
    where: {
      user_id: driverId,
    },
  });
  console.log("driver found", user);
  if (code == 2121) {
    console.log("otp verified");
    const token = await createJWT(user);
    res.status(200).json({ OtpVerified: token });
  } else {
    throw new BadRequestError("Otp not verified");
  }
};

export { register, login, verifyOtp };
