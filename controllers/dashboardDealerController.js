import path from "path";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { NotFoundError, BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { send, sendError } from "../utils/sendFormat.js";
import { registerDash } from "../utils/logger/index.js";

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, "./images/vehicleinfo"); },
  filename: function (req, file, cb) { cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); },
});
const imageStorageOwner = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, "./images/vehicleowner"); },
  filename: function (req, file, cb) { (null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); },
});
const imageStorageGuarantor = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, "./images/guarantorinfo"); },
  filename: function (req, file, cb) { cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); },
});

//! image Uploader
const imgUploader = multer({ storage: imageStorage }).fields([{ name: "uploadRCdocument", maxCount: 1 }, { name: "uploadRCdocument2", maxCount: 1 },
]);
const imgUploaderOwner = multer({ storage: imageStorageOwner }).single("uploadDocument");
const imgGuarantorInfo = multer({ storage: imageStorageGuarantor }).single("uploadDocument");
// const imgUploader1 = multer({ storage: imageStorage1 }).single("upload");

//Code Vehicale Api
const createVehicleDetail = async (req, res) => {
  const { registeredUnRegistered, uploadRCdocument2, uploadRCdocument, vehicleRegNo, regValidity, vehicleType, chasisNo, vehicleMake, vehicleModel, vehicleFinanced, purchaseDate, financerName, insuranceStatus, insuranceUpto, vehicleTypeid } = req.body;
  let { financerContactNo, driverMasterId } = req.body;
  if (!driverMasterId) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }
  try {
    const User = await prisma.vehicleDetails.upsert({
      where: {
        driverMasterId: driverMasterId,
      },
      update: {
        vehicleType: vehicleType,
        vehicleRegNo: vehicleRegNo,
        regValidity: regValidity,
        chasisNo: chasisNo,
        vehicleMake: vehicleMake,
        vehicleModel: vehicleModel,
        purchaseDate: purchaseDate,
        vehicleFinanced: vehicleFinanced,
        financerName: financerName,
        insuranceStatus: insuranceStatus,
        insuranceUpto: insuranceUpto,
        financerContactNo: parseInt(financerContactNo),
        uploadRCdocument: uploadRCdocument,
        uploadRCdocument2: uploadRCdocument2,
        registeredUnRegistered: registeredUnRegistered,
        driverMasterId: driverMasterId,
      },
      create: {
        vehicleType: vehicleType,
        vehicleRegNo: vehicleRegNo,
        regValidity: regValidity,
        chasisNo: chasisNo,
        vehicleMake: vehicleMake,
        vehicleModel: vehicleModel,
        purchaseDate: purchaseDate,
        vehicleFinanced: vehicleFinanced,
        financerName: financerName,
        insuranceStatus: insuranceStatus,
        insuranceUpto: insuranceUpto,
        financerContactNo: parseInt(financerContactNo),
        uploadRCdocument: uploadRCdocument,
        uploadRCdocument2: uploadRCdocument2,
        registeredUnRegistered: registeredUnRegistered,
        driverMasterId: driverMasterId,
      },
    });
    const Driver = await prisma.Driver.update({
      where: {
        driverID: driverMasterId,
      },
      data: { vehicleType: parseInt(vehicleType) },
      select: { vehicleType: true, driverID: true },
    });

    const findDriverId = await prisma.driver.findFirst({ where: { driverID: driverMasterId } })
    const findRc1Id = await prisma.documentMaster.findFirst({ where: { document_name: 'vehicleRC1' } })
    const findRc2Id = await prisma.documentMaster.findFirst({ where: { document_name: 'vehicleRC2' } })

    const deleteRC1 = await prisma.documentVerification.updateMany({ where: { driver_id: findDriverId.id, document_id: findRc1Id.id }, data: { is_deleted: true } })
    const deleteRC2 = await prisma.documentVerification.updateMany({ where: { driver_id: findDriverId.id, document_id: findRc2Id.id }, data: { is_deleted: true } })

    const updateRCdocuments = await prisma.documentVerification.createMany({
      data: [
        { document_id: findRc1Id.id, driver_id: findDriverId.id, document_file: uploadRCdocument },
        { document_id: findRc2Id.id, driver_id: findDriverId.id, document_file: uploadRCdocument2 }
      ]
    })

    console.log(Driver, "VehicaltypeDriver");
    res.status(200).json({ message: "OK", User, Driver });
    console.log(User);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the driver",
    });
  }
};

