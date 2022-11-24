import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";
import { NotFoundError, BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const createGroupName = async (req, res) => {

  try {
    const data = await prisma.groupName.create({
      data: {
        GroupName: req.body.GroupName,
        groupId: req.body.groupId,
        is_active: req.body.is_active,
        is_deleted: req.body.is_deleted,
        created_by: req.body.created_by,
        updated_by: req.body.updated_by,
        updatedAt: req.body.updatedAt = null,
        status: JSON.parse(req.body.status)
      },
    });
    res.status(200).json({ message: "OK", data });
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating details",
    });
  }
};

const getGroupName = async (req, res) => {
  try {
    const data = await prisma.groupName.findMany();
    return res.status(200).json({ message: "Fechted successfully", data });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateGroupName = async (req, res) => {
  try {
    const Data = await prisma.groupName.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.status(200).json({ message: "Updated successfully", Data });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const deleteGroupName = async (req, res) => {
  try {
    const data = await prisma.groupName.delete({ where: { id: parseInt(req.params.id) } });
    return send(res, "deleted successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const createPaymentType = async (req, res) => {
  try {
    const data = await prisma.paymentType.create({
      data: {
        paymentTypeId: req.body.paymentTypeId,
        paymentOptions: req.body.paymentOptions,
        thresholdLimit_payOnceDay: req.body.thresholdLimit_payOnceDay,
        thresholdLimit_payLater: req.body.thresholdLimit_payLater,
        is_active: req.body.is_active,
        is_deleted: req.body.is_deleted,
        created_by: req.body.created_by,
        updated_by: req.body.updated_by,
        createdDate: req.body.createdDate,
        updatedDate: req.body.updatedDate = null,
        groupId: req.body.groupId,
        groupName: req.body.groupName,
        status: req.body.status
      },
    });

    res.status(200).json({ message: "OK", data });
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Error occurred while creating details",
    });
  }
}



const getAllPaymentType = async (req, res) => {
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
    const data = await prisma.paymentType.findMany();
    return res.status(200).json({ message: "Fechted successfully", data });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getPaymentTypeById = async (req, res) => {
  try {
    const [data] = await prisma.paymentType.findMany({
      where: { id: parseInt(req.params.id) }
    });
    return res.status(200).json({ message: "Fechted successfully", data });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};


const updatePaymentType = async (req, res) => {
  try {
    const Data = await prisma.paymentType.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.status(200).json({ message: "Updated successfully", Data });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
}


const deletePaymentType = async (req, res) => {
  try {
    const data = await prisma.paymentType.delete({ where: { id: parseInt(req.params.id) } });
    return send(res, "deleted successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
}


export { createGroupName, getGroupName, updateGroupName, deleteGroupName, createPaymentType, getAllPaymentType, getPaymentTypeById, updatePaymentType, deletePaymentType };
