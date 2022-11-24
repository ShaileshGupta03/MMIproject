import path from "path";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { registerDash } from "../utils/logger/index.js";
import fetch from "node-fetch";
import multer from "multer";
import { NotFoundError, BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import axios from "axios";
import { send, sendError } from "../utils/sendFormat.js";

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/documentName");
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const imgUploadDocument = multer({ storage: imageStorage }).single("Path");

const currentAddres = async (req, res) => {
  const fetchData = async () => {
    // console.log(req.body);
    try {
      const response = await axios({
        method: "post",
        url: "https://outpost.mapmyindia.com/api/security/oauth/token",
        data: {
          grant_type: "client_credentials",
          client_secret: "lrFxI-iSEg8QI16SDWIwTd_-INO4GzBx1TPj2bOPi2ye443z-bXtUSVrJQ5ZOzst279jUhv-WfBquu9CeKl-yTgJcUfMaTb2",
          client_id: "33OkryzDZsJaXWvFyHkQ2luIdgsoRaGsrwQuUpcZI4hvSvuv7f0KtCsJ2-YjT8B4lA3_0k5GsshAtwsZr71QyA==",
        },
        headers: {
          "Content-Type": `multipart/form-data`,
        },
      });
      // console.log("@@@@@@@token@@@@@@@@@", response.data);
      // { access_token: 'fba829b5-3c6d-4b65-beee-df825d6e9cf1',
      // token_type: 'bearer',
      // expires_in: 80262,
      // scope: 'READ',
      // project_code: 'prj1647934828i1733359296',
      // client_id: '33OkryzDZsJaXWvFyHkQ2luIdgsoRaGsrwQuUpcZI4hvSvuv7f0KtCsJ2-YjT8B4lA3_0k5GsshAtwsZr71QyA=='}
      if (response.data?.access_token) {
        const response1 = await axios({
          method: "get",
          // url: `https://explore.mappls.com/apis/O2O/entity/226010`,
          url: `https://explore.mappls.com/apis/O2O/entity/${req.body.currentPinCode}`,

          method: "get",
          // url: `https://explore.mappls.com/apis/O2O/entity/226010`,
          url: `https://explore.mappls.com/apis/O2O/entity/${req.body.currentPinCode}`,

          headers: {
            Authorization: `bearer ${response.data?.access_token}`,
          },
        });
        const add = response1.data;
        return add;
      }
    } catch (err) {
      console.error(err);
      console.log("#########err", err);
    }
  };
  const add = await fetchData();
  console.log(add, "Address");
  const address = await add.address;
  const myArray = await address.split(",");
  const city = await myArray[0];
  const state = await myArray[1];
  // console.log(city);
  // console.log(state);
  const { currentPinCode, cureentLineHouseNo, currentAria, currentCity, currentState, sameAscurrentaddress, permanentLineHouseNo, permanentPinCode, permanentAria, permanentCity, permanentState, driverMasterId } = req.body;
  if (!currentPinCode) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }
  const cityid = await prisma.planCityMaster.findFirst({
    where: {
      city_name: city,
    },
    select: {
      city_id: true,

    },
  });
  console.log(cityid, "cityId");
  const cityId = await prisma.$queryRaw(
    Prisma.sql`update "Driver" set city_id = (select city_id from "planCityMaster" where "city_name"= ${city}) where "driverID" =${driverMasterId};  `
  )
  console.log(cityId, "cityId");
  try {
    const User = await prisma.currentAddres.upsert({
      where: {
        driverMasterId: driverMasterId,
      },
      update: {
        cureentLineHouseNo: cureentLineHouseNo,
        currentAria: currentAria,
        currentPinCode: currentPinCode,
        currentCity: city,
        currentState: state,
        sameAscurrentaddress: JSON.parse(sameAscurrentaddress),
        permanentLineHouseNo: permanentLineHouseNo,
        permanentAria: permanentAria,
        permanentPinCode: permanentPinCode,
        permanentCity: permanentCity,
        permanentState: permanentState,
        driverMasterId: driverMasterId,
      },
      create: {
        cureentLineHouseNo: cureentLineHouseNo,
        currentAria: currentAria,
        currentPinCode: currentPinCode,
        currentCity: city,
        currentState: state,
        sameAscurrentaddress: JSON.parse(sameAscurrentaddress),
        permanentLineHouseNo: permanentLineHouseNo,
        permanentAria: permanentAria,
        permanentPinCode: permanentPinCode,
        permanentCity: permanentCity,
        permanentState: permanentState,
        driverMasterId: driverMasterId,
      },
    });
    res.status(200).json({ message: "OK", User });
    console.log(User);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the driver",
    });
  }
};

