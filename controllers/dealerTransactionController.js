import { PrismaClient } from "@prisma/client";
import { NotFoundError, BadRequestError, UnAuthenticatedError } from "../errors/index.js";
const prisma = new PrismaClient();
import { createJWT, currentTime, OtpGen } from "../utils/index.js";
import { loginDash, registerDash } from "../utils/logger/index.js";

const dealerTransaction = async (req, res) => {

  try {


    const obj = req.body;


    await handleDealerTransaction(obj)
    res.status(200).json({ message: "OK" });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the dealerplan",
    });
  }
};

const handleDealerTransaction = async (obj) => {

  try {
    console.log({ obj })
    console.log(parseInt(obj.dealer_id))

    let dealerDataResp = await prisma.dealerData.findFirst({ where: { bssCode: obj.dealer_id }, select: { net_due: true } });
    let net_due = dealerDataResp.net_due
    console.log(net_due)


    if (obj.payment_type == "paidToDealer") {
      net_due = net_due + obj.payment_received
    } else {
      net_due = net_due - obj.payment_received
    }

    let dealerUpdateResp = await prisma.dealerData.updateMany({ where: { bssCode: obj.dealer_id }, data: { net_due } });

    let data = {
      net_due,
      commission: obj.commission,
      admin_user: obj.admin_user,
      dealer_id: obj.dealer_id,
      payment_type: obj.payment_type,
      payment_received: obj.payment_received,
      swap_id: obj.swap_id,
      order_id: obj.order_id
    };

    console.log(data)

    await insertDealerTransaction(data)
    return;

  } catch (err) {
    console.error(err);
    throw err
  }
};

const insertDealerTransaction = async (obj) => {

  let data = {
    net_due: obj.net_due,
    commission: obj.commission,
    admin_user: obj.admin_user,
    dealer_id: obj.dealer_id,
    payment_type: obj.payment_type,
    payment_received: obj.payment_received,
    swap_id: obj.swap_id,
    order_id: obj.order_id
  };

  console.log(data)
  try {
    const User = await prisma.dealerTransaction.create({ data });
    return;

  } catch (err) {
    console.error(err);
    throw err
  }
};


export { dealerTransaction, insertDealerTransaction, handleDealerTransaction };
