import fs from "fs";
import csv from "fast-csv";
import { PrismaClient } from "@prisma/client";
import { send, sendError } from "../utils/sendFormat.js";
const prisma = new PrismaClient();
// import path from "path";

const uploadCsv = async (req, res) => {
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
    var newData;
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
          let dealer_id = csvData[i].dealer_id;
          let vendor_name=csvData[i].vendor_name;
          let in_out = csvData[i].in_out;
          let transaction_date=csvData[i].transaction_date;
          const assetIdAlreadyExist = await prisma.InventoryByDealer.findUnique({
            where: {
              asset_id:asset_id,
            },
          });
          if (assetIdAlreadyExist) {
            console.log("**********************")
            console.log("already exit console");
          
     return res.status(400).send(" Data in CSV already exist in the system");
          
          } 
          
          else {
            await prisma.InventoryByDealer.create({
              data: {
                asset_id: asset_id,
                dealer_id: dealer_id,
                vendor_name: vendor_name,
                in_out: in_out,
                transaction_date: transaction_date,
                   },
            });
            res.status(200).send({ msg: "CsvUploded" });
          }
        }
      });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};



export { uploadCsv};
