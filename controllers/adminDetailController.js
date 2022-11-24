import { PrismaClient, Prisma } from "@prisma/client";
import { parseString } from "fast-csv";
import { parse } from "path";
const prisma = new PrismaClient();

import { send, sendError } from "../utils/sendFormat.js";


//Admin_driver listing
const getallDriver = async (req, res) => {
  try {


    const queryObject = { where: {} };
    // sorting
    const sortArr = [];
    if (req.query?.fieldName && req.query?.sortDir) {
      const obj = {};
      obj[req.query.fieldName] = req.query.sortDir.toLowerCase();
      sortArr.push(obj);
      queryObject.orderBy = sortArr;
    }
    // Pagination
    queryObject.skip = parseInt(req.query.page) || 0;
    queryObject.take = parseInt(req.query.limit) || 100;
    const selectdata = await prisma.driver.findMany({
      //  where: {
      //   name: req.query.name,
      //  },

      select: {
        driver: true,
        createdAt: true,
        //  onboardedOn:createdAt
        onboardedBy: true,
        status: true,
        GroupName: true,
        driverID: true
        //    
      }
    })
    const data = [];
    selectdata.forEach(getObj => {
      data.push({ "driver": getObj.driver, "onboardedOn": getObj.createdAt, "GroupName": getObj.GroupName, "onboardedBy": getObj.onboardedBy, "status": getObj.status, "driverID": getObj.driverID });
    });

    return res.status(200).json({ message: "Fechted successfully", data });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateAllDriver = async (req, res) => {
  try {
    const data = await prisma.driver.update({
      where: { driverID: req.params.driverID },
      data: req.body,
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

const updateDriverCurrent = async (req, res) => {


  try {
    

    const updateCurrent = prisma.currentAddres.updateMany({
      where: {
        driverMasterId: req.params.driverID,
      },
      data: {
        status:req.body.status, 
        cureentLineHouseNo:req.body.cureentLineHouseNo,

      }
           
    });
    const updateDriverData = prisma.driver.update({
      where: {
        driverID: req.params.driverID,
      },
      data: {status:req.body.status, GroupName:req.body.GroupName,
      }
    });

    const transaction = await prisma.$transaction([updateDriverData, updateCurrent, ]);
    return send(res, "updated successfully", transaction,);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
  // try {

    
  //   const updateDriver = prisma.driver.update({ where: { driverID:req.params.driverID },
  //     data: {
  //       status: req.body.status,
  //     },
  //   });
  //   const updateCurrentData = await prisma.currentAddres.updateMany({
  //     where: { driverMasterId: req.params.driverID },
  //     data: {
  //       status: req.body.status,
  //     },
  //   });
  //   const transaction = await prisma.$transaction([updateCurrentData, updateDriver]);

  //   return send(res, "updated successfully", transaction);

  // } catch (err) {
  //   res.status(500).json({ message: err.message || "Something went wrong" });
  // }
};




const deleteAllDriver = async (req, res) => {
  try {
    const data = await prisma.driver.delete({ where: { driverID: req.params.driverID } });
    return send(res, "deleted successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
}

const getByDriverID = async (req, res) => {
  try {

    const selectdata = await prisma.driver.findMany({
      where: {
        driverID: req.params.driverID,
      },
      select: {
        driver: true,
        mobileNo: true,
        AadharId: true,
        AssetService: true

      }
    })

    const data = [];
    selectdata.forEach(getObj => {
      data.push({ 'driver': getObj.driver, "mobileNo": getObj.mobileNo, "AadharId": getObj.AadharId, "AssetService": getObj.AssetService });
    });
    return res.status(200).json({ message: "Fechted successfully", data });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

// const updateDriverByID = async (req, res) => {
//   try {
//     const data = await prisma.driver.update({
//       where: { driverID: req.params.driverID },
//       data: req.body,
//     });
//     res.status(200).json({ message: "OK", data });
//   } catch (err) {
//     res.status(500).json({ message: err.message || "Something went wrong" });
//   }
// };

const getDriverPersonalDetail = async (req, res) => {
  try {
    const data = await prisma.persnoalDetails.findMany({
      where: { driverMasterId: req.params.driverMasterId, },
    });
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateDriverPersonalDetail = async (req, res) => {
  try {
    const data = await prisma.persnoalDetails.update({
      where: { driverMasterId: req.params.driverMasterId },
      data: req.body,
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};



const getDriverVehicleDetail = async (req, res) => {
  try {
    const data = await prisma.vehicleDetails.findMany({
      where: { driverMasterId: req.params.driverMasterId, },
    });


    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateDriverVehicleDetail = async (req, res) => {
  try {
    const data = await prisma.vehicleDetails.update({
      where: { driverMasterId: req.params.driverMasterId },
      data: req.body,
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

const getDriverVehicleOwner = async (req, res) => {
  try {
    const data = await prisma.vehicleOwner.findMany({
      where: { driverMasterId: req.params.driverMasterId, },
    });
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateDriverVehicleOwner = async (req, res) => {
  try {
    const data = await prisma.vehicleOwner.update({
      where: { driverMasterId: req.params.driverMasterId },
      data: req.body,
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

const getDriverReferrerOnboard = async (req, res) => {
  try {
    const data = await prisma.referralOnboard.findMany({
      where: { Scheme_ID: req.params.Scheme_ID, },
    });
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateDriverReferrerOnboard = async (req, res) => {
  try {
    const data = await prisma.referralOnboard.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

const getDriverDocuments = async (req, res) => {
  try {
    const data = await prisma.documentVerification.findMany({
      where: { driver_id: req.params.driver_id, },
    });
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const updateDriverDocuments = async (req, res) => {
  try {
    const data = await prisma.document.update({
      where: { driverMasterId: req.params.driverMasterId },
      data: req.body,
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};


const getDriverGuarantorDetail = async (req, res) => {
  try {
    const data = await prisma.guarantorDetails.findMany({
      where: { driverMasterId: req.params.driverMasterId, },
    });
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateDriverGuarantorDetail = async (req, res) => {
  try {
    const data = await prisma.guarantorDetails.update({
      where: { driverMasterId: req.params.driverMasterId },
      data: req.body,
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

const getDriverCurrentAddress = async (req, res) => {
  try {
    const data = await prisma.currentAddres.findMany({
      where: { driverMasterId: req.params.driverMasterId, },
    });
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const updateDriverCurrentAddress = async (req, res) => {
  try {
    const data = await prisma.currentAddres.update({
      where: { driverMasterId: req.params.driverMasterId },
      data: req.body,
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
const PostRaiseConcern = async (req, res) => {

  try {
    const data = await prisma.raiseConcern.create({ data: req.body });
    return send(res, "created successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

//dealer list
export { getallDriver, updateAllDriver,updateDriverCurrent, deleteAllDriver, getByDriverID, getDriverPersonalDetail, updateDriverPersonalDetail, getDriverVehicleDetail, updateDriverVehicleDetail, getDriverVehicleOwner, updateDriverVehicleOwner, getDriverReferrerOnboard, updateDriverReferrerOnboard, getDriverDocuments, updateDriverDocuments, getDriverGuarantorDetail, updateDriverGuarantorDetail, getDriverCurrentAddress, updateDriverCurrentAddress, PostRaiseConcern };
