import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";


const getPlan = async (req, res) => {
  try {
    const data = await prisma.Plan.findMany({
      /*include: {
        planServiceTypeMasterdata:true,
        planSwapTypeMasterdata:true,
        planServiceTypeMasterdata:true,
        VehicleTypedata:true,
        AssetTypesdata:true,
       /* subPlandata: {
          include: {
            subSubPlandata: true,
          },
        }, 
      },*/
    });
    return send(res, "fetched successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const getByPlanId = async (req, res) => {
  try {
    const data = await prisma.Plan.findUnique({ where: { id: parseInt(req.params.id) },
     select: { planName: true, subPlandata: { subPlandata: true } } });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

// to Create New Plan Use this method
const postPlan = async (req, res) => {
  try {
    const data = await prisma.Plan.create({ data: req.body });
    return send(res, "created successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const putPlan = async (req, res) => {
  try {
    const data = await prisma.Plan.update({ 
      where: { planID: req.params.planId },
       data: req.body });
    return send(res, "put successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const deletePlan = async (req, res) => {
  try {
    const data = await prisma.user.delete({ where: { email: req.params.planId } });
    return send(res, "deleted successfully", data);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
export { getPlan, postPlan, putPlan, deletePlan, getByPlanId };
