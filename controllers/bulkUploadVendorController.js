
import fs from "fs";
import csv from "fast-csv";
import { PrismaClient } from "@prisma/client";
import { send, sendError } from "../utils/sendFormat.js";
// import { send, sendError } from "../utils/sendFormat.js";
const prisma = new PrismaClient();
import path from "path";
//
const postbulkVendorGet = async (req, res) => {
  try {
    const data = await prisma.InventoryByDealer.findMany();
    return send(res, "fetched successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const postbulkVendor = async (req, res) => {
  try {
    //  const user = await prisma.inventoryManagement.findUnique({
    //    where: {
    //     Item_ID: req.user.Item_ID,
    //    },
    //  });
    //   if (!user) {
    //    throw new BadRequestError("user not found");
    //   }
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }
    // var newData;
    let csvData = [];
    let path = "file" + "/uploads/" + req.file.filename;
    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        //  newData = row
        //  return newData
        //console.log(newData)
        csvData.push(row);
        // return row
        // res.status(200).json(row)
      })

      .on("end", async () => {
        console.log(csvData);

        for (let i = 0; i < csvData.length; i++) {
          let asset_id = csvData[i].asset_id;
          let Dealer_Id = csvData[i].Dealer_Id;
          let vendor_name = csvData[i].vendor_name;
          let in_out = csvData[i].in_out;
          // let transaction_date=csvData[i].transaction_date;
          let assetIdAlreadyExist = await prisma.inventoryByDealer.findFirst({
            where: {
              asset_id: asset_id,
            },
          });
          // console.log(assetIdAlreadyExist,"already exists console");
          if (assetIdAlreadyExist) {
            return res.status(400).json({ msg: "Already Exist Data" });
            // console.log("already exists console");
          }
          // else {
          await prisma.inventoryByDealer.create({
            data: {
              asset_id: asset_id,
              Dealer_Id: Dealer_Id,
              vendor_name: vendor_name,
              in_out: in_out,
              // transaction_date: transaction_date,
            },
          });
          // }
        }
        return res.status(200).send({ message: "OK CSV_Uploade" });
      });
    // res.status(200).send({ msg: "CsvUploded" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

export { postbulkVendor, postbulkVendorGet };

