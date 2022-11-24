import qrcode from "qrcode";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { BadRequestError } from "../errors/index.js";

const createReferralData = async (req, res) => {
  const { referralName, referralRelationship } = req.body;
  let { referralContactNumber } = req.body;
  referralContactNumber = referralContactNumber;
  console.log("user detail", req.user);
  const user = await prisma.driver.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  console.log(user, "1");
  if (!user) {
    // res.status(200).json({ message: "OK", user });
    throw new BadRequestError("user not found");
  }

  const referral = await prisma.Referral.create({
    data: {
      referralName: referralName,
      referralContactNumber: referralContactNumber,
      referralRelationship: referralRelationship,
      driverId: user.driverOldId,
    },
  });

  res.status(200).send(referral);
};

const getReferralData = async (req, res) => {
  const { referralContactNumber } = req.body;
  const user = await prisma.driver.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }
  const referral = await prisma.Referral.findUnique({
    where: {
      referralContactNumber: referralContactNumber,
    },
  });

  res.status(200).send(referral);
};

export { createReferralData, getReferralData };
