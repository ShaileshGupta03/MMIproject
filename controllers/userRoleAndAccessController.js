import { PrismaClient, Prisma } from "@prisma/client";
import { request } from "http";
const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";

const getApplicationType = async (req, res) => {
  try {
    const data = await prisma.applicationType.findMany({
      include: {
        userType: true,
        RoleMaster: true,
      },
    });
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const deleteByIdAllTable = async (req, res) => {
  try {
    const deleteuserType = prisma.userType.deleteMany({ where: { application_type_id: parseInt(req.params.id) } });
    const deleteRoleMaster = prisma.RoleMaster.deleteMany({ where: { application_type_id: parseInt(req.params.id) } });
    const deleteSegment = prisma.segmentMaster.deleteMany({ where: { application_type_id: parseInt(req.params.id) } });
    const deleteServiceSegment = prisma.serviceSegmentMaster.deleteMany({ where: { application_type_id: parseInt(req.params.id) } });
    const deleteRoleModuleMapping = prisma.roleModuleMapping.deleteMany({ where: { application_type_id: parseInt(req.params.id) } });
    const deleteByIdAllTable = prisma.applicationType.deleteMany({ where: { id: parseInt(req.params.id) } });

    const transaction = await prisma.$transaction([deleteuserType, deleteRoleMaster, deleteSegment, deleteServiceSegment, deleteRoleModuleMapping, deleteByIdAllTable]);
    return send(res, "deleted successfully", transaction);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateApplication = async (req, res) => {
  try {
    const updateApplication = prisma.applicationType.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: req.body.name,
      },
    });

    const updateUser = prisma.userType.updateMany({
      where: {
        application_type_id: parseInt(req.params.id),
      },
      data: {
        user_name: req.body.user_name,
      },
    });

    const updateRoleMaster = prisma.RoleMaster.updateMany({
      where: {
        application_type_id: parseInt(req.params.id),
      },
      data: {
        group_name: req.body.group_name,
      },
    });

    const transaction = await prisma.$transaction([updateApplication, updateUser, updateRoleMaster]);
    return send(res, "updated successfully", transaction);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

// const getApplicationTypeByName = async (req, res) => {
//   try {
//     const dId = req.body.name;
//     if (!dId) {
//       return res.status(404).send({ msg: "data not found" });
//     } else {
//       console.log(dId);
//       const res1 = await prisma.$queryRaw(Prisma.sql`SELECT  "applicationType".name,"userType".user_name from "applicationType","userType" where "applicationType".id="userType".application_type_id and "applicationType".name=${dId}`);

//       console.log(res1);
//       res.status(200).json({ message: "fetched successfully", statusCode: 200, data: res1 });
//     }
//   } catch (err) {
//     return sendError(res, 500, err.message || "something went wrong", {});
//   }
// };

const getApplicationTypeByName = async (req, res) => {
  try {
    const name = req.body.name;
    const result = await prisma.$queryRaw(Prisma.sql`SELECT  "applicationType".name,"userType".user_name from "applicationType","userType" where "applicationType".id="userType".application_type_id and "applicationType".name=${name}`);

    const selectRoleModuleData = await prisma.roleModuleMapping.findMany({
      where: { application_type_id: req.body.id },
    });

    const data = [];

    const getModuleMappingInfoArr = [];
    var moduleOriginalNameObj = {};
    result.forEach((getObj) => {
      data.push({ name: getObj.name, user_name: getObj.user_name, moduleName: moduleOriginalNameObj });

      selectRoleModuleData.forEach((getObj) => {
        const getModuleMappingInfo = { read: getObj.read, write: getObj.write, delete: getObj.delete, access: getObj.access };
        moduleOriginalNameObj[getObj.moduleName] = getModuleMappingInfo;
        // getModuleMappingInfoArr.push({moduleOriginalName: getModuleMappingInfo});
        moduleOriginalNameObj[getObj.moduleName] = getModuleMappingInfo;
        getModuleMappingInfoArr.push(moduleOriginalNameObj);
      });
      //  data.push({ moduleName: moduleOriginalNameObj });
    });

    // data.push({ moduleName: moduleOriginalNameObj });
    console.log(data);
    return res.send({ msg: "fetched successfully", data });
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getUserType = async (req, res) => {
  try {
    const data = await prisma.userType.findMany({});
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getSegmentMaster = async (req, res) => {
  try {
    const data = await prisma.SegmentMaster.findMany({});
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getApplicableServiceSegment = async (req, res) => {
  try {
    const data = await prisma.ServiceSegmentMaster.findMany({});
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const getRoleSegmentMapping = async (req, res) => {
  try {
    const data = await prisma.RoleSegmentMapping.findMany({});
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getRoleModuleMapping = async (req, res) => {
  try {
    const result = await prisma.$queryRaw(
      Prisma.sql`select "applicationType".id,"applicationType".name,"applicationType".created_at,"userType".user_name,"RoleMaster"."group_name","SegmentMaster"."segment_name","ServiceSegmentMaster".service_segment_name from 
          "userType" LEFT JOIN  "applicationType" ON  "applicationType".id = "userType".application_type_id LEFT JOIN "RoleMaster" ON "RoleMaster".application_type_id = "applicationType".id LEFT JOIN  "SegmentMaster" ON "SegmentMaster".application_type_id = "applicationType".id LEFT JOIN "ServiceSegmentMaster" ON "ServiceSegmentMaster".application_type_id = "applicationType".id LEFT JOIN "RoleModuleMapping" ON "RoleModuleMapping".id = "userType".id
          ;`
    );

    console.log(result, "result");
    const selectRoleModuleData = await prisma.RoleModuleMapping.findMany({});
    const selectRoleModule = await prisma.applicationType.findMany({
      select: {
        id: true,
        // name:true
      },
    });
    console.log(selectRoleModule, "selectRoleModule");

    //console.log(selectRoleModuleData);

    const data = [];

    const getModuleMappingInfoArr = [];
    var moduleOriginalNameObj = {};

    //   const getUserInfoArr = {
    //        id:selectRoleModule,

    //  };
    //  data.push(getUserInfoArr);
    result.forEach((getObj) => {
      data.push({ id: getObj.id, name: getObj.name, created_at: getObj.created_at, user_name: getObj.user_name, group_name: getObj.group_name, segment_name: getObj.segment_name, service_segment_name: getObj.service_segment_name, moduleName: moduleOriginalNameObj });
      console.log(getObj, "getObj");

      selectRoleModuleData.forEach((getObj) => {
        const getModuleMappingInfo = { read: getObj.read, write: getObj.write, delete: getObj.delete };
        moduleOriginalNameObj[getObj.moduleName] = getModuleMappingInfo;
        getModuleMappingInfoArr.push({ moduleOriginalName: getModuleMappingInfo });
        //  moduleOriginalNameObj[getObj.moduleName] = getModuleMappingInfo;
        getModuleMappingInfoArr.push(moduleOriginalNameObj);
        //data.push({ moduleName: moduleOriginalNameObj });
      });
    });
    //  data.push({ moduleName: moduleOriginalNameObj });
    //console.log(data);

    return res.send({ msg: "fetched successfully", data });
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const getRoleModuleMappingByID = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await prisma.$queryRaw(
      Prisma.sql` SELECT "userType".user_name, "applicationType".id,"applicationType".name,"RoleMaster"."group_name","SegmentMaster"."segment_name","ServiceSegmentMaster".service_segment_name,"RoleModuleMapping".* ,"applicationType".created_at FROM "userType" LEFT JOIN  "applicationType" ON  "applicationType".id = "userType".application_type_id LEFT JOIN "RoleMaster" ON "RoleMaster".application_type_id = "applicationType".id LEFT JOIN  "SegmentMaster" ON "SegmentMaster".application_type_id = "applicationType".id LEFT JOIN "ServiceSegmentMaster" ON "ServiceSegmentMaster".application_type_id = "applicationType".id LEFT JOIN "RoleModuleMapping" ON "RoleModuleMapping".id = "applicationType".id
      where "applicationType".id=${id}
        `
    );

    const selectRoleModuleData = await prisma.roleModuleMapping.findMany({
      where: { application_type_id: id },
    });

    const data = [];

    const getModuleMappingInfoArr = [];
    var moduleOriginalNameObj = {};
    result.forEach((getObj) => {
      data.push({ name: getObj.name, id,created_at:getObj.created_at, user_name: getObj.user_name, group_name: getObj.group_name, segment_name: getObj.segment_name, service_segment_name: getObj.service_segment_name, moduleName: moduleOriginalNameObj });

      selectRoleModuleData.forEach((getObj) => {
        const getModuleMappingInfo = { read: getObj.read, write: getObj.write, delete: getObj.delete, access: getObj.access };
        moduleOriginalNameObj[getObj.moduleName] = getModuleMappingInfo;
        // getModuleMappingInfoArr.push({moduleOriginalName: getModuleMappingInfo});
        moduleOriginalNameObj[getObj.moduleName] = getModuleMappingInfo;
        getModuleMappingInfoArr.push(moduleOriginalNameObj);
      });
      //  data.push({ moduleName: moduleOriginalNameObj });
    });

    // data.push({ moduleName: moduleOriginalNameObj });
    console.log(data);
    return res.send({ msg: "fetched successfully", data });
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};
const getRoleMaster = async (req, res) => {
  try {
    const data = await prisma.RoleMaster.findMany({
      // include: {
      //   RoleSegmentMapping: true,
      // },
    });
    console.log(data);
    return send(res, "fetched successfully", data);
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const createRole = async (req, res) => {
  try {
    const data = await prisma.RoleMaster.create({
      data: {
        group_name: req.body.group_name,
        application_name: req.body.application_name,
        user_type_name: req.body.user_type_name,
      },
    });

    return send(res, "created successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const deleteRole = async (req, res) => {
  try {
    const data = await prisma.RoleMaster.delete({
      where: { id: parseInt(req.params.id) },
    });
    return send(res, "deleted successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateRole = async (req, res) => {
  try {
    const data = await prisma.RoleMaster.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    return send(res, "updated successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const postAdminData = async (req, res) => {
  const roleModuleBodydata = req.body.moduleName;
  const moduleNameInsertArr = [];
  for (var index in roleModuleBodydata) {
    const moduleDataVal = {
      moduleName: index,
      read: roleModuleBodydata[index].read,
      write: roleModuleBodydata[index].write,
      delete: roleModuleBodydata[index].delete,
    };
    moduleNameInsertArr.push(moduleDataVal);
  }
  try {
    const getData = await prisma.applicationType.create({
      data: {
        name: req.body.name,
        created_at: req.body.created_at,
        userType: { create: { user_name: req.body.user_name } },
        RoleMaster: {
          create: { group_name: req.body.group_name, application_name: req.body.application_name },
        },
        segmentMaster: {
          create: { segment_name: req.body.segment_name },
        },
        serviceSegmentMaster: {
          create: { service_segment_name: req.body.service_segment_name },
        },
        roleModuleMapping: {
          create: moduleNameInsertArr,
        },
      },
      include: {
        roleModuleMapping: true,
        RoleMaster: true,
      },
    });
    const date = new Date();
    const data = [];
    const getUserInfoArr = {
      name: req.body.name,
      user_name: req.body.user_name,
      group_name: req.body.group_name,
      segment_name: req.body.segment_name,
      service_segment_name: req.body.service_segment_name,
      created_at: date,
    };
    data.push(getUserInfoArr);
    const roleModuleMappingArr = getData.roleModuleMapping;
    var moduleOriginalNameObj = {};
    roleModuleMappingArr.forEach((getObj) => {
      const getModuleMappingInfo = { read: getObj.read, write: getObj.write, delete: getObj.delete };
      moduleOriginalNameObj[getObj.moduleName] = getModuleMappingInfo;
    });
    data.push({ moduleName: moduleOriginalNameObj });
    console.log(data);

    return send(res, "create successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateAdmin = async (req, res) => {
  const roleModuleBodydata = req.body.moduleName;
  const moduleNameInsertArr = [];
  for (var index in roleModuleBodydata) {
    const moduleDataVal = {
      moduleName: index,
      read: roleModuleBodydata[index].read,
      write: roleModuleBodydata[index].write,
      delete: roleModuleBodydata[index].delete,
    };
    moduleNameInsertArr.push(moduleDataVal);

    var result = await prisma.$executeRawUnsafe(
      ` update  "RoleModuleMapping" SET "read"='${roleModuleBodydata[index].read}',write='${roleModuleBodydata[index].write}',delete='${roleModuleBodydata[index].delete}'
      where "application_type_id" =${req.params.id} AND "moduleName" ='${index}'
        `
    );
  }
  console.log(moduleNameInsertArr);

  console.log(result, "Result data");

  try {
    const getData = await prisma.applicationType.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: req.body.name,
        userType: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },
            data: {
              user_name: req.body.user_name,
            },
          },
        },

        RoleMaster: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },
            data: {
              group_name: req.body.group_name,
            },
          },
        },
        segmentMaster: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },

            data: {
              segment_name: req.body.segment_name,
            },
          },
        },

        serviceSegmentMaster: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },

            data: {
              service_segment_name: req.body.service_segment_name,
            },
          },
        },
      },
    });

    const data = [];

    const getUserInfoArr = {
      id: req.params.id,
      name: req.body.name,
      user_name: req.body.user_name,
      group_name: req.body.group_name,
      segment_name: req.body.segment_name,
      service_segment_name: req.body.service_segment_name,
      moduleName: roleModuleBodydata,
    };
    data.push(getUserInfoArr);
    return res.send({ msg: "updated successfully", data });
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateDriver = async (req, res) => {
  const roleModuleBodydata = req.body.moduleName;
  const moduleNameInsertArr = [];
  for (var index in roleModuleBodydata) {
    const moduleDataVal = {
      moduleName: index,
      access: roleModuleBodydata[index].access,
    };
    moduleNameInsertArr.push(moduleDataVal);

    var result = await prisma.$executeRawUnsafe(
      ` update  "RoleModuleMapping" SET "access"='${roleModuleBodydata[index].access}'
      where "application_type_id" =${req.params.id} AND "moduleName" ='${index}'
        `
    );
  }
  console.log(moduleNameInsertArr);

  console.log(result, "Result data");

  try {
    const getData = await prisma.applicationType.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: req.body.name,

        userType: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },
            data: {
              user_name: req.body.user_name,
            },
          },
        },

        RoleMaster: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },
            data: {
              group_name: req.body.group_name,
            },
          },
        },
        segmentMaster: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },

            data: {
              segment_name: req.body.segment_name,
            },
          },
        },

        serviceSegmentMaster: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },

            data: {
              service_segment_name: req.body.service_segment_name,
            },
          },
        },
      },
    });

    const data = [];

    const getUserInfoArr = {
      id: req.params.id,
      name: req.body.name,
      user_name: req.body.user_name,
      group_name: req.body.group_name,
      segment_name: req.body.segment_name,
      service_segment_name: req.body.service_segment_name,
      moduleName: roleModuleBodydata,
    };
    data.push(getUserInfoArr);
    return res.send({ msg: "updated successfully", data });
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const updateDealer = async (req, res) => {
  const roleModuleBodydata = req.body.moduleName;
  const moduleNameInsertArr = [];
  for (var index in roleModuleBodydata) {
    const moduleDataVal = {
      moduleName: index,
      access: roleModuleBodydata[index].access,
    };
    moduleNameInsertArr.push(moduleDataVal);

    var result = await prisma.$executeRawUnsafe(
      ` update  "RoleModuleMapping" SET "access"='${roleModuleBodydata[index].access}'
      where "application_type_id" =${req.params.id} AND "moduleName" ='${index}'
        `
    );
  }
  console.log(moduleNameInsertArr);

  console.log(result, "Result data");

  try {
    const getData = await prisma.applicationType.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: req.body.name,

        userType: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },
            data: {
              user_name: req.body.user_name,
            },
          },
        },

        RoleMaster: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },
            data: {
              group_name: req.body.group_name,
            },
          },
        },
        segmentMaster: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },

            data: {
              segment_name: req.body.segment_name,
            },
          },
        },

        serviceSegmentMaster: {
          updateMany: {
            where: {
              application_type_id: parseInt(req.params.id),
            },

            data: {
              service_segment_name: req.body.service_segment_name,
            },
          },
        },
      },
    });

    const data = [];

    const getUserInfoArr = {
      id: req.params.id,
      name: req.body.name,
      user_name: req.body.user_name,
      group_name: req.body.group_name,
      segment_name: req.body.segment_name,
      service_segment_name: req.body.service_segment_name,
      moduleName: roleModuleBodydata,
    };
    data.push(getUserInfoArr);
    return res.send({ msg: "updated successfully", data });
  } catch (err) {
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const postDriverData = async (req, res) => {
  const roleModuleBodydata = req.body.moduleName;
  const moduleNameInsertArr = [];
  for (var index in roleModuleBodydata) {
    console.log(roleModuleBodydata[index].read);
    const moduleDataVal = {
      moduleName: index,
      access: roleModuleBodydata[index].access,
    };
    moduleNameInsertArr.push(moduleDataVal);
  }
  try {
    const getData = await prisma.applicationType.create({
      data: {
        name: req.body.name,
        created_at: req.body.created_at,
        userType: {
          create: {
            user_name: req.body.user_name,
          },
        },
        RoleMaster: {
          create: {
            group_name: req.body.group_name,
          },
        },
        segmentMaster: {
          create: {
            segment_name: req.body.segment_name,
          },
        },
        serviceSegmentMaster: {
          create: {
            service_segment_name: req.body.service_segment_name,
          },
        },

        roleModuleMapping: {
          create: moduleNameInsertArr,
        },
      },
      include: {
        roleModuleMapping: true,
        RoleMaster: true,
      },
    });
    const date = new Date();
    const data = [];
    const getUserInfoArr = {
      name: req.body.name,
      user_name: req.body.user_name,
      group_name: req.body.group_name,
      segment_name: req.body.segment_name,
      service_segment_name: req.body.service_segment_name,
      created_at: date,
    };
    data.push(getUserInfoArr);

    const roleModuleMappingArr = getData.roleModuleMapping;
    var moduleOriginalNameObj = {};
    roleModuleMappingArr.forEach((getObj) => {
      const getModuleMappingInfo = { access: getObj.access };
      moduleOriginalNameObj[getObj.moduleName] = getModuleMappingInfo;
    });
    data.push({ moduleName: moduleOriginalNameObj });
    console.log(data);

    return send(res, "created successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

const postDealerData = async (req, res) => {
  const roleModuleBodydata = req.body.moduleName;
  const moduleNameInsertArr = [];
  for (var index in roleModuleBodydata) {
    console.log(roleModuleBodydata[index].read);
    const moduleDataVal = {
      moduleName: index,
      access: roleModuleBodydata[index].access,
    };
    moduleNameInsertArr.push(moduleDataVal);
  }
  try {
    const getData = await prisma.applicationType.create({
      data: {
        name: req.body.name,
        created_at: req.body.created_at,
        userType: {
          create: {
            user_name: req.body.user_name,
          },
        },
        RoleMaster: {
          create: {
            group_name: req.body.group_name,
          },
        },
        segmentMaster: {
          create: {
            segment_name: req.body.segment_name,
          },
        },
        serviceSegmentMaster: {
          create: {
            service_segment_name: req.body.service_segment_name,
          },
        },

        roleModuleMapping: {
          create: moduleNameInsertArr,
        },
      },
      include: {
        roleModuleMapping: true,
        RoleMaster: true,
      },
    });
    const date = new Date();
    const data = [];
    const getUserInfoArr = {
      name: req.body.name,
      user_name: req.body.user_name,
      group_name: req.body.group_name,
      segment_name: req.body.segment_name,
      service_segment_name: req.body.service_segment_name,
      created_at: date,
    };
    data.push(getUserInfoArr);

    const roleModuleMappingArr = getData.roleModuleMapping;
    var moduleOriginalNameObj = {};
    roleModuleMappingArr.forEach((getObj) => {
      const getModuleMappingInfo = { access: getObj.access };
      moduleOriginalNameObj[getObj.moduleName] = getModuleMappingInfo;
    });
    data.push({ moduleName: moduleOriginalNameObj });
    console.log(data);

    return send(res, "created successfully", data);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, err.message || "something went wrong", {});
  }
};

export {
  getApplicationType,
  deleteByIdAllTable,
  updateApplication,
  getApplicationTypeByName,
  getUserType,
  getSegmentMaster,
  getApplicableServiceSegment,
  getRoleSegmentMapping,
  getRoleModuleMapping,
  getRoleModuleMappingByID,
  getRoleMaster,
  createRole,
  deleteRole,
  updateRole,
  postAdminData,
  postDriverData,
  postDealerData,
  updateAdmin,
  updateDriver,
  updateDealer,
  // updateModuleMapping
};
