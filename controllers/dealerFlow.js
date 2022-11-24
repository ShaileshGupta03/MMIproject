import { Prisma, PrismaClient } from "@prisma/client";
import { Console } from "console";
import uniqid from "uniqid";
const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";
import { insertDealerTransaction, handleDealerTransaction } from "../controllers/dealerTransactionController.js";
import { registerDash } from "../utils/logger/index.js";
import { BadRequestError } from "../errors/index.js";

const getDriverDetails = async (req, res) => {
  try {
    const { driverId } = req.params;
    if (!driverId) {
      registerDash.log("info", "Please provide all values");
      return res.status(400).json({
        message: "Please provide all values",
        statusCode: 400,
      });
    }

    const userDriver = await prisma.Driver.findUnique({
      where: {
        driverID: driverId,
      },
      select: {
        // This will work!
        driverID: true,
        driver: true,
        batteryData: {},
        paymentData: {},
        planHistory: {},
      },
    });
    if (!userDriver) {
      res.status(404).json({ message: "No driver found", statusCode: 404 });
      return;
    }
    if (userDriver?.planHistory.length === 0) {
      const data = {
        currentplan: null,
        swampsDoneToday: 0,
        moreSwampsAllowed: 0,
        ...userDriver,
      };
      res.status(200).json({ message: "OK", data, statusCode: 200 });
      return;
    } else {
      res.status(200).json({
        message: "plan is available",
        data: userDriver,
        submitBattery: true,
        statusCode: 200,
      });
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the driver",
      statusCode: 500,
    });
    return;
  }
};
const getDriverDetailsScreen2 = async (req, res) => {
  try {
    const { driverID } = req.params;
    console.log("driverId", driverID)

    let todaySwapDoneAfterDivide = await GetSwapCount(driverID)

    const updateDriverWithSwap = await prisma.Driver.update({ where: { driverID: driverID }, data: { swampsDoneToday: todaySwapDoneAfterDivide } });

    var Data = await prisma.$queryRaw(Prisma.sql`select "vehicleMaster"."no_of_battery","Driver"."driverID","Driver"."AadharId","Driver"."penalty","swampsDoneToday","batteryID","lastPresentDate", "cashback","expiryIn","bss","code","bssCode","Driver"."driver", "Driver"."mobileNo" ,"Driver"."vehicleType","city_id" from "vehicleMaster"  INNER JOIN "Driver"  ON "Driver"."vehicleType"  = "vehicleMaster"."vehicleType" and "Driver"."driverID"=${driverID}`);
    console.log(Data, "DATAGETDriver");
    if (!driverID) {
      registerDash.log("info", "Please provide all values");
      return res.status(400).json({
        message: "Please provide all values",
        statusCode: 400,
      });
    }

    var data = await prisma.Driver.findFirst({
      where: {
        driverID: driverID,
      },
      select: {
        paymentData: {},
        planHistory: {},
        batteryData: {},
        swampsDoneToday: true
      },
    });
    console.log("Driver", data)

    if (data?.batteryData) {
      var newBatteryData = []
      for (var i = 0; i < data.batteryData.length; i++) {
        if (data.batteryData[i].name == 'OUT') {
          newBatteryData.push(data.batteryData[i]);
        }
      }
      console.log("new battery data", newBatteryData);
      data.batteryData = newBatteryData;
    }
    const checkPlanStatus = data?.planHistory.length;
    console.log("checkPlanStatus");
    console.log(checkPlanStatus);
    let planStatus;
    if (checkPlanStatus === 0) {
      planStatus = 1;
      data.planStatus = planStatus;

      // No plan
    }
    if (data?.planHistory.length > 0 && data?.planHistory[0]?.planEnd) {
      const endDate = new Date(data?.planHistory[0].planEnd);
      const currentDate = new Date();
      if (data?.planHistory && data?.planHistory.length > 0 && data?.planHistory[0].planEnd && endDate >= currentDate) {
        planStatus = 2;
        data.planStatus = planStatus;
      } else {
        if (data) {
          planStatus = 3;
          data.planStatus = planStatus;
        }
      }
    }

    if (data) {

      let data1 = {
        ...data,
        ...Data[0]
      }

      res.status(200).json({ message: "OK", data: data1, statusCode: 200 });

      return;
    } else {
      res.status(404).json({ message: "No driver found", statusCode: 404 });
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the driver",
      statusCode: 500,
    });
    return;
  }
};



