import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const getsubSubPlan = async (req, res) => {
  try {
    const data = await prisma.subSubPlan.findMany();
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
const postsubSubPlan = async (req, res) => {
  try {
    const data = await prisma.subSubPlan.create({ data: req.body });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};


const putsubSubPlan = async (req, res) => {
  try {
    const data = await prisma.subSubPlan.update({ where: { subSubPlanID: req.params.subSubPlanId }, data: req.body });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
const deletesubSubPlan = async (req, res) => {
  try {
    const data = await prisma.user.delete({ where: { email: req.params.subSubPlanId } });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};


const getPlanByCityIdAndVehicleId = async (req, res) => {
  try {

    const data = await prisma.subSubPlan.findMany(
      {
        where: { city_id: parseInt(req.params.city_id), vehicle_type: parseInt(req.params.vehicle_type) }
        , orderBy: [
          {
            swampsAllowed: 'desc',
          },
          {
            Price: 'asc',
          },
        ]
      });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

export { getsubSubPlan, postsubSubPlan, putsubSubPlan, deletesubSubPlan, getPlanByCityIdAndVehicleId };
