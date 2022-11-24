import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

import { send, sendError } from "../utils/sendFormat.js";

const getInventory = async (req, res) => {
  try {
    const data = await prisma.inventoryManagement.findMany({});
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const patchInventoryInOut = async (req, res) => {
  try {
    const data = await prisma.inventoryManagement.update({
      where: { Asset_ID: parseInt(req.params.Asset_ID) },
      data: { Quantity: req.body.Quantity },
    });
    console.log(data, "DATA");
    return send(res, "Successfully Updated", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getByInventoryId = async (req, res) => {
  try {
    const data = await prisma.inventoryManagement.findFirst({
      where: { Asset_ID: parseInt(req.params.Asset_ID) },
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};



//ennore this route present time
const putAssetIdInventory = async (req, res) => {
  try {
    const data = await prisma.inventoryManagement.update({
      where: { Asset_ID: parseInt(req.params.Asset_ID) },
      data: req.body,
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};



// export { getInventory, patchInventory, getByInventoryId, putAssetIdInventory, getByItemInventory,patchInventoryInOut};

const getInventoryByDealer = async (req, res) => {
  try {
    const data = await prisma.inventoryManagement.findFirst({
      where: { Item_ID: parseInt(req.params.Item_ID) },
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const getByDealerId = async (req, res) => {
  const dId = req.params.Dealer_Id;
  console.log("dId", dId);
  const res1 = await prisma.$queryRaw(Prisma.sql`select * from "InventoryByDealer" where "Dealer_Id" = ${dId}`);
  console.log(res1, "res1");
  res.status(200).json({ message: "OK", statusCode: 200, res1 });
};

const getvehicleSchemesbyIdVehicle = async (req, res) => {
  const dId = parseInt(req.params.vehicleTypeid);
  console.log("dId", dId);
  const res1 = await prisma.$queryRaw(Prisma.sql`select * from "schemesMaster" where "vehicleTypeid" = ${dId}`);
  console.log(res1, "res1");
  res.status(200).json({ message: "OK", statusCode: 200, res1 });
};

export { getvehicleSchemesbyIdVehicle, getByDealerId, getInventory, getByInventoryId, putAssetIdInventory };