// const subscribePlanForDriver = async (req, res) => {
//   try {
//     const { driverId, planName, subPlanName, Price, swampsAllowed } = req.body;
//     const fecthPlan = await prisma.plan.findFirst({ where: { planName: planName } });

//     if (!fecthPlan) {
//       res.status(400).json({ message: "This plan is not available", statusCode: 400 });
//       return;
//     }
//     const fecthsubPlan = await prisma.subPlan.findFirst({ where: { subPlanName: subPlanName } });

//     if (!fecthsubPlan) {
//       res.status(400).json({ message: "This subPlan is not available", statusCode: 400 });
//       return;
//     }
//     const userDriver = await prisma.Driver.findUnique({
//       where: {
//         driverID: driverId,
//       },
//       select: {
//         // This will work!
//         driverID: true,
//         driver: true,
//         batteryData: {},
//         paymentData: {},
//         planHistory: {},
//       },
//     });

//     if (!userDriver) {
//       res.status(400).json({ message: "This driver is not available", statusCode: 400 });
//       return;
//     }
//     let planEndIng;
//     if (subPlanName.toLowerCase() === "weekly") {
//       planEndIng = addWeeks();
//     }
//     if (subPlanName.toLowerCase() === "monthly") {
//       planEndIng = addMonths(new Date(), 1);
//     }
//     if (subPlanName.toLowerCase() === "daily") {
//       var date = new Date();
//       date.setDate(date.getDate() + 1);
//       planEndIng = date;
//     }
//     const data = {
//       driverId,
//       planName,
//       subPlanName,
//       Price,
//       swampsAllowed,
//       planEnd: planEndIng,
//     };
//   const checkExistPlanHistory = await prisma.planHistory.findUnique({ where: { driverId: driverId}});
//   // const deletePlan = await prisma.planHistory.deleteMany({
//   //   where: {
//   //     driverId: driverId,
//   //   },
//   // });
//   // console.log("deletePlan", deletePlan);
//   // const pay = await prisma.PaymentHistory.create({ data: { walletId: uniqid(), driverId, status: "success", amount: Price + plan.cashback } });
//   // res.status(200).json({ message: "Transaction successfull", data: { plan, pay }, statusCode: 200 });

//   const swaps = req.body.swampsAllowed

//   if(checkExistPlanHistory){
//     console.log(checkExistPlanHistory)
//     console.log(swaps,"plandata");
//     const updatePlanHistory = await prisma.planHistory.update({
//       where: {
//         driverId: driverId,
//       },
//       data: {
//         driverId,
//         planName,
//         subPlanName,
//         Price,
//         swampsAllowed:{ increment: swaps } ,
//         planEnd: planEndIng,
//       }
//     })
//     res.status(200).json({ message: "update successfull", data: { updatePlanHistory }, statusCode: 200 });
//     console.log(updatePlanHistory,"user");
//   }else{
//          const plan = await prisma.planHistory.create({ data });
//          const pay = await prisma.PaymentHistory.create({ data: { walletId: uniqid(), driverId, status: "success", amount: Price + plan.cashback } });
//           res.status(200).json({ message: "Transaction successfull", data: { plan, pay }, statusCode: 200 });

//   }

// } catch (error) {
//   console.log("error", error);
//   res.status(500).json({
//     message: "something went wrong",
//     statusCode: 500,
//   });
// }
// };

