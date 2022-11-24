import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";

const postMapping = async (req, res) => {
  const
  {
    State_Id, 
    State_Name, 
    City_Id, 
    City_Name, 
    Cluster_Id, 
    Cluster_Name, 
    Zone_Id, 
    Zone_Name, 
    Is_Delete
  } = req.body;
  try {
    const data = await prisma.Mapping.create({ 
      data: 
        {
          State_Id: State_Id,
          State_Name: State_Name,
          City_Id: City_Id,
          City_Name: City_Name,
          Cluster_Id: Cluster_Id,
          Cluster_Name: Cluster_Name,
          Zone_Id: Zone_Id,
          Zone_Name: Zone_Name,
          Is_Delete: Is_Delete,
        }
    });
    return send(res, "Mapping Added successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "Something went wrong", {});
  }
};

const getMappingByState = async (req, res) => {
  
  const dId = req.params.State_Name;
  const res1 = await prisma.$queryRaw(
    Prisma.sql`select * from "Mapping" where "State_Name" = ${dId}`
  )
  res.status(200).json({ message: "OK", statusCode: 200, data: res1});
};

const getMappingByCity = async (req, res) => {
  
  const dId = req.params.City_Name;
  const res1 = await prisma.$queryRaw(
    Prisma.sql`select * from "Mapping" where "City_Name" = ${dId}`
  )
  res.status(200).json({ message: "OK", statusCode: 200, data: res1});
};

const getMappingByCluster = async (req, res) => {
  
  const dId = req.params.City_Name;
  const res1 = await prisma.$queryRaw(
    Prisma.sql`select * from "Mapping" where "Cluster_Name" = ${dId}`
  )
  res.status(200).json({ message: "OK", statusCode: 200, data: res1});
};

// const updateCluster = async (req, res) => {
//   try {
//     const data = await prisma.Mapping.update({ where: 
//       {
//        City_Name: req.params.City_Name 
//       } ,data: req.body 
//     });
//     return send(res, "put successfully", data);
//   } catch (err) {
//     console.log(err);
//     return sendError(res, 500, err.message || "something went wrong", {});
//   }
// };

const updateCluster = async (req, res) => {
const {
  Cluster_Id, Cluster_Name
} = req.body;
const Mapping = await prisma.Mapping.update({
  where:{
     City_Name: "City_Name",
  },
    data:{
      Cluster_Id: Cluster_Id,
      Cluster_Name: Cluster_Name
  },
})
res.status(statusCode.ok).json({"updated Data":Mapping,data})
}

// const updateCluster = async (req, res) => {

//   const {
//    Cluster_Id,
//    Cluster_Name
//   } = req.body;

//   if (!State_Name) {
//     throw new BadRequestError("Please provide the id");
//   }
//   // const updateAll = await prisma.Mapping.findFirst({
//   //   where: {
//   //     State_Name,
//   //   },
//   // });
//   if (State_Name) {
//     const updateAll = await prisma.Mapping.update({
//       where: {
//         State_Name
//       },
//       data: {
//           Cluster_Id: Cluster_Id,
//           Cluster_Name: Cluster_Name
//       },
//     });
//     res.status(StatusCodes.OK).send(updateAll);
//   }
// };

const getMappingByZone = async (req, res) => {
  
  const dId = req.params.Zone_Name;
  const res1 = await prisma.$queryRaw(
    Prisma.sql`select * from "Mapping" where "Zone_Name" = ${dId}`
  )
  res.status(200).json({ message: "OK", statusCode: 200, data: res1});
};

const postZone = async (req, res) => {
  const{
    Zone_Id,
    Zone_Name
  } = req.body;
  try {
    //Prisma.sql('SELECT * FROM Mapping WHERE City_Name = ""');
    const data = await prisma.Mapping.create({ 
    data: 
      {
      Zone_Id: Zone_Id,
      Zone_Name: Zone_Name
      }
    });
    return send(res, "Zone Added successfully", data);
    } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "Something went wrong", {});
  }
};

const getByMappingId = async (req, res) => {
  try {
    const data = await prisma.Mapping.findFirst({
      where: { id: parseInt(req.params.id) },
    });
    res.status(200).json({ message: "OK", data });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

const putMapping = async (req, res) => {
  try {
    const data = await prisma.Mapping.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
    return send(res, "Put successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const deleteMapping = async (req, res) => {
  try {
    const data = await prisma.Mapping.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
    return send(res, "Delete request accepted successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

//GET & POST CITY BY STATE ID FROM THE USER

const postCityByState = async (req, res) => {
  const{
        name,     
        state_id,   
        is_active,
        is_deleted 
    } = req.body;
  try {
    const data = await prisma.planCityMaster.create({ 
    data: 
      {
      name: name,
      state_id: state_id,
      is_active: is_active,
      is_deleted: is_deleted
      }
    });
    return send(res, "City Added successfully", data);
    } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "Something went wrong", {});
  }
};

const getCityByState = async (req, res) => {
  try {
    const data = await prisma.planCityMaster.findMany({
      where: {
        state_id: parseInt(req.params.id)},
    
    });
    res.status(200).json({ message:"These are all cities", data});
  } 
  catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

//GET & POST CLUSTER BY City ID FROM THE USER

const postClusterByCity = async (req, res) => {
  const{
    name, 
    city_id, 
    is_active, 
    is_deleted
  } = req.body;
  try {
    const data = await prisma.clusterMaster.create({ 
    data: 
      {
      name: name,
      city_id: city_id,
      is_active: is_active,
      is_deleted: is_deleted
      }
    });
    return send(res, "Cluster Added successfully", data);
    } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "Something went wrong", {});
  }
};


const getClusterByCity = async (req, res) => {
  try {
    const data = await prisma.clusterMaster.findMany({
      where: {
        city_id: parseInt(req.params.id)},
    
    });
    res.status(200).json({ message:"These are all Clusters", data});
  } 
  catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

//GET ZONE BY CLUSTER ID FROM THE USER

const postZoneByCluster = async (req, res) => {
  const{
    name, 
    cluster_id, 
    is_active, 
    is_deleted,
    updated_at
  } = req.body;
  try {
    const data = await prisma.zone.create({ 
    data: 
      {
      name: name,
      cluster_id: cluster_id,
      is_active: is_active,
      is_deleted: is_deleted,
      updated_at: updated_at
      }
    });
    return send(res, "Zone Added successfully", data);
    } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "Something went wrong", {});
  }
};

const getZoneByCluster = async (req, res) => {
  try {
    const data = await prisma.zone.findMany({
      where: {
        cluster_id: parseInt(req.params.id)},
    
    });
    res.status(200).json({ message:"These are all cities", data});
  } 
  catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

export 
{
   postMapping,
   deleteMapping,
   getMappingByState,
   getMappingByCity,
   getMappingByCluster,
   getMappingByZone,
   getByMappingId,
   updateCluster,
   postZone,
   putMapping,
   postCityByState,
   getCityByState,
   postClusterByCity,
   getClusterByCity,
   postZoneByCluster,
   getZoneByCluster
};
