import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";


const getPlan = async (req, res) => {
  try {
    const data = await prisma.planOrderHistory.findMany({
      
    });
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const getByPlanId = async (req, res) => {
  try {
    const data = await prisma.planOrderHistory.findUnique({ where: { id: parseInt(req.params.id) }, select: { planName: true, subPlandata: { subPlandata: true } } });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
//To buy New Plan by Dealer
const buyPlan = async (req, res) => {
  try {
    console.log("req.body", req.body);
    if (req.body.plan_id) {
      const plan_id = parseInt(req.body.plan_id);
    const checkPlanExist = await prisma.plan.findUnique({ where: { id: plan_id } });
    if (checkPlanExist) {
      console.log("******************************requested plan exist");

    const data = await prisma.planOrderHistory.create({ data: req.body });
    return send(res, "created successfully", data);
    }
    return sendError(res, 404, " requested plan not found", {});
  } 
}
  catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};



// to Create New Plan Use this method
const createPlanOrder = async (req, res) => {
  try {
    const data = await prisma.planOrderHistory.create({ data: req.body });

    return send(res, "created successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const putPlan = async (req, res) => {
  try {
    const data = await prisma.planOrderHistory.update({ where: { planID: req.params.planId }, data: req.body });
    return send(res, "put successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const deletePlan = async (req, res) => {
  try {
    const data = await prisma.user.delete({ where: { email: req.params.planId } });
    return send(res, "deleted successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
export { buyPlan, getPlan, createPlanOrder, putPlan, deletePlan, getByPlanId };