// const subscribePlanForDriver = async (req, res) => {
//   try {
//     const { driverId, planName, subPlanName, Price, swampsAllowed } = req.body;
//     const fecthPlan = await prisma.plan.findFirst({ where: { planName: planName } });

//     if (!fecthPlan) {
//       res.status(400).json({ message: "This plan is not available", statusCode: 400 });
//       return;
//     }
//     const fecthsubPlan = await prisma.subPlan.findFirst({ where: { subPlanName: subPlanName } });

//     if (!fecthsubPlan) {
//       res.status(400).json({ message: "This subPlan is not available", statusCode: 400 });
//       return;
//     }
//     const userDriver = await prisma.Driver.findUnique({
//       where: {
//         driverID: driverId,
//       },
//       select: {
//         // This will work!
//         driverID: true,
//         driver: true,
//         batteryData: {},
//         paymentData: {},
//         planHistory: {},
//       },
//     });

//     if (!userDriver) {
//       res.status(400).json({ message: "This driver is not available", statusCode: 400 });
//       return;
//     }
//     let planEndIng;
//     if (subPlanName.toLowerCase() === "weekly") {
//       planEndIng = addWeeks();
//     }
//     if (subPlanName.toLowerCase() === "monthly") {
//       planEndIng = addMonths(new Date(), 1);
//     }
//     if (subPlanName.toLowerCase() === "daily") {
//       var date = new Date();
//       date.setDate(date.getDate() + 1);
//       planEndIng = date;
//     }
//     const data = {
//       driverId,
//       planName,
//       subPlanName,
//       Price,
//       swampsAllowed,
//       planEnd: planEndIng,
//     };
//   const checkExistPlanHistory = await prisma.planHistory.findUnique({ where: { driverId: driverId}});
//   // const deletePlan = await prisma.planHistory.deleteMany({
//   //   where: {
//   //     driverId: driverId,
//   //   },
//   // });
//   // console.log("deletePlan", deletePlan);
//   // const pay = await prisma.PaymentHistory.create({ data: { walletId: uniqid(), driverId, status: "success", amount: Price + plan.cashback } });
//   // res.status(200).json({ message: "Transaction successfull", data: { plan, pay }, statusCode: 200 });

//   const swaps = req.body.swampsAllowed

//   if(checkExistPlanHistory){
//     console.log(checkExistPlanHistory)
//     console.log(swaps,"plandata");
//     const updatePlanHistory = await prisma.planHistory.update({
//       where: {
//         driverId: driverId,
//       },
//       data: {
//         driverId,
//         planName,
//         subPlanName,
//         Price,
//         swampsAllowed:{ increment: swaps } ,
//         planEnd: planEndIng,
//       }
//     })
//     res.status(200).json({ message: "update successfull", data: { updatePlanHistory }, statusCode: 200 });
//     console.log(updatePlanHistory,"user");
//   }else{
//          const plan = await prisma.planHistory.create({ data });
//          const pay = await prisma.PaymentHistory.create({ data: { walletId: uniqid(), driverId, status: "success", amount: Price + plan.cashback } });
//           res.status(200).json({ message: "Transaction successfull", data: { plan, pay }, statusCode: 200 });

//   }

// } catch (error) {
//   console.log("error", error);
//   res.status(500).json({
//     message: "something went wrong",
//     statusCode: 500,
//   });
// }
// };

// const subscribePlanForDriver = async (req, res) => {
//   try {
//     const { driverId, planName, subPlanName, Price, swampsAllowed } = req.body;
//     const fecthPlan = await prisma.plan.findFirst({ where: { planName: planName } });

//     if (!fecthPlan) {
//       res.status(400).json({ message: "This plan is not available", statusCode: 400 });
//       return;
//     }
//     const fecthsubPlan = await prisma.subPlan.findFirst({ where: { subPlanName: subPlanName } });