const document = async (req, res) => {
  const { driverMasterId, driverPhoto, currentAddressProf, driverLicence, driverLicencePic, AadharCaredPic, panCard, voterId, voterIdPic } = req.body;
  console.log("document req is", driverMasterId, driverPhoto, currentAddressProf, driverLicence, driverLicencePic, AadharCaredPic, panCard, voterId, voterIdPic)
  if (!driverMasterId) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }
 



  try {
    // const User = await prisma.document.upsert({
    //   where: {
    //     driverMasterId: driverMasterId,
    //   },
    //   update: {
    //     driverPhoto: driverPhoto,
    //     currentAddressProf: currentAddressProf,
    //     driverLicence: driverLicence,
    //     driverLicencePic: driverLicencePic,
    //     AadharCaredPic: AadharCaredPic,
    //     panCard: panCard,
    //     voterId: voterId,
    //     voterIdPic: voterIdPic,
    //     driverMasterId: driverMasterId,
    //   },
    //   create: {
    //     driverPhoto: driverPhoto,
    //     currentAddressProf: currentAddressProf,
    //     driverLicence: driverLicence,
    //     driverLicencePic: driverLicencePic,
    //     AadharCaredPic: AadharCaredPic,
    //     panCard: panCard,
    //     voterId: voterId,
    //     voterIdPic: voterIdPic,
    //     driverMasterId: driverMasterId,
    //   },
    // });

    const findDriverPicId = await prisma.documentMaster.findFirst({ where: { document_name: 'driverPhoto' } })
    console.log(findDriverPicId,"result")
    console.log(driverMasterId,"driverMasterId")

    const findCurrentAddressId = await prisma.documentMaster.findFirst({ where: { document_name: 'currentAddressProof' } })
    const findDriverLisenceId = await prisma.documentMaster.findFirst({ where: { document_name: 'lisencePhoto' } })
    const findAadharId = await prisma.documentMaster.findFirst({ where: { document_name: 'driverAadharPhoto' } })
    const findVoterId = await prisma.documentMaster.findFirst({ where: { document_name: 'driverVoterPhoto' } })
    console.log("DOCUMENT ID ARE", findAadharId.id, findCurrentAddressId.id, findDriverLisenceId.id, findVoterId.id, findDriverPicId.id)

    const findDriverId = await prisma.driver.findFirst({
      where: {
        driverID: driverMasterId
      }
    })
    const driver_id=req.body.driver_id;
if (driver_id ==driverMasterId){
  retuer.status(400).json({ message:"User already exists" });
}
    console.log("driver id is", findDriverId.id, findCurrentAddressId.id)
    const deleteDriverPicId = await prisma.documentVerification.updateMany({
      where: { driver_id: findDriverId.id, document_id: findDriverPicId.id },
      data: { is_deleted: true }
    })
    const deleteCurrentAddressId = await prisma.documentVerification.updateMany({
      where: { driver_id: findDriverId.id, document_id: findCurrentAddressId.id },
      data: { is_deleted: true }
    })
    const deleteDriverLisenceId = await prisma.documentVerification.updateMany({
      where: { driver_id: findDriverId.id, document_id: findDriverLisenceId.id },
      data: { is_deleted: true }
    })

    const deleteAadharId = await prisma.documentVerification.updateMany({
      where: { driver_id: findDriverId.id, document_id: findAadharId.id },
      data: { is_deleted: true }
    })

    const deleteVoterId = await prisma.documentVerification.updateMany({
      where: { driver_id: findDriverId.id, document_id: findVoterId.id },
      data: { is_deleted: true }
    })
    const updateDocumentVerifiyTable = await prisma.documentVerification.createMany(
      {
        data:
          [
            { document_id: findDriverPicId.id, driver_id: findDriverId.id, document_file: driverPhoto },
            { document_id: findCurrentAddressId.id, driver_id: findDriverId.id, document_file: currentAddressProf },
            { document_id: findDriverLisenceId.id, driver_id: findDriverId.id, document_file: driverLicencePic },
            { document_id: findAadharId.id, driver_id: findDriverId.id, document_file: AadharCaredPic },
            { document_id: findVoterId.id, driver_id: findDriverId.id, document_file: voterIdPic }
          ]
      }
    )
    res.status(200).json({ message: "OK" });
    // console.log(User);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the driver",
    });
  }
};

const documentTable = async (req, res) => {
  // let myString = req.body;
  //   let boolOutput = myString.toLowerCase() == 'true' ? true : false;
  //   console.log(boolOutput);
  const { DriverId } = req.body;
  if (!DriverId) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }

  let data = {
    Document_Name: req.body.Document_Name,
    Path: req.file.path,
    Document_Text: req.file.mimetype,
    // Status:true,
    Status: JSON.parse(req.body.Status),
    Approved_By: req.body.Approved_By,
    DriverId: req.body.DriverId,
  };

  try {
    const User = await prisma.document_table.create({ data });
    res.status(200).json({ message: "OK", User });
    console.log(User);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the document table",
    });
  }
};



