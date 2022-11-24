import { PrismaClient } from "@prisma/client";
import path from "path";
import multer from "multer";
const prisma = new PrismaClient();
import { send, sendError } from "../utils/sendFormat.js";


const postDoucment = async (req, res) => {
    try {
      const data = await prisma.Document1.create({ data: req.body });
      return send(res, "created successfully", data);
    } catch (err) {
      console.log(err);
      return sendError(res, 500, err.message || "something went wrong", {});
    }
  };

  export {postDoucment}