//     if (!fecthsubPlan) {
//       res.status(400).json({ message: "This subPlan is not available", statusCode: 400 });
//       return;
//     }
//     const userDriver = await prisma.Driver.findUnique({
//       where: {
//         driverID: driverId,
//       },
//       select: {
//         // This will work!
//         driverID: true,
//         driver: true,
//         batteryData: {},
//         paymentData: {},
//         planHistory: {},
//       },
//     });

//     if (!userDriver) {
//       res.status(400).json({ message: "This driver is not available", statusCode: 400 });
//       return;
//     }
//     let planEndIng;
//     if (subPlanName.toLowerCase() === "weekly") {
//       planEndIng = addWeeks();
//     }
//     if (subPlanName.toLowerCase() === "monthly") {
//       planEndIng = addMonths(new Date(), 1);
//     }
//     if (subPlanName.toLowerCase() === "daily") {
//       var date = new Date();
//       date.setDate(date.getDate() + 1);
//       planEndIng = date;
//     }
//     const data = {
//       driverId,
//       planName,
//       subPlanName,
//       Price,
//       swampsAllowed,
//       planEnd: planEndIng,
//     };
//   const checkExistPlanHistory = await prisma.planHistory.findUnique({ where: { driverId: driverId}});
//   // const deletePlan = await prisma.planHistory.deleteMany({
//   //   where: {
//   //     driverId: driverId,
//   //   },
//   // });
//   // console.log("deletePlan", deletePlan);
//   // const pay = await prisma.PaymentHistory.create({ data: { walletId: uniqid(), driverId, status: "success", amount: Price + plan.cashback } });
//   // res.status(200).json({ message: "Transaction successfull", data: { plan, pay }, statusCode: 200 });
 
//   const swaps = req.body.swampsAllowed

//   if(checkExistPlanHistory){
//     console.log(checkExistPlanHistory)
//     console.log(swaps,"plandata");
//     const updatePlanHistory = await prisma.planHistory.update({
//       where: {
//         driverId: driverId,
//       },
//       data: {
//         driverId,
//         planName,
//         subPlanName,
//         Price,
//         swampsAllowed:{ increment: swaps } ,
//         planEnd: planEndIng,
//       }
//     })
//     res.status(200).json({ message: "update successfull", data: { updatePlanHistory }, statusCode: 200 });
//     console.log(updatePlanHistory,"user");
//   }else{
//          const plan = await prisma.planHistory.create({ data });
//          const pay = await prisma.PaymentHistory.create({ data: { walletId: uniqid(), driverId, status: "success", amount: Price + plan.cashback } });
//           res.status(200).json({ message: "Transaction successfull", data: { plan, pay }, statusCode: 200 });

//   }

// } catch (error) {
//   console.log("error", error);
//   res.status(500).json({
//     message: "something went wrong",
//     statusCode: 500,
//   });
// }
// };
         