const createVehicleOwner = async (req, res) => {
  const { name, currentAddress, currentAddressArea, currentAddressPinCode, currentAddressCity, currentAddressState, permanentAddress, permanentAddressArea, permanentAddressPinCode, permanentAddressCity, permanentAddressState, AdharId, uploadDocument, sameAscurrentaddress } = req.body;
  let { mobileNo, driverMasterId } = req.body;
  mobileNo = "" + mobileNo; // convert in string using '' + mobileNo
  try {
    const Owner = await prisma.vehicleOwner.upsert({
      where: {
        driverMasterId: driverMasterId,
      },
      update: {
        name: name,
        mobileNo: mobileNo,
        currentAddress: currentAddress,
        currentAddressArea: currentAddressArea,
        currentAddressPinCode: currentAddressPinCode,
        currentAddressCity: currentAddressCity,
        currentAddressState: currentAddressState,
        sameAscurrentaddress: sameAscurrentaddress,
        permanentAddress: permanentAddress,
        permanentAddressArea: permanentAddressArea,
        permanentAddressPinCode: permanentAddressPinCode,
        permanentAddressCity: permanentAddressCity,
        permanentAddressState: permanentAddressState,
        AdharId: AdharId,
        uploadDocument: uploadDocument,
        driverMasterId: driverMasterId,
        // uploadDocument: req.file.path,
        //  vehicleTypeid:vehicleTypeid
      },
      create: {
        name: name,
        mobileNo: mobileNo,
        currentAddress: currentAddress,
        currentAddressArea: currentAddressArea,
        currentAddressPinCode: currentAddressPinCode,
        currentAddressCity: currentAddressCity,
        currentAddressState: currentAddressState,
        sameAscurrentaddress: sameAscurrentaddress,
        permanentAddress: permanentAddress,
        permanentAddressArea: permanentAddressArea,
        permanentAddressPinCode: permanentAddressPinCode,
        permanentAddressCity: permanentAddressCity,
        permanentAddressState: permanentAddressState,
        AdharId: AdharId,
        uploadDocument: uploadDocument,
        driverMasterId: driverMasterId,
        // uploadDocument: req.file.path,
        //  vehicleTypeid:vehicleTypeid
      },
    });


    const findDriverId = await prisma.driver.findFirst({ where: { driverID: driverMasterId } })
    const findVehicleOwnerAadhar = await prisma.documentMaster.findFirst({ where: { document_name: 'vehicleOwnerAadhar' } })

    const deleteVehicleOwnerAadhar = await prisma.documentVerification.updateMany({ where: { driver_id: findDriverId.id, document_id: findVehicleOwnerAadhar.id }, data: { is_deleted: true } })

    console.log("DOCUMENT IDS ARE", findDriverId, findVehicleOwnerAadhar)

    const updateRCdocuments = await prisma.documentVerification.create({ data: { document_id: findVehicleOwnerAadhar.id, driver_id: findDriverId.id, document_file: uploadDocument } })

    res.status(200).json({ message: "OK", Owner });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the dealerplan",
    });
  }
};

