import { PrismaClient } from "@prisma/client";
import { NotFoundError, BadRequestError, UnAuthenticatedError } from "../errors/index.js";
const prisma = new PrismaClient();

const referralOnboards = async (req, res) => {
  const { referredBy, onboardingThrough, onboardedBy, joiningScheme, joiningfeesRecieved, securityAmountRecieved, total, referralContactNumber, dealer_id, driverId } = req.body;
  let { Scheme_ID } = req.body;
  if (!Scheme_ID) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }
  const user = await prisma.referralOnboard.findFirst({
    where: {
      Scheme_ID: Scheme_ID,
    },
  });
  const dealerData = await prisma.dealerData.findFirst({
    where: {
      bssCode: dealer_id,
    },
  });
  if (user) {
    res.status(200).json({ message: "OK", user });
  } else {
    try {
      const User = await prisma.referralOnboard.create({
        data: {
          referredBy: referredBy,
          onboardingThrough: onboardingThrough,
          onboardedBy: onboardedBy,
          joiningScheme: joiningScheme,
          joiningfeesRecieved: joiningfeesRecieved,
          securityAmountRecieved: securityAmountRecieved,
          total: total,
          Scheme_ID: Scheme_ID,
          referralContactNumber: referralContactNumber,
          // driverId: driverId
          //  referralId        : referralId
        },
      });

      const getDealerId = await prisma.DealerData.findFirst({ where: { bssCode: onboardedBy } })
      const getDriverId = await prisma.Driver.findFirst({ where: { driverID: driverId } })

      console.log("dealer Details are", getDealerId, "driver details are", getDriverId)


      const addOrder = await prisma.orders.create(
        {
          data: {
            driver_id: getDriverId.id,
            dealer_id: getDealerId.id,
            order_type: "onBoarding"
          }
        }
      )

      console.log("add orders", addOrder)


      const TransactionData = await prisma.dealerTransaction.create({
        data: {
          net_due: parseFloat(total) + parseFloat(dealerData.net_due),
          commission: 0,
          admin_user: 1,
          dealer_id: dealerData.bssCode,
          payment_type: "paidToDealer",
          payment_received: parseFloat(total),
          swap_id: null,
          order_id: addOrder.id
        },
      });
      console.log("transaction data is", TransactionData)
      res.status(200).json({ message: "OK", User, TransactionData });
      // console.log('transaction data is',User, ransactionData)
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err.message || "Error occurred while creating the dealerplan",
      });
    }
  }
};

export { referralOnboards };