const subscribePlanForDriver = async (req, res) => {
  try {
    const { driverId, planName, subPlanName, Price, swampsAllowed, dealerId, subSubPlanId } = req.body;
    const subSubPlanDetail = await prisma.subSubPlan.findFirst({ where: { id: subSubPlanId } });
    const additional_swap = subSubPlanDetail.additional_swap;
    const planDuration = subSubPlanDetail.validityPeriod;
    console.log("sub sub plan find", subSubPlanDetail.id);
    const userDriver = await prisma.Driver.findUnique({
      where: {
        driverID: driverId,
      },
      select: {
        // This will work!
        driverID: true,
        driver: true,
        batteryData: {},
        paymentData: {},
        planHistory: {},
      },
    });

    if (!userDriver) {
      res.status(400).json({ message: "This driver is not available", statusCode: 400 });
      return;
    }
    var date = new Date();
    date.setDate(date.getDate() + planDuration);
    var planEndIng = date;


    const getDealerId = await prisma.DealerData.findFirst({ where: { bssCode: dealerId } })
    const getDriverId = await prisma.Driver.findFirst({ where: { driverID: driverId } })
    console.log("dealer Details are", getDealerId, "driver details are", getDriverId)


    const addOrder = await prisma.orders.create(
      {
        data: {
          driver_id: getDriverId.id,
          dealer_id: getDealerId.id,
          order_type: swampsAllowed > 1 ? "BuyPlan" : " additionalSwap"
        }
      }
    )

    console.log("add orders", addOrder)

    const data = {
      driverId,
      planName,
      subPlanName,
      Price,
      swampsAllowed,
      additional_swap,
      planEnd: planEndIng,
    };

    const checkExistPlanHistory = await prisma.planHistory.findUnique({ where: { driverId: driverId } });
    const swaps = req.body.swampsAllowed;

    let obj = {
      commission: 0,
      admin_user: 1,
      dealer_id: dealerId,
      payment_type: "paidToDealer",
      payment_received: Price,
      swap_id: null,
      order_id: addOrder.id
    }
    await handleDealerTransaction(obj)


    if (checkExistPlanHistory) {
      console.log(checkExistPlanHistory);
      console.log(swaps, "plandata");
      const updatePlanHistory = await prisma.planHistory.update({
        where: {
          driverId: driverId,
        },
        data: {
          driverId,
          planName,
          subPlanName,
          Price,
          additional_swap,
          swampsAllowed: {
            increment: swaps,
          },
          planEnd: planEndIng,
        },
      });
      const pay = await prisma.PaymentHistory.create({ data: { walletId: uniqid(), driverId, status: "success", amount: Price, order_id: addOrder.id, plan_id: subSubPlanDetail.id } });

      res.status(200).json({ message: "update successfull", data: { updatePlanHistory }, statusCode: 200 });
      console.log(updatePlanHistory, "user");
    } else {
      const plan = await prisma.planHistory.create({ data });
      const pay = await prisma.PaymentHistory.create({ data: { walletId: uniqid(), driverId, status: "success", amount: Price + plan.cashback, order_id: addOrder.id, plan_id: subSubPlanDetail.id } });
      res.status(200).json({ message: "created successfull", data: { plan, pay }, statusCode: 200 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "something went wrong",
      statusCode: 500,
    });
  }

}
 

const assignBattery = async (req, res) => {
  try {
    const { batteryId, voltage, driverId, status, name } = req.body;

    const dataB = await prisma.Battery.create({
      data: {
        batteryId: batteryId,
        voltage: voltage,
        driverId: driverId,
        status: status,
        name: name,
      },
    });
    res.status(200).json({ message: "Batterry assigned successfull", dataB });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "something went wrong",
    });
  }
};

