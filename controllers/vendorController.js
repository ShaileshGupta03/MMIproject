import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { send, sendError } from "../utils/sendFormat.js";

const getVendor = async (req, res) => {
  try {
    if (req.query?.search) {
      // All posts that contain the word 'cat'.
      //       phone_number           String
      // team                   String
      // transporter            Boolean
      // vendor_name            String
      // city_name              String
      // search_name            String
      // address                String
      // address2               String
      // balance_lcy            String
      // postal_code            String
      // purchase_code          String
      // country_code           String
      // responsibility_center  String
      const result = await prisma.vendorGeneral.findMany({
        where: {
          OR: [
            {
              vendor_name: {
                search: req.query.search,
              },
            },
            {
              phone_number: {
                search: req.query.search,
              },
            },
            {
              city_name: {
                search: req.query.search,
              },
            },
            {
              search_name: {
                search: req.query.search,
              },
            },
          ],
        },
        include: {
          invoicing: true,
          communication: true,
          receiving: true,
          foreignTrade: true,
          taxInformation: true,
        },
      });
      return send(res, `fetched successfully111`, result);
    }
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
    const data = await prisma.vendorGeneral.findMany({
      include: {
        invoicing: true,
        communication: true,
        receiving: true,
        foreignTrade: true,
        taxInformation: true,
      },
    });
    return send(res, `fetched successfully`, data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const getByIdVendor = async (req, res) => {
  try {
    // Returns an object or null
    //   createdAt DateTime? @default(now())
    // updatedAt DateTime? @updatedAt
    const data = await prisma.vendorGeneral.findUnique({
      where: {
        id: parseInt(req.params.Id),
      },
      select: {
        id: true,
        contact_person_name: true,
        createdAt: true,
        updatedAt: true,
        primary_contact_number: true,
        phone_number: true,
        team: true,
        transporter: true,
        vendor_name: true,
        city_name: true,
        search_name: true,
        address: true,
        address2: true,
        balance_lcy: true,
        postal_code: true,
        purchase_code: true,
        country_code: true,
        responsibility_center: true,
        state_code: true,
        blocked: true,
        invoicing: {},
        communication: {},
        receiving: {},
        foreignTrade: {},
        taxInformation: {},
      },
    });
    return send(res, `fetched successfully`, data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const postGeneral = async (req, res) => {
  try {
    console.log("req.body", req.body);
    if (req.body.vendorId) {
      const vendorId = parseInt(req.body.vendorId);
      const checkVendorExist = await prisma.vendorGeneral.findUnique({ where: { id: vendorId } });
      if (checkVendorExist) {
        delete req.body.vendorId;
        console.log("after delteting the vndeorid check the body", req.body);
        const updateData = await prisma.vendorGeneral.update({ where: { id: vendorId }, data: req.body });

        return send(res, `updated successfully`, updateData);
      }
      return sendError(res, 404, "not found", {});
    }

    const data = await prisma.vendorGeneral.create({ data: req.body });
    return send(res, `created successfully`, data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const postCommunication = async (req, res) => {
  try {
    console.log("req.body", req.body);
    if (req.body.id) {
      const communicationId = parseInt(req.body.id);
      const checkCommunicationExist = await prisma.vendorCommunication.findUnique({ where: { id: communicationId } });
      if (checkCommunicationExist) {
        delete req.body.id;
        console.log("after delteting the vndeorid check the body", req.body);
        const updateData = await prisma.vendorCommunication.update({ where: { id: communicationId }, data: req.body });
        return send(res, `updated successfully`, updateData);
      }
      return sendError(res, 404, "not found", {});
    }
    const data = await prisma.vendorCommunication.create({ data: req.body });
    return send(res, `created successfully`, data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const postInvoicing = async (req, res) => {
  try {
    console.log("req.body", req.body);
    if (req.body.id) {
      const Id = parseInt(req.body.id);
      const checkCommunicationExist = await prisma.vendorInvoicing.findUnique({ where: { id: Id } });
      if (checkCommunicationExist) {
        delete req.body.id;
        console.log("after delteting the vndeorid check the body", req.body);
        const updateData = await prisma.vendorInvoicing.update({ where: { id: Id }, data: req.body });
        return send(res, `updated successfully`, updateData);
      }
      return sendError(res, 404, "not found", {});
    }
    const data = await prisma.vendorInvoicing.create({ data: req.body });
    return send(res, `created successfully`, data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const postReceiving = async (req, res) => {
  try {
    console.log("req.body", req.body);
    if (req.body.id) {
      const Id = parseInt(req.body.id);
      const checkCommunicationExist = await prisma.vendorReceiving.findUnique({ where: { id: Id } });
      if (checkCommunicationExist) {
        delete req.body.id;
        console.log("after delteting the vndeorid check the body", req.body);
        const updateData = await prisma.vendorReceiving.update({ where: { id: Id }, data: req.body });
        return send(res, `updated successfully`, updateData);
      }
      return sendError(res, 404, "not found", {});
    }
    const data = await prisma.vendorReceiving.create({ data: req.body });
    return send(res, `created successfully`, data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
// ForeignTrade;
const postForeignTrade = async (req, res) => {
  try {
    console.log("req.body", req.body);
    if (req.body.id) {
      const Id = parseInt(req.body.id);
      const checkCommunicationExist = await prisma.foreignTrade.findUnique({ where: { id: Id } });
      if (checkCommunicationExist) {
        delete req.body.id;
        console.log("after delteting the vndeorid check the body", req.body);
        const updateData = await prisma.foreignTrade.update({ where: { id: Id }, data: req.body });
        return send(res, `updated successfully`, updateData);
      }
      return sendError(res, 404, "not found", {});
    }
    const data = await prisma.foreignTrade.create({ data: req.body });
    return send(res, `created successfully`, data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const postTaxInformation = async (req, res) => {
  try {
    console.log("req.body", req.body);
    if (req.body.id) {
      const Id = parseInt(req.body.id);
      const checkCommunicationExist = await prisma.TaxInformation.findUnique({ where: { id: Id } });
      if (checkCommunicationExist) {
        delete req.body.id;
        console.log("after delteting the vndeorid check the body", req.body);
        const updateData = await prisma.TaxInformation.update({ where: { id: Id }, data: req.body });
        return send(res, `updated successfully`, updateData);
      }
      return sendError(res, 404, "not found", {});
    }
    const data = await prisma.TaxInformation.create({ data: req.body });
    return send(res, `created successfully`, data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

export { getVendor, postGeneral, postCommunication, postInvoicing, postReceiving, postForeignTrade, postTaxInformation, getByIdVendor };

