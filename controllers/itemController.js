import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";
const getItem = async (req, res) => {
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
    const data = await prisma.Item.findMany({
      include: {
        battery: true,
        cabinate: true,
        chargers: true,
        harness: true,
        Connector: true,
      },
    });
    return send(res, `fetched successfully`, data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getByIdItem = async (req, res) => {
  try {
    // Returns an object or null
    const data = await prisma.Item.findUnique({
      where: {
        id: parseInt(req.params.Id),
      },
      select: {
        assetId: true,
        id: true,
        assetSubType: true,
        assetClassification: true,
        manufacturer_name: true,
        qr_code_availability: true,
        qr_code_details: true,
        warranty_available: true,
        warranty_time_period: true,
        createdAt: true,
        updatedAt: true,
        battery: {},
        cabinate: {},
        chargers: {},
        harness: {},
        Connector:{},                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
      },
    });
    return send(res, `fetched successfully`, data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const commonCreateDbOperation = async (itemDb, assetDb, itemBody, assetBody) => {
  try {
    console.log("itemBody.assetId");
    console.log(typeof itemBody.assetId);
    console.log("Type conversion", parseInt(itemBody.assetId));
    const assetCheck = await prisma.AssetTypes.findUnique({ where: { id: parseInt(itemBody.assetId) } });
    console.log("assetCheck", assetCheck);
    if (!assetCheck) {
      return { status: false, message: "asset is not available" };
    }
    const ItemData = await itemDb.create({ data: itemBody });
    console.log("Itemdata", ItemData);
    const batteryCopyData = { ...assetBody, itemId: ItemData.id };
    console.log("batteryCopyData", batteryCopyData);

    const assetData = await assetDb.create({ data: batteryCopyData });
    console.log("assetData", assetData);
    // return true;
    return { ItemData, assetData };
  } catch (err) {
    console.error(err);
    return { status: false, message: "db operation failed" };
  }
};

const commonUpdateDbOperation = async (itemDb, assetDb, itemBody, assetBody) => {
  try {
    const updateItemPayload = { ...itemBody };
    const updateAssetPayload = { ...assetBody };
    delete updateAssetPayload.assetId;
    delete updateItemPayload.itemId;
    const updateItemData = await itemDb.update({ where: { id: itemBody.itemId }, data: updateItemPayload });
    console.log("updateItemData", updateItemData);
    const updateAssetData = await assetDb.update({ where: { id: assetBody.assetId }, data: updateAssetPayload });
    console.log("updateAsset", updateAssetData);
    return { updateItemData, updateAssetData };
  } catch (err) {
    console.error(err);
    return { status: false, message: err.message || "db update operation failed" };
  }
};
const postBatteryItem = async (req, res) => {
  try {
    if (req.body.item.itemId && req.body.battery.assetId) {
      if (typeof req.body.item.itemId === "number" && typeof req.body.battery.assetId === "number") {
        const checkUpdateStatus = await commonUpdateDbOperation(prisma.Item, prisma.assetBattery, req.body.item, req.body.battery);
        if (!checkUpdateStatus.status && checkUpdateStatus?.message) {
          return sendError(res, 400, checkUpdateStatus.message, checkUpdateStatus);
        }
        return send(res, "updated successfully", checkUpdateStatus);
      } else {
        return sendError(res, 400, "itemId or assetId shoud be number type", {});
      }
    }
    const checkStatus = await commonCreateDbOperation(prisma.Item, prisma.assetBattery, req.body.item, req.body.battery);
    if (!checkStatus.status && checkStatus?.message) {
      return sendError(res, 400, checkStatus.message, {});
    }
    return send(res, "created successfully", checkStatus);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const postChargerItem = async (req, res) => {
  try {
    if (req.body.item.itemId && req.body.charger.assetId) {
      if (typeof req.body.item.itemId === "number" && typeof req.body.charger.assetId === "number") {
        const checkUpdateStatus = await commonUpdateDbOperation(prisma.Item, prisma.chargers, req.body.item, req.body.charger);
        if (!checkUpdateStatus.status && checkUpdateStatus?.message) {
          return sendError(res, 400, checkUpdateStatus.message, checkUpdateStatus);
        }
        return send(res, "updated successfully", checkUpdateStatus);
      } else {
        return sendError(res, 400, "itemId or assetId shoud be number type", {});
      }
    }

    const checkStatus = await commonCreateDbOperation(prisma.Item, prisma.chargers, req.body.item, req.body.charger);
    if (!checkStatus.status && checkStatus?.message) {
      return sendError(res, 400, checkStatus.message, {});
    }
    return send(res, "created successfully",checkStatus);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const postCabinateItem = async (req, res) => {
  try {
    if (req.body?.item?.itemId && req.body?.cabinate?.assetId) {
      if (typeof req.body.item.itemId === "number" && typeof req.body.cabinate.assetId === "number") {
        const checkUpdateStatus = await commonUpdateDbOperation(prisma.Item, prisma.cabinate, req.body.item, req.body.cabinate);
        if (!checkUpdateStatus.status && checkUpdateStatus?.message) {
          return sendError(res, 400, checkUpdateStatus.message, checkUpdateStatus);
        }
        return send(res, "updated successfully", checkUpdateStatus);
      } else {
        return sendError(res, 400, "itemId or assetId shoud be number type", {});
      }
    }
    const checkStatus = await commonCreateDbOperation(prisma.Item, prisma.cabinate, req.body.item, req.body.cabinate);
    if (!checkStatus.status && checkStatus?.message) {
      return sendError(res, 400, checkStatus.message, {});
    }
    return send(res, "created successfully", checkStatus);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const postHarnessItem = async(req, res) => {
  try {
    if (req.body?.item?.itemId && req.body?.harness?.assetId) {
      if (typeof req.body.item.itemId === "number" && typeof req.body.harness.assetId === "number") {
        const checkUpdateStatus = await commonUpdateDbOperation(prisma.Item, prisma.harness, req.body.item, req.body.harness);
        if (!checkUpdateStatus.status && checkUpdateStatus?.message) {
          return sendError(res, 400, checkUpdateStatus.message, {});
        }
        return send(res, "updated successfully", checkUpdateStatus);
      } else {
        return sendError(res, 400, "itemId or assetId shoud be number type", {});
      }
    }
    const checkStatus = await commonCreateDbOperation(prisma.Item, prisma.harness, req.body.item, req.body.harness);
    if (!checkStatus.status && checkStatus?.message) {
      return sendError(res, 400, checkStatus.message, {});
    }
    return send(res, "created successfully", checkStatus);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const postConnectorItem = async (req, res) => {
  try {
    if (req.body?.item?.itemId && req.body?.connector?.assetId) {
      if (typeof req.body.item.itemId === "number" && typeof req.body.connector.assetId === "number") {
        const checkUpdateStatus = await commonUpdateDbOperation(prisma.Item, prisma.Connector, req.body.item, req.body.connector);
        if (!checkUpdateStatus.status && checkUpdateStatus?.message) {
          return sendError(res, 400, checkUpdateStatus.message, {});
        }
        return send(res, "updated successfully", checkUpdateStatus);
      } else {
        return sendError(res, 400, "itemId or assetId shoud be number type", {});
      }
    }
    const checkStatus = await commonCreateDbOperation(prisma.Item, prisma.Connector, req.body.item, req.body.connector);
    if (!checkStatus.status && checkStatus?.message) {
      return sendError(res, 400, checkStatus.message, checkStatus);
    }
    return send(res, "created successfully", checkStatus);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const deleteItem = async (req, res) => {
  try {
    const deletecharger = prisma.chargers.deleteMany({ where: { itemId: parseInt(req.params.id) } });
    const deleteconnector = prisma.connector.deleteMany({ where: { itemId: parseInt(req.params.id) } });
    const deleteharness = prisma.harness.deleteMany({ where: { itemId: parseInt(req.params.id) } });
    const deleteAssetBattery = prisma.assetBattery.deleteMany({ where: { itemId: parseInt(req.params.id) } });
    const deleteCabinate = prisma.cabinate.deleteMany({ where: { itemId: parseInt(req.params.id) } });

    const deleteItem = prisma.item.delete({ where: { id: parseInt(req.params.id) } });
    const transaction = await prisma.$transaction([deletecharger, deleteconnector, deleteAssetBattery, deleteCabinate, deleteharness, deleteItem]);

    return send(res, "deleted successfully", transaction);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

export { getItem, postBatteryItem, postChargerItem, postCabinateItem, postHarnessItem, postConnectorItem, getByIdItem, deleteItem };