const swampBattery = async (req, res) => {

  try {
    const { driverId, giveToDriver, takeFromDriver, dealerId } = req.body;
    if (!dealerId) { return res.status(400).json({ message: "please provide dealerId", statusCode: 400 }); }
    if (!driverId) { return res.status(400).json({ message: "please provide driverId", statusCode: 400 }); }
    if (!giveToDriver) { return res.status(400).json({ message: "please provide giveToDriver", statusCode: 400 }); }
    if (!takeFromDriver) { return res.status(400).json({ message: "please provide takeFromDriver", statusCode: 400 }); }
    if (giveToDriver.length === 0 || takeFromDriver.length === 0) {
      return res.status(400).json({ message: "please provide giveToDriver or takeFromDriver details", statusCode: 400 });
    }
    const checkPlanExpired = await prisma.planHistory.findFirst({ where: { driverId: driverId, planEnd: { gt: new Date() } } });
    if (!checkPlanExpired) {
      res.status(400).json({ message: "Your plan has been expired..! please buy additional plan", statusCode: 400 });
      return;
    }



    const checkDriverSwamps = await prisma.Driver.findUnique({ where: { driverID: driverId }, select: { swampsDoneToday: true } });

    let todaySwapDoneAfterDivide = await GetSwapCount(driverId)

    console.log("todaySwapDoneAfterDivide", todaySwapDoneAfterDivide)

    if (todaySwapDoneAfterDivide >= checkPlanExpired.swampsAllowed) {
      res.status(400).json({ message: "Your swamps are completed for the day..!", statusCode: 400 });
      return;
    }

    const oldOutBatteryExisting = await prisma.battery.findMany({ where: { driverId: driverId, name: 'OUT' }, select: { batteryId: true } })
    if (oldOutBatteryExisting.length > 0) {
      await prisma.battery.updateMany({ where: { driverId: driverId, name: 'OUT' }, data: { dealerId: dealerId, name: 'IN' } })
    }
    else {
      const firstTimeSwapInEntry = await prisma.battery.createMany({ data: takeFromDriver, skipDuplicates: true });
    }
    for (var i = 0; i < giveToDriver.length; i++) {
      var isGivenBatteryDetailInBatteryTable = await prisma.battery.findFirst({ where: { batteryId: giveToDriver[i].batteryId }, select: { batteryId: true } });
      var istakeBatteryDetailInBatteryTable = await prisma.battery.findFirst({ where: { batteryId: takeFromDriver[i].batteryId }, select: { batteryId: true } });
      if (isGivenBatteryDetailInBatteryTable) {
        var updateBattery = await prisma.battery.update({ where: { batteryId: giveToDriver[i].batteryId }, data: { driverId: driverId, dealerId: dealerId, name: 'OUT' } })
      }
      else {
        const newBatteryRecord = await prisma.battery.create({ data: giveToDriver[i] });

        const inBatteryId = takeFromDriver[0].batteryId;
        const inDateTime = new Date();

      }
    }

    const getDealerId = await prisma.DealerData.findFirst({ where: { bssCode: dealerId } })
    const getDriverId = await prisma.Driver.findFirst({ where: { driverID: driverId } })

    console.log("dealer Details are", getDealerId, "driver details are", getDriverId)

    const addOrder = await prisma.orders.create(
      {
        data: {
          driver_id: getDriverId.id,
          dealer_id: getDealerId.id,
          order_type: "swapTransaction"
        }
      }
    )

    console.log("add orders", addOrder)

    const totalSwapForToday = todaySwapDoneAfterDivide + 1
    const updateDriverWithSwap = await prisma.Driver.update({ where: { driverID: driverId }, data: { swampsDoneToday: totalSwapForToday, batteryID: giveToDriver[0].batteryId } });
    let dealerDataResp = await prisma.dealerData.findFirst({ where: { bssCode: dealerId }, select: { dealer_type: true, net_due: true } });
    let dealer_type = dealerDataResp.dealer_type
    let commissionByDealerResp = await prisma.commissionByDealer.findFirst({ where: { dealer_type: dealer_type }, select: { commission: true } });
    let commission = commissionByDealerResp.commission
    for (var i = 0; i < giveToDriver.length; i++) {
      var swapTrans = await prisma.swapTransactions.create({ data: { driverId: driverId, batteryIn: takeFromDriver[i].batteryId, batteryOut: giveToDriver[i].batteryId, dealerId: dealerId, commission, order_id: addOrder.id } });
      console.log("swap transaction return response is", swapTrans)

      let data = {
        net_due: dealerDataResp.net_due,
        commission,
        admin_user: 1,
        dealer_id: dealerId,
        payment_type: "paidToDealer",
        payment_received: 0,
        swap_id: swapTrans.id,
        order_id: addOrder.id
      };

      await insertDealerTransaction(data);
    }

    const OUTBattery = await prisma.battery.findMany({ where: { driverId: driverId, name: 'OUT' }, select: { batteryId: true } })
    console.log("OUTBattery_1", OUTBattery)
    const INBattery = await prisma.battery.findMany({ where: { driverId: driverId, name: 'IN' }, select: { batteryId: true } })
    console.log("INBattery_2", INBattery);


    const updatedInDealerId = dealerId;
    var updateOutBatteryDetail;
    var updateInBatteryDetail;
    for (var i = 0; i < takeFromDriver.length; i++) {
      const inBatteryId = takeFromDriver[i].batteryId;
      console.log("inBatteryId", inBatteryId);

      const inDateTime = new Date();
      updateInBatteryDetail = await prisma.inventoryByDealer.updateMany({
        where: {
          asset_id: inBatteryId,
        },
        data: {
          Dealer_Id: updatedInDealerId,
          in_out: "IN",
          inDateTime: inDateTime,
        },
      });
      console.log("Update in Battery detail", updateInBatteryDetail);
    }

    for (var i = 0; i < giveToDriver.length; i++) {
      const outBatteryId = giveToDriver[i].batteryId;
      console.log("outBatteryId", outBatteryId);
      const outDateTime = new Date();

      updateOutBatteryDetail = await prisma.inventoryByDealer.updateMany({
        where: {
          asset_id: outBatteryId,
        },
        data: {
          in_out: "OUT",
          outDateTime: outDateTime,
        },
      });

      console.log("Update out Battery detail", updateOutBatteryDetail);
    }
    return res.status(200).json({ message: "Swap is completed successfully", InBatteryDetail: updateInBatteryDetail, OutBatteryDetail: updateOutBatteryDetail, swapTrans, DriverWithSwap: updateDriverWithSwap });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "something went wrong",
      statusCode: 500,
    });
    return;
  }
};

