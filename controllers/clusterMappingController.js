import { PrismaClient, Prisma } from "@prisma/client";
import { toolresults_v1beta3 } from "googleapis";
import { Strategy } from "passport-local";
const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";

const getMapping = async (req, res) => {
  try {
    const data = await prisma.planStateMaster.findMany({
      select: {
        stateName: true,
        planCityMaster: {
          select: {
            cityName: true,
            clusterMaster: {
              select: {
                clusterName: true,
                zone: {
                  select: {
                    zoneName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    res.status(200).json({ message: "These are all Mapping", data });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getMappingById = async (req, res) => {
  const { clusterId } = req.body;
  try {
    const data = await prisma.planCountryMaster.findUnique({
      where: {
        id: parseInt(req.params.id),
        //stateName: true,
      },
      // include: {
      //   connect: { id: req.params.id },
      //   //stateName: true,
      //   planStateMaster: {
      select: {
        countryName: true,

        planStateMaster: {
          select: {
            stateName: true,
          },
        },

        planCityMaster: {
          select: {
            cityName: true,
          },
        },
        clusterMaster: {
          select: {
            clusterName: true,
          },
        },
        zone: {
          select: {
            mappingId: true,
            zoneName: true,
          },
        },
      },
    });
    console.log(data, "data");
    res.status(200).json({ message: "These are all Mapping", data: [data] });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const postCountry = async (req, res) => {
  const { countryName, is_active, is_deleted, updated_at } = req.body;
  //console.log(req.body,"body-data")
  try {
    const data = await prisma.planCountryMaster.create({
      data: {
        countryName: countryName,
        is_active: is_active,
        is_deleted: is_deleted,
        updated_at: updated_at,
      },
    });
    return send(res, "Country Added successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "Something went wrong", {});
  }
};

const postState = async (req, res) => {
  const { id, mappingId, stateName, is_active, is_deleted } = req.body;
  try {
    const data = await prisma.planStateMaster.create({
      data: {
        id: id,
        mappingId: mappingId,
        stateName: stateName,
        is_active: is_active,
        is_deleted: is_deleted,
      },
    });
    return send(res, "State Added successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "Something went wrong", {});
  }
};

const getState = async (req, res) => {
  try {
    const data = await prisma.planStateMaster.findMany({
      // where: {
      //   Is_Delete: false
      // },
    });
    res.status(200).json({ message: "These are all states", data });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateState = async (req, res) => {
  const { stateName: stateName } = req.body;
  const planStateMaster = await prisma.planStateMaster.update({
    data: {
      stateName: stateName,
      include: {
        planeCityMaster: true,
      },
    },
  });

  res.status(statusCode.ok).json({ "updated Data": Mapping, data });
};

const deleteState = async (req, res) => {
  try {
    const data = await prisma.planStateMaster.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        is_deleted: true,
      },
    });
    return send(res, "Delete request accepted successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

//GET & POST CITY BY STATE ID FROM THE

const postCityByState = async (req, res) => {
  const { cityName, mappingId, is_active, is_deleted } = req.body;
  try {
    const data = await prisma.planCityMaster.create({
      data: {
        cityName: cityName,
        mappingId: mappingId,
        is_active: is_active,
        is_deleted: is_deleted,
      },
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
        mappingId: parseInt(req.params.id),
      },
    });
    res.status(200).json({ message: "These are all cities", data });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateCity = async (req, res) => {
  const { cityName: cityName } = req.body;
  const planCityMaster = await prisma.planCityMaster.update({
    data: {
      cityName: cityName,
      include: {
        clusterMaster: true,
      },
    },
  });

  res.status(statusCode.ok).json({ "updated Data": Mapping, data });
};

const deleteCity = async (req, res) => {
  try {
    const data = await prisma.planCityMaster.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        is_deleted: true,
      },
    });
    return send(res, "Delete request accepted successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

//GET & POST CLUSTER BY City ID FROM THE USER

const postClusterByCity = async (req, res) => {
  const { clusterName, mappingId, is_active, is_deleted, updated_at } = req.body;
  try {
    const data = await prisma.clusterMaster.create({
      data: {
        clusterName: clusterName,
        mappingId: mappingId,
        is_active: is_active,
        is_deleted: is_deleted,
        updated_at: updated_at,
      },
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
    });
    res.status(200).json({ message: "These are all Clusters", data });
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateCluster = async (req, res) => {
  try {
    const data = await prisma.clusterMaster.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
    return send(res, "put successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const deleteCluster = async (req, res) => {
  try {
    const data = await prisma.clusterMaster.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        is_deleted: true,
      },
    });
    return send(res, "Data Deleted successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

//GET ZONE BY CLUSTER ID FROM THE USER

const postZoneByCluster = async (req, res) => {
  const {  zoneName, mappingId, is_active, is_deleted, updated_at } = req.body;
  try {
    const data = await prisma.zone.create({
      data: {
        zoneName: zoneName,
        mappingId: mappingId,
        is_active: is_active,
        is_deleted: is_deleted,
        updated_at: updated_at,
      },
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
      select: {   
        id: true,                                               //Reverse mapping
        zoneName: true,
        clusterMaster: {
          select: {
            clusterName: true,
            planCityMaster: {
              select: {
                cityName: true,
                planStateMaster: {
                  select: {
                    stateName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    let response = []
    
    for (var i =0 ; i < data.length-1;i++ ){
        response.push({
            zoneName:data[i].zoneName,
            id:data[i].id,
            clusterName:data[i].clusterMaster.clusterName.toString(),
            cityName:data[i].clusterMaster.planCityMaster.cityName,
            stateName:data[i].clusterMaster.planCityMaster.planStateMaster.stateName
        })
    }
    console.log(response,"responseData")
    res.status(200).json({ message: "These are all Listing", response });
  } catch (err) {
    console.log(err);
  }
};

const getZoneById = async (req, res) => {
  try {
    const data = await prisma.zone.findFirst({
      where: {
        id:parseInt(req.params.id)
      },
      select: {   
        id: true,                                               //Reverse mapping
        zoneName: true,
        clusterMaster: {
          select: {
            clusterName: true,
            planCityMaster: {
              select: {
                cityName: true,
                planStateMaster: {
                  select: {
                    stateName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    let response = []
    
    for (var i =0 ; i < data.length-1;i++ ){
        response.push({
            zoneName:data[i].zoneName,
            id:data[i].id,
            clusterName:data[i].clusterMaster.clusterName.toString(),
            cityName:data[i].clusterMaster.planCityMaster.cityName,
            stateName:data[i].clusterMaster.planCityMaster.planStateMaster.stateName
        })
    }
    console.log(response,"responseData")
    res.status(200).json({ message: "These are all Listing", response });
  } catch (err) {
    console.log(err);
  }
};

const putMapping = async (req, res) => {
  //updating cluster and zone individually
  console.log("req.body", req.params);
  let data = req.body;
  console.log(data.type, "data.type");
  try {
    if (data.type == "cluster") {
      var newData = req.body.clusterName;
      var updateData = await prisma.clusterMaster.findMany({
        where: {
          id: parseInt(req.params.id),
        },
        select: {
          id: true,
          clusterName: true,
        },
      });
      console.log("Update Data", updateData);
      for (let entry of updateData) {
        entry.clusterName.push(newData);
        await prisma.clusterMaster.update({
          where: {
            id: entry.id,
          },
          data: { clusterName: entry.clusterName },
        });
      }
    } else if (data.type == "zone") {
      var newData = req.body.zoneName;
      // var updateData = await prisma.zone.findMany({
      //   where: {
      //     id: parseInt(req.params.id),
      //   },
      //   // select: {
      //   //   id: true,
      //   //   zoneName: true,
      //   // },
      // });
      // console.log("Update Data", updateData);
      // for (let entry of updateData) {
        //entry.zoneName.push(newData);
      let data =  await prisma.zone.update({
          where: {
            id:parseInt(req.params.id)
          },
          data: {
            zoneName:newData 
          },
        });
      // }
    } else if (data.type == "planCityName") {
        var newData = req.body.cityName;
        let data =  await prisma.planCityMaster.update({
          where: {
            id:parseInt(req.params.id)
          },
          data: {
            cityName:newData 
          },
        });
      } else if (data.type == "planStateName") {
        var newData = req.body.stateName;
        let data =  await prisma.planStateMaster.update({
          where: {
            id:parseInt(req.params.id)
          },
          data: {
            stateName:newData 
          },
        });
      }
    console.log(data,"data")
    return send(res, "updated successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const deleteZone = async (req, res) => {
  try {
    const data = await prisma.zone.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        is_deleted: true,
      },
    });
    return send(res, "Delete request accepted successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

export {
  getMapping,
  getMappingById,
  postCountry,
  postState,
  getState,
  deleteState,
  updateState,
  postCityByState,
  getCityByState,
  updateCity,
  deleteCity,
  postClusterByCity,
  //postCluster,
  getClusterByCity,
  updateCluster,
  deleteCluster,
  postZoneByCluster,
  getZoneByCluster,
  getZoneById,
  deleteZone,
  putMapping,
};