const updateDocumentVerification = async (req, res) => {
  try {
    const data = await prisma.InventoryManagement.update({
      where: { id: parseInt(req.params.id) },

    })
    return send(res, "Successfully Updated", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};


// const documentVerification = async (req, res) => {
// }
const persnoalDetails = async (req, res) => {
  const { driverMasterId, age, maritalStatus, residence, occupationAsDriver, approxMonthlyIncome, otherMonthlyLiab, workingYears, numberOfMember, numberOfEarning, smartPhoneOwner, bankAccount, bankName, noOfChildren, childrenMale, childrenFemale, childrenOther } = req.body;
  if (!driverMasterId) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }
  try {
    const User = await prisma.persnoalDetails.upsert({
      where: {
        driverMasterId: driverMasterId,
      },
      update: {
        age: age,
        maritalStatus: maritalStatus,
        residence: residence,
        occupationAsDriver: occupationAsDriver,
        approxMonthlyIncome: approxMonthlyIncome,
        otherMonthlyLiab: otherMonthlyLiab,
        workingYears: workingYears,
        numberOfMember: numberOfMember,
        numberOfEarning: numberOfEarning,
        smartPhoneOwner: smartPhoneOwner,
        bankAccount: bankAccount,
        bankName: bankName,
        noOfChildren: noOfChildren,
        childrenMale: childrenMale,
        childrenFemale: childrenFemale,
        childrenOther: childrenOther,
        driverMasterId: driverMasterId,
      },
      create: {
        age: age,
        maritalStatus: maritalStatus,
        residence: residence,
        occupationAsDriver: occupationAsDriver,
        approxMonthlyIncome: approxMonthlyIncome,
        otherMonthlyLiab: otherMonthlyLiab,
        workingYears: workingYears,
        numberOfMember: numberOfMember,
        numberOfEarning: numberOfEarning,
        smartPhoneOwner: smartPhoneOwner,
        bankAccount: bankAccount,
        bankName: bankName,
        noOfChildren: noOfChildren,
        childrenMale: childrenMale,
        childrenFemale: childrenFemale,
        childrenOther: childrenOther,
        driverMasterId: driverMasterId,
      },
    });
    res.status(200).json({ message: "OK", User });
    console.log(User);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the driver",
    });
  }
};

// const bankName = async (req, res) => {};
const bankName = async (req, res) => {
  try {
    const data = await prisma.bankName.findMany();
    return send(res, "fetched successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const tagingMaster = async (req, res) => {
  const { driverId, noRooming, rooming_with_charges, multiswap, B2B, B2C, driverCode } = req.body;
  if (!driverId) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }
  try {
    console.log("before update ", driverId)
    const findDriver = await prisma.driver.findFirst({
      where: {
        driverID: driverId
      }
    })
    console.log("driver data is", findDriver)
    const UpdatedQRCodeDriverId = await prisma.driver.update({
      where: {
        id: findDriver.id
      },
      data: {
        driverID: driverCode,
        driverOldId: driverCode
      }
    })
    // console.log("after update")
    // const updateDocumentByDriver = await prisma.documentVerification.updateMany({
    //   where: {
    //     driver_id: driverId
    //   },
    //   data: {
    //     driver_id: driverCode
    //   }
    // })

    // const updateOrderByDriverId = await prisma.orders.update({
    //   where: {
    //     driver_id: driverId
    //   },
    //   data: {
    //     driver_id: driverCode
    //   }
    // })

    // console.log("NEW DRIVER ORDER", updateOrderByDriverId)

    const User = await prisma.tagingMaster.upsert({
      where: {
        driverId: driverCode,
      },
      update: {
        noRooming: JSON.parse(noRooming),
        TagValue: "",
        rooming_with_charges: JSON.parse(rooming_with_charges),
        multiswap: JSON.parse(multiswap),
        B2B: JSON.parse(B2B),
        B2C: JSON.parse(B2C),
        driverId: driverCode,
      },
      create: {
        noRooming: JSON.parse(noRooming),
        TagValue: "",
        rooming_with_charges: JSON.parse(rooming_with_charges),
        multiswap: JSON.parse(multiswap),
        B2B: JSON.parse(B2B),
        B2C: JSON.parse(B2C),
        driverId: driverCode,
      },
    });
    res.status(200).json({ message: "OK", User });
    console.log(User);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating the driver",
    });
  }
};

export { currentAddres, document, documentTable, imgUploadDocument, persnoalDetails, bankName, tagingMaster };