const submitBattery = async (req, res) => {
  try {
    const { driverId, takeFromDriver } = req.body;
    const submitbattery = await prisma.battery.createMany({ data: takeFromDriver });

    return res.status(200).json({ message: "Battery is submitted successfully", statusCode: 200, data: submitbattery });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "something went wrong",
      statusCode: 500,
    });
    return;
  }
};

function addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}
function addWeeks(numOfWeeks = 1, date = new Date()) {
  date.setDate(date.getDate() + numOfWeeks * 7);

  return date;
}


const dealerTranDetalis = async (req, res) => {
  const dId = req.params.dealerId;
  const res1 = await prisma.$queryRaw(Prisma.sql`select  * from "swapTransactions" st where "createdAt"::date = now()::date and "dealerId" = ${dId}`);
  res.status(200).json({ message: "OK", statusCode: 200, data: res1.length, res1 });
};

const dealerConsolidateReportByDealerId = async (req, res) => {

  try {

    const { dealerId } = req.params

    const singleDealerReport = await prisma.$queryRaw(
      Prisma.sql`select 
      dealer_type 
        ,"bssCode" as dealer_id
        , city
        , COALESCE (sum(dt.commission), 0) as commission  
        , COALESCE (sum(case when payment_type='paidToDealer' then dt.payment_received end),0) total_amount, dd.net_due
        -- , COALESCE ((case when (sum(dt.commission) - sum(case when payment_type='paidToDealer' then dt.payment_received end)) <= 0 then 0 else (sum(dt.commission) - sum(case when payment_type='paidToDealer' then dt.payment_received end)) end), 0) as net_due  
               from "DealerData" dd 
        left join "dealerTransaction" dt on dt.dealer_id = dd."bssCode" 
        where dd."bssCode" =${dealerId}
        group by dd.id `
    )
    console.log(singleDealerReport);
    res.status(200).json(singleDealerReport);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the dealerplan",
    });
  }
}

