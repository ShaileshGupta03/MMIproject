import express from "express";
const app = express();
import morgan from "morgan";
import session from "express-session";
import flash from "connect-flash";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
import "express-async-errors";
dotenv.config();
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import auth from "./middleware/authorization.js";
import dashboardRouter from "./routes/dashboardRouter.js";
import driverlogin from "./routes/driverloginRouter.js";
import drivercontroller from "./routes/drivercontrollerRouter.js";
import dashboardDealerRouter from "./routes/dashboardDealerRouter.js";
import referralOnboard from "./routes/referralOnboardRouter.js";
import bulkUploadVendorRouter from "./routes/bulkUploadVendorRouter.js";
import planRouter from "./routes/planRouter.js";
import planOrderHistoryRouter from "./routes/planOrderHistoryRouter.js";
import vendorRouter from "./routes/vendorRouter.js";
import subPlanRouter from "./routes/subPlanRouter.js";
import subsubPlanRouter from "./routes/subsubPlanRouter.js";
import assetTypeRouter from "./routes/assettypeRouter.js";
import batteryItemRouter from "./routes/batteryItemRouter.js";
import csvUploadRouter from "./routes/csvUploadRouter.js";
import inventoryRouter from "./routes/inventoryRouter.js"; // inventoryRouter use
import userLogin from "./routes/userRegisterLoginRouter.js"
// import imgUpload from "./routes/imgReadRouter.js"
import imageRead from "./routes/imgReadRouter.js"
import doucment from "./routes/doucmentRouter.js"
import tagging from "./routes/taggingRouter.js"
import userRoleAndAccess from "./routes/userRoleAndAccessRouter.js"
import enablePaymentRouter from "./routes/enablePaymentRouter.js";
import adminDetailRouter from "./routes/adminDetailRouter.js"; //adminDetailRouter
import dealerTransaction from "./routes/dealerTransactionRouter.js";
//Tagging
import InventoryManagementRouter from "./routes/inventorymanagementrouter.js";




import adminRouter from "./routes/adminRouter.js";


import downloadCsvRouter from "./routes/downloadCsvRouter.js"


// import  InventoryManagementRouter from "./routes/InventoryManagementRouter.js";

import clusterMappingRouter from "./routes/clusterMappingRouter.js";

// import userRoleRouter from "./routes/userRoleRouter.js";
//adminDetailRouter
// import adminDetailRouter from "./routes/adminDetailRouter.js";


import  userRoleRouter from "./routes/userRoleAndAccessRouter.js";
//errors
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(cors());
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BATTERY  API",
      version: "1.0.0",
      description: "Battery API ",
      contact: {
        name: "battery project",
        url: "https://batterytest.elitemindz.tech",
        email: "elite1@.com",
      },
      servers: [
        {
          url: "https://batterytest.elitemindz.tech",
          description: "Development server",
        },
      ],
    },
    basePath: "/",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Example: Bearer abcdefghijklmnopqrstuvwxyz",
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  },
  apis: ["./routes/authRouter.js", "./routes/dashboardRouter.js"],
};
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(morgan("dev"));

app.use(express.json());

// app.use(cookieParser())
// Express session

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // ms
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,

    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
//Driver router
app.use("/api/b1/auth", authRouter); // Driver login
app.use("/api/b1/driver/drivercontroller", auth, drivercontroller);
app.use("/api/b1/vehicleInfo", auth, dashboardDealerRouter);
app.use("/api/b1/referralOnboard", referralOnboard);
app.use("/api/b1/dashboard", auth, dashboardRouter);

// Dealer router
app.use("/api/b1/driver", driverlogin); //Dealer login
app.use("/api/b1/dealer", auth, dealerTransaction);
app.use("/api/b1/plan", auth, planRouter);
app.use("/api/b1/subplan", auth, subPlanRouter);
app.use("/api/b1/subsubplan", auth, subsubPlanRouter);

//Admin router
app.use("/api/b1/admin", adminRouter);
app.use("/api/b1/vendor", auth, vendorRouter);
app.use("/api/b1/asset", auth, assetTypeRouter);



//inventory
app.use("/api/b1/inventory", auth, inventoryRouter);
app.use("/api/b1/enablePayment", auth, enablePaymentRouter);
app.use("/api/b1/adminDetail", auth, adminDetailRouter);

//inventory management
app.use("/api/b1/inventoryManagement", auth, InventoryManagementRouter);
app.use("/api/b1/vendorBulkUpload", auth, bulkUploadVendorRouter);
app.use("/api/b1/tagging", auth, tagging);
app.use("/api/b1/item", auth, batteryItemRouter);
//csvUpload Driver
app.use("/api/b1/admin", adminRouter);

//clusterMapping

app.use("/api/b1/clusterMapping", clusterMappingRouter);

// app.use("/api/b1/Mapping", mappingRouter);


//UserRoleAccess
app.use("/api/b1/userRoleRouter", userRoleRouter);
app.use("/api/b1/item", batteryItemRouter);
//inventory
app.use("/api/b1/inventory", inventoryRouter) //inventoryRouter use
app.use("/api/b1/user", userLogin)
app.use("/api/b1/readImg", imageRead)
app.use("/api/b1/doucment", doucment)
app.use("/api/b1/tagging", tagging)
app.use("/api/b1/userRole", userRoleAndAccess)



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello there");
});

const start = async () => {
  try {
    app.listen(PORT, (req, res) => {
      console.log(`server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
