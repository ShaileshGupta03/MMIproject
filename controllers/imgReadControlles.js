import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";
// const baseUrl = "http://localhost:4000/files/";
const baseUrl = "https://batteryuat.elitemindz.tech/files/";



// import {uploadFile} from  "../middleware/uploadfile.js";

const upload = async (req, res) => {
  
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};
const getListFiles = (req, res) => {
  const directoryPath = "./download/";
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
    res.status(200).send(fileInfos);
  });
};
const downloadFile = (req, res) => {
  console.log("hhheheh");
  const fileName = req.params.name;
  const directoryPath = "./download/";
  console.log(directoryPath)
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};
export { upload, getListFiles, downloadFile };