const duplicateBattery = async (req, res) => {
  const { batteryId, dealerId } = req.params;
  console.log(req.body);
  if (!batteryId) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }
  const user = await prisma.inventoryByDealer.findFirst({
    where: {
      asset_id: batteryId,
      Dealer_Id: dealerId

    },
    select: {
      asset_id: true,
      in_out: true,
      Dealer_Id: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  console.log("usermobile Assign Data", user);
  if (user) {
    // throw new BadRequestError("battery already Assign");
    return res.status(200).json({ msg: "OK", user });

  }

  try {

    res.status(200).json({ message: "Battery Not Assign", user: user });


  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the dealerplan",
    });
  }
};

const GetSwapCount = async (driverId) => {
  var todayTransaction = 0;
  const todayTransactionsCount = await prisma.$queryRaw(Prisma.sql`select count("driverId") as overallswap from "swapTransactions" st 
  where 
  "createdAt"::Date =  now()::date 
  and "driverId" = ${driverId}
  group by "createdAt"::Date`);
  console.log("today transactions count", todayTransactionsCount)

  if (todayTransactionsCount.length > 0) {
    todayTransaction = todayTransactionsCount[0]["overallswap"]
  }

  const no_of_battery = await prisma.$queryRaw(Prisma.sql`
  select no_of_battery from "Driver" d 
  inner join "vehicleMaster" vm2 on vm2."vehicleType" = d."vehicleType" 
  where "driverID" = ${driverId}`);

  console.log("today_all_transaction, no_of_battery, today_swaps = today_all_transaction/no_of_battery", todayTransaction, no_of_battery[0]["no_of_battery"], parseInt(parseInt(todayTransaction) / parseInt(no_of_battery[0]["no_of_battery"])));
  var todaySwapDoneAfterDivide = parseInt(parseInt(todayTransaction) / parseInt(no_of_battery[0]["no_of_battery"]))

  return todaySwapDoneAfterDivide
}


async function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
}

const verifyGeoFence = async (req, res) => {

  console.log("request body", req.body)


  const { dealerId, batteryData } = req.body

  const findDealerCordinates = await prisma.dealerData.findFirst({
    where: {
      bssCode: dealerId
    }
  })

  const dealerCoordinates = findDealerCordinates.coordinates.split(",")
  console.log('batteryData', batteryData, dealerCoordinates)

  let batteryStatus = []

  for (var i = 0; i < batteryData.length; i++) {
    let isInRadius = await distance(dealerCoordinates[0], dealerCoordinates[1], batteryData[i].lat, batteryData[i].long, "K")
    console.log("isInRadius", isInRadius)
    const batteryName = "battery" + (i + 1)
    if (isInRadius > 0.02) {
      console.log("battery out of range")
      batteryStatus.push({
        [batteryName]: false,
        batteryId: batteryData[i].batteryCode
      })
    }
    else {
      batteryStatus.push({
        [batteryName]: true,
        batteryId: batteryData[i].batteryCode
      })
    }
  }

  res.status(200).json({
    message: "OK",
    batteryStatus: batteryStatus
  });
}

const getReports = async (req, res) => {

  console.log("request for api is", req)

  const reportData = await prisma.$queryRaw(Prisma.sql`
  select o.id, dd."bssCode"  , d."driverID", o.created_at , st."batteryIn" , st."batteryOut"  , st.commission , ph.amount , ph.plan_id, sb."swampsAllowed", sb."validityPeriod" , sb."Price"  
  from public."orders" o 
  left join "Driver" d on d.id = o.driver_id  
  left join "DealerData" dd on dd.id = o.dealer_id 
  left join "swapTransactions" st on st.order_id = o.id
  left join "PaymentHistory" ph on ph.order_id = o.id
  left join "subSubPlan" sb on sb.id = ph.plan_id 
  where o.is_deleted = false
`);


  res.status(200).json({
    message: "OK",
    data: reportData
  })
}

export { duplicateBattery, dealerTranDetalis, getDriverDetails, getDriverDetailsScreen2, subscribePlanForDriver, assignBattery, swampBattery, submitBattery, dealerConsolidateReportByDealerId, verifyGeoFence, getReports };
