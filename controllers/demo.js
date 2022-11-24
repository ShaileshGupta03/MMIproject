const subscribePlanForDriver = async (req, res) => {
    try {
      const { driverId, planName, subPlanName, Price, swampsAllowed } = req.body;
      const fecthPlan = await prisma.plan.findFirst({ where: { planName: planName } });
  
      if (!fecthPlan) {
        res.status(400).json({ message: "This plan is not available", statusCode: 400 });
        return;
      }
      const fecthsubPlan = await prisma.subPlan.findFirst({ where: { subPlanName: subPlanName } });
  
      if (!fecthsubPlan) {
        res.status(400).json({ message: "This subPlan is not available", statusCode: 400 });
        return;
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
        res.status(400).json({ message: "This driver is not available", statusCode: 400 });
        return;
      }
      let planEndIng;
      if (subPlanName.toLowerCase() === "weekly") {
        planEndIng = addWeeks();
      }
      if (subPlanName.toLowerCase() === "monthly") {
        planEndIng = addMonths(new Date(), 1);
      }
      if (subPlanName.toLowerCase() === "daily") {
        var date = new Date();
        date.setDate(date.getDate() + 1);
        planEndIng = date;
      }
      const data = {
        driverId,
        planName,
        subPlanName,
        Price,
        swampsAllowed,
        planEnd: planEndIng,
      };
    
    const checkExistPlanHistory = await prisma.planHistory.findUnique({ where: { driverId: driverId }});
    // const deletePlan = await prisma.planHistory.deleteMany({
    //   where: {
    //     driverId: driverId,
    //   },
    // });
    // console.log("deletePlan", deletePlan);
    // const pay = await prisma.PaymentHistory.create({ data: { walletId: uniqid(), driverId, status: "success", amount: Price + plan.cashback } });
    // res.status(200).json({ message: "Transaction successfull", data: { plan, pay }, statusCode: 200 });
   
    const swaps = req.body.swampsAllowed
  
    if(checkExistPlanHistory){
      console.log(checkExistPlanHistory)
      console.log(swaps,"plandata");
      const updatePlanHistory = await prisma.planHistory.update({
        where: {
          driverId: driverId,
        },
        data: {
          driverId,
          planName,
          subPlanName,
          Price,
          swampsAllowed:{ increment: swaps } ,
          planEnd: planEndIng,
        }
      })
      res.status(200).json({ message: "update successfull", data: { updatePlanHistory }, statusCode: 200 });
      console.log(updatePlanHistory,"user");
    }else{
         const plan = await prisma.planHistory.create({ data });
      const pay = await prisma.PaymentHistory.create({ data: { walletId: uniqid(), driverId, status: "success", amount: Price + plan.cashback } });
       res.status(200).json({ message: "Transaction successfull", data: { plan, pay }, statusCode: 200 });
    
    }
  
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "something went wrong",
      statusCode: 500,
    });
  }
  };