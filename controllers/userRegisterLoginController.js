import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { NotFoundError, BadRequestError, UnAuthenticatedError } from "../errors/index.js";

import { StatusCodes } from "http-status-codes";
import { loginDash, registerDash } from "../utils/logger/index.js";
import bcrypt from "bcrypt";
//! Register User
const register = async (req, res) => {
  const { email, password, username, phone } = req.body;

  //* checking if any one of the field is empty will throw an error
  if (!email) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }

  //checking if user exist
  const userAlreadyExist = await prisma.UserLogin.findUnique({
    where: {
      email: email,
    },
  });

  if (userAlreadyExist) {
    throw new BadRequestError("User already exist");
  }
  //creating user
  const newUser = await prisma.UserLogin.create(
    {
      data: {
        email: email,
        password: password,
        username: username,
        phone: phone,
      },
    },
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        const user = new UserLogin({
          username: req.body.username,
          email: req.body.email,
          password: hash,
          phone: req.body.phone,
        });
       
      }
    })
  )
  user.save()
  .then((result) => {
    res.status(200).json({
      newUser: result,
    });
  })
  .catch((err) => {
    res.status(500).json({ error: err });
  });

  // let uId = `${process.env.PREFIX}${newUser.id}`;
  // const updatedUser = await prisma.UserLogin.update({
  //   where: { email: newUser.email },
  //   data: {
  //     userId: uId,
  //   },
  // });

  res.status(200).json({
    msg: "created successfully",
    // updatedUser,
  });
};

//!LOGIN USER
const login = async (req, res) => {
  //* Logical code starts from here
  const { email, password } = req.body;
  console.log(req.body);
  if (!email) {
    loginDash.log("Please provide all the values");
    throw new BadRequestError("Please provide all the values");
  }

  //checking if user exist in DB
  const user = await prisma.UserLogin.findFirst({
    where: {
      email: email,
      password: password,
    },
  });

  //Throwing an error
  if (!user) {
    loginDash.log("User is not registered");
    throw new UnAuthenticatedError("User is not Registered");
  }

  res.status(200).json({
    msg: "login successfully",
  });
};

export { register, login };

// import { PrismaClient } from "@prisma/client";
// import dotenv from "dotenv";
// dotenv.config();
// import { NotFoundError, BadRequestError, UnAuthenticatedError } from "../errors/index.js";
// const prisma = new PrismaClient();
// import { hashPassword, createJWT, comparePassword, currentTime, OtpGen } from "../utils/index.js";

// import { StatusCodes } from "http-status-codes";
// import { loginDash, registerDash } from "../utils/logger/index.js";
// import bcrypt from "bcrypt";

// //! Register User
// const register = async (req, res) => {
//   const { username } = req.body;
//   if (!username) {
//     registerDash.log("info", "Please provide all values");
//     throw new BadRequestError("Please provide all values");
//   } else if (username) {
//     let data = {
//       username: req.body.username,
//       email: req.body.email,
//       phone: req.body.phone,
//       password: req.body.password,
//     };
//   }
//   const user = await prisma.UserLogin.findUnique({
//     where: {
//       username: username,
//     },
//   });
//   console.log("username date", username);
//   if (user) {
//     throw new BadRequestError("User already exist");
//   }

//   try {
//     const User = await prisma.UserLogin.create({ data: req.body });
//     res.status(200).json({ message: "OK", User });

//     console.log(User);
//   } catch (err) {
//     res.status(500).json({
//       message: err.message || "Error occurred while creating the dealerplan",
//     });
//   }
// };

// //!LOGIN USER
// const login = async (req, res) => {
//   //* Logical code starts from here
//   const { username } = req.body.username;
//   console.log(username);
// //   if (!username) {
// //     loginDash.log("Please provide all the values");
// //     throw new BadRequestError("Please provide all the values");
// //   }

//   //checking if user exist in DB
//   const user = await prisma.UserLogin.findUnique({
//     where: {
//       username: username,
//     },
//   });
// console.log(user)
//   //Throwing an error
//   if (!user) {
//     loginDash.log("User is not registered");
//     throw new UnAuthenticatedError("User is not Registered");
//   }

//   const now = new Date();

//   //calculating current Time
//   var otpCurrentTime = await currentTime(now, 0);

//   //Logic for newUSER ,if user is trying to change the password for the first time
//   if (!user.code) {
//     var otp = await OtpGen(); //Generating Otp
//     var otpTime = await currentTime(now, 1); //calculating time for which otp will be valid
//   }

//   //If user already changed the password and trying for the second time
//   if (user.expiryIn < user.currentIn) {
//     otpTime = await currentTime(now, 1); //calculating time for which otp will be valid
//     otp = await OtpGen();
//   }

//   res.status(200).json({ data: user });
// };
// //!Verify otp
// const verifyOtp = async (req, res, next) => {
//   const { email, username } = req.body;
//   if (!email) {
//     throw new BadRequestError("Please enter otp");
//   }
//   const user = await prisma.UserLogin.findUnique({
//     where: {
//       userOldId: email,
//     },
//   });

//   if (email == user.code) {
//     console.log("otp verified");
//     const token = await createJWT(user);
//     res.status(200).json({ OtpVerified: token });
//   } else {
//     throw new BadRequestError("Otp not verified");
//   }
// };

// export { register, login, verifyOtp };