const createGuarantorDetail = async (req, res) => {
  const { mobileNo, uploadDocument, name, currentAddress, currentAddressArea, currentAddressPinCode, currentAddressCity, currentAddressState, permanentAddress, permanentAddressArea, permanentAddressPinCode, permanentAddressCity, permanentAddressState, sameAscurrentaddress, AdharId } =
    req.body;
  let { driverMasterId } = req.body;
  try {
    const details = await prisma.guarantorDetails.upsert({
      where: {
        driverMasterId: driverMasterId,
      },
      update: {
        name: name,
        mobileNo: mobileNo,
        currentAddress: currentAddress,
        currentAddressArea: currentAddressArea,
        currentAddressPinCode: currentAddressPinCode,
        currentAddressCity: currentAddressCity,
        currentAddressState: currentAddressState,
        sameAscurrentaddress: sameAscurrentaddress,
        permanentAddress: permanentAddress,
        permanentAddressArea: permanentAddressArea,
        permanentAddressPinCode: permanentAddressPinCode,
        permanentAddressCity: permanentAddressCity,
        permanentAddressState: permanentAddressState,
        AdharId: AdharId,
        uploadDocument: uploadDocument,
        driverMasterId: driverMasterId,
        // uploadDocument: req.file.path,
      },
      create: {
        name: name,
        mobileNo: mobileNo,
        currentAddress: currentAddress,
        currentAddressArea: currentAddressArea,
        currentAddressPinCode: currentAddressPinCode,
        currentAddressCity: currentAddressCity,
        currentAddressState: currentAddressState,
        sameAscurrentaddress: sameAscurrentaddress,
        permanentAddress: permanentAddress,
        permanentAddressArea: permanentAddressArea,
        permanentAddressPinCode: permanentAddressPinCode,
        permanentAddressCity: permanentAddressCity,
        permanentAddressState: permanentAddressState,
        AdharId: AdharId,
        uploadDocument: uploadDocument,
        driverMasterId: driverMasterId,
        // uploadDocument: req.file.path,
      },
    });

    const findDriverId = await prisma.driver.findFirst({ where: { driverID: driverMasterId } })
    const findguarantorDocument = await prisma.documentMaster.findFirst({ where: { document_name: 'guarantorDocument' } })

    console.log("DOCUMENT IDS ARE", findDriverId, findguarantorDocument)

    const deleteGuranatorDocument = await prisma.documentVerification.updateMany({ where: { driver_id: findDriverId.id, document_id: findguarantorDocument.id }, data: { is_deleted: true } })

    const updateRCdocuments = await prisma.documentVerification.create({ data: { document_id: findguarantorDocument.id, driver_id: findDriverId.id, document_file: uploadDocument } })

    res.status(200).json({ message: "OK", details });
    console.log(details);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating details",
    });
  }
};

const getVehicleOwner = async (req, res) => {
  let { mobileNo } = req.body;
  mobileNo = "" + mobileNo;
  let driverMasterId = req.user.userId;
  const user = await prisma.driver.findUnique({
    where: {
      id: driverMasterId,
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }
  const Owner = await prisma.vehicleOwner.findMany({
    where: {
      mobileNo: mobileNo,
    },
  });
  if (Owner.length == 0) {
    throw new BadRequestError("details not found");
  }
  res.status(200).send(Owner);
};

const getVehicleDetail = async (req, res) => {
  let { financerContactNo } = req.body;
  financerContactNo = parseInt(financerContactNo);
  let driverMasterId = req.user.userId;
  const user = await prisma.driverExtendedData.findUnique({
    where: {
      id: driverMasterId,
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }

  const detail = await prisma.vehicleDetails.findMany({
    where: {
      financerContactNo: financerContactNo,
    },
  });
  if (detail.length == 0) {
    throw new BadRequestError("details not found");
  }
  res.status(200).json({ message: "OK", detail });
};

const getGuarantorDetail = async (req, res) => {
  let { mobileNo } = req.body;

  let driverMasterId = req.user.userId;
  mobileNo = "" + mobileNo;
  const user = await prisma.driver.findUnique({
    where: {
      id: driverMasterId,
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }
  const detail = await prisma.guarantorDetails.findMany({
    where: {
      mobileNo: mobileNo,
    },
  });
  if (detail.length == 0) {
    throw new BadRequestError("details not found");
  }
  res.status(200).send(detail);
};

const getvehicleTypeByID = async (req, res) => {
  try {
    const data = await prisma.vehicleType.findUnique({
      where: {
        id: parseInt(req.params.vehicleTypeId),
      },
    });
    return send(res, "fetched successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const vehicleType = async (req, res) => {
  try {
    const data = await prisma.vehicleType.findMany();
    return send(res, "fetched successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

export { imgUploader, imgUploaderOwner, imgGuarantorInfo, createVehicleDetail, getVehicleDetail, createVehicleOwner, getVehicleOwner, createGuarantorDetail, getGuarantorDetail, vehicleType, getvehicleTypeByID };
