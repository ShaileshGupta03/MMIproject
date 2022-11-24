import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { send, sendError } from "../utils/sendFormat.js";

const getassetType = async (req, res) => {
  try {
    const data = await prisma.AssetTypes.findMany();
    return send(res, "fetched successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const postassetType = async (req, res) => {
  try {
    const data = await prisma.AssetTypes.create({ data: req.body });
    return send(res, "created successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const deleteassetType = async (req, res) => {
  try {
    const data = await prisma.AssetTypes.delete({ where: { email: req.params.assetTypeId } });
    return send(res, "deleted successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

export { getassetType, postassetType, deleteassetType };
