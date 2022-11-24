import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";

const getInventoryManagement = async (req, res) => {
  try {
    const data = await prisma.inventoryManagementTransfer.findMany({
      where: {
        Is_Delete: false
      }
    });
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getByInventoryManagementId = async (req, res) => {
  try {
    // const checkVendorExist = await prisma.vendorGeneral.findUnique({ where: { id: vendorId } });
    const data = await prisma.InventoryManagementTransfer.findFirst({
      where: {Asset_Id:parseInt(req.params.Asset_Id )},
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

const postInventoryManagement = async (req, res) => { 
  const{Asset_Id, Type, TransferTo, Vendor_Id, GRN_E_Way_Bill, Dealer_Id} = req.body;
  console.log(req.body);
  try {
    const data = await prisma.InventoryManagementTransfer.create({ 
      data: 
        {
          Asset_Id: Asset_Id,
          Type: Type,
          TransferTo: TransferTo,
          Vendor_Id: Vendor_Id,
          GRN_E_Way_Bill: GRN_E_Way_Bill,
          Dealer_Id: Dealer_Id
        }
    });
    return send(res, "created successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

// const postInventoryManagement = async (req, res) => {
//   const { Type, TransferTo, Vendor_Id } = req.body;

//   try {
//     const data = await prisma.inventoryManagementTransfer.create({
//       data: {
//         Type: Type,
//         TransferTo: TransferTo,
//         Vendor_Id: Vendor_Id,
//       },
//     });

//     send(res, "created successfully", data);
//   } catch (err) {
//     console.log(err);
//     return sendError(res, 500, err.message || "something went wrong", {});
//   }
// };

const putInventoryManagement = async (req, res) => {
  try {
    const data = await prisma.inventoryManagementTransfer.update({ where: 
      {
       Asset_Id: parseInt(req.params.Asset_Id) 
      }, data: req.body 
    });
    return send(res, "put successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const deleteInventoryManagement = async (req, res) => {
  try {
    const data = await prisma.inventoryManagementTransfer.update({ where: 
      {
       Asset_Id: parseInt(req.params.Asset_Id) 
      }, data: req.body 
    });
    return send(res, "delete request accepted successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

//   const postInventoryManagement = async (req, res) => {
//     try {
//       const data = await prisma.inventoryManagementTransfer.create({ data: req.body });
//       return send(res, "created successfully", data);
//     } catch (err) {
//       console.log(err);
//       return sendError(res, 500, err.message || "something went wrong", {});
//     }
//   };

// const postTransferDealer = async (req, res) => {
//   const{Type, Plant_Dealer, Vendor_Id, GRN_E_Way_Bill, Dealer_ID} = req.body;
//   try {
//     const data = await prisma.InventoryManagementTransfer.create({ data: 
//       {
//         Type: Type,
//         Plant_Dealer: Plant_Dealer,
//         Vendor_Id: Vendor_Id,
//         GRN_E_Way_Bill: GRN_E_Way_Bill,
//         Dealer_ID: Dealer_ID
//       } 
//     });
//     return send(res, "created successfully", data);
//   } catch (err) {
//     console.log(err);
//     return sendError(res, 500, err.message || "something went wrong", {});
//   }
// };

export {
  getInventoryManagement,
  getByInventoryManagementId,
  postInventoryManagement,
  putInventoryManagement,
  deleteInventoryManagement

};
