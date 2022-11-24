import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { NotFoundError, BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import { hashPassword, createJWT, comparePassword, currentTime, OtpGen } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { loginDash, registerDash } from "../utils/logger/index.js";
import { handleDealerTransaction } from "../controllers/dealerTransactionController.js";


//! Register User
const register = async (req, res) => {
  const { username, password, role } = req.body;

  //* checking if any one of the field is empty will throw an error
  if (!username) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }

  //checking if user exist
  const userAlreadyExist = await prisma.admin.findUnique({
    where: {
      username: username,
    },
  });

  if (userAlreadyExist) {
    throw new BadRequestError("User already exist");
  }

  //encrypting the password
  //const newPassword = await hashPassword(password);

  //creating user
  const newUser = await prisma.admin.create({
    data: {
      username: username,
      password: password,
      role: role,
    },
  });
  // let aId = `${process.env.PREFIX}${newUser.id}`;
  // const updatedUser = await prisma.admin.update({
  //   where: { id: newUser.id },
  //   data: {
  //     adminId: aId,
  //   },
  // });
  res.status(StatusCodes.OK).json({
    msg: "created successfully",
    newUser,
  });
};

//!LOGIN USER
const login = async (req, res) => {
  //* Logical code starts from here
  const { username, password } = req.body;
  console.log(req.body);
  if (!username) {
    loginDash.log("Please provide all the values");
    throw new BadRequestError("Please provide all the values");
  }

  //checking if user exist in DB
  const user = await prisma.admin.findFirst({
    where: {
      username: username,
      password: password,
    },
  });

  //Throwing an error
  if (!user) {
    loginDash.log("User is not registered");
    throw new UnAuthenticatedError("User is not Registered");
  }
  if (password == user.password) {
    console.log("Password verified");
    const token = await createJWT(user);
    res.status(200).json({ msg: "login successfully", token: token });
  } else {
    throw new BadRequestError("please enter password!!");
  }

  // res.status(200).json({
  //  "msg":"login successfully"
  //})
};


const amountReceived = async (req, res) => {

  try {
    // const { driverMasterId } = req.body;
    // if (!driverMasterId) {

    //   throw new BadRequestError("Please provide all values");
    // }
    const obj = req.body;
    let data = {
      commission: 0,
      admin_user: obj.admin_user,
      dealer_id: obj.bss_code,
      payment_type: "paidToAdmin",
      payment_received: obj.payment_received,
      swap_id: null
    };

    const receivedamount = await handleDealerTransaction(data);
    console.log("receivedamount", receivedamount)
    res.status(200).json({ message: "OK", statusCode: 200 });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while amountReceived",
    });
  }
};


const accounts = async (req, res) => {
  try {
    //     const data = await prisma.dealerTransaction.findMany({
    //  });
    let data = await prisma.dealerTransaction.groupBy({
      by: ['dealer_id'],
      _sum: { net_due: true, payment_received: true, commission: true },
    });
    data = data.map((obj) => { return { ...obj._sum, dealer_id: obj.dealer_id } })
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the dealerplan",
    });
  }
}

const accountsById = async (req, res) => {
  try {
    // const data = await prisma.dealerTransaction.findMany({
    //   where: {
    //     dealer_id: parseInt(req.params.id)
    //   },
    // });

    let data = await prisma.dealerTransaction.groupBy({
      by: ['dealer_id'],
      where: {
        dealer_id: parseInt(req.params.id)
      },
      _sum: { net_due: true, payment_received: true, commission: true },
    });
    data = data.map((obj) => { return { ...obj._sum, dealer_id: obj.dealer_id } })
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the dealerplan",
    });
  }
}

const dealerTransactionsById = async (req, res) => {
  try {
    const data = await prisma.dealerTransaction.findMany({
      where: {
        dealer_id: parseInt(req.params.id)
      },
    });
    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the dealerplan",
    });
  }
}


const dealerConsolidateReport = async (req, res) => {
  try {

    const consReport = await prisma.$queryRaw(
      Prisma.sql`select 
      dealer_type 
        ,"bssCode" as dealer_id
        , city
        , COALESCE (sum(dt.commission), 0) as commission  
        , COALESCE (sum(case when payment_type='paidToDealer' then dt.payment_received end),0) total_amount, dd.net_due
        -- , COALESCE ((case when (sum(dt.commission) - sum(case when payment_type='paidToDealer' then dt.payment_received end)) <= 0 then 0 else (sum(dt.commission) - sum(case when payment_type='paidToDealer' then dt.payment_received end)) end), 0) as net_due  
               from "DealerData" dd 
        left join "dealerTransaction" dt on dt.dealer_id = dd."bssCode" 
        
        group by dd.id`
    )

    res.status(200).json(consReport);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while fetching all dealers report",
    });
  }
}


const dealerLedger = async (req, res) => {
  try {
    const { dealerId } = req.params
    // const dealer_detail = await prisma.dealerData.findFirst({
    //   where: {
    //     bssCode: dealerId
    //   },
    // });
    const dealer_ledger = await prisma.$queryRaw(
      Prisma.sql`select "createdDate"::date as txn_date
      , concat('TXN',  LPAD(id::text, 3, '0')) as txn_id
      , payment_type as txn_type
      , coalesce(net_due,0) as net_due 
      , coalesce(commission,0)  as commission 
        from "dealerTransaction" dt 
        where dealer_id = ${dealerId}
        order by  "createdDate" desc `
    );
    console.log("dealer ledger", dealer_ledger)
    res.status(200).json({ message: "OK", dealer_ledger });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while fetching dealer ledger",
    });
  }
}
const dealerWiseApp = async (req, res) => {
  try {
    const { dealerId } = req.params
    const dealerWise_App = await prisma.$queryRaw(
      Prisma.sql`select cast("createdDate"::date as varchar ) as txn_date
      , cast(coalesce (count(case when commission!=0 then dt.commission end),0) as varchar)  as SwapCount
      , cast(coalesce (count(case when (payment_type='paidToDealer' and commission=0)  then dt.commission end),0) as varchar)  as PlanSold
      
      , cast(COALESCE (sum(case when (payment_type='paidToDealer' and commission=0) then dt.payment_received end),0) as varchar) TransactionAmount
      , cast(coalesce(sum(commission),0) as varchar)  as commission
     
        from "dealerTransaction" dt 
        where payment_type= 'paidToDealer'and dealer_id = ${dealerId} 
        
        group by ("createdDate"::date)
        order by  txn_date desc`
    );
    console.log("dealer-ledger-wiaseApp", dealerWise_App)
    res.status(200).json({ message: "OK", dealerWise_App });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while fetching dealer ledger",
    });
  }
}

export { register, login, amountReceived, accounts, accountsById, dealerTransactionsById, dealerConsolidateReport, dealerLedger, dealerWiseApp };
