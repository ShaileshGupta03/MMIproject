import { PrismaClient } from "@prisma/client";
import { request } from "http";
const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";
//get data
const getTagging = async (req, res) => {
  try {
    const data = await prisma.Tagging.findMany({});
    return send(res, "fetched successfully", data); 
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getTaggingById = async (req, res) => {
  try {
    const data = await prisma.Tagging.findFirst({
      where: { Id: parseInt(req.params.Id) },
    });
    return send(res, "fetched successfully", data); 
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const postTagging = async (req, res) => {
  try {
    const data = await prisma.Tagging.create({
      data: {
        Tag_Name: req.body.Tag_Name,
        Tag_Type: req.body.Tag_Type,
        Is_Active: req.body.Is_Active,
        Is_Delete: req.body.Is_Delete,
        Created_by: req.body.Created_by,
        Updated_by: req.body.Updated_by,
        Created_at: req.body.Created_at,
        Updated_at: (req.body.Updated_at = null),
      },
    });
    console.log(data);
    return send(res, "created successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

//delete data
const deleteTagging = async (req, res) => {
  try {
    const data = await prisma.Tagging.delete({
      where: { Id: parseInt(req.params.Id) },
    });
    return send(res, "deleted successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
//update data
const updateTagging = async (req, res) => {
  try {
    const data = await prisma.Tagging.findMany({
      where: { Asset_ID: parseInt(req.params.Asset_ID) },
      data: req.body,
    });
    return send(res, "put successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
export { getTagging,getTaggingById, postTagging, deleteTagging, updateTagging };
