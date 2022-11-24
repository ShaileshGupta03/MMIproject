import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const getsubPlan = async (req, res) => {
  try {
    const data = await prisma.subPlan.findMany();
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
const postsubPlan = async (req, res) => {
  try {
    const data = await prisma.subPlan.create({ data: req.body });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
const putsubPlan = async (req, res) => {
  try {
    const data = await prisma.subPlan.update({ where: { subPlanID: req.params.subPlanId }, data: req.body });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
const deletesubPlan = async (req, res) => {
  try {
    const data = await prisma.user.delete({ where: { email: req.params.subPlanId } });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
export { getsubPlan, postsubPlan, putsubPlan, deletesubPlan };
