import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Project from "../../../../../models/project.model";

export default async function GetSingleProjectController(req: Request, res: Response, next: NextFunction) {
   try {
      if (!isValidObjectId(req.params?.projectID)) {
         return next(createHttpError.BadRequest("Invalid project id"));
      }
      const project = await Project.findOne({ _id: req.params?.projectID, company: req?.user?._id }).populate({
         path: "teams", //
         model: "employee",
         select: "-__v -role -employee_details.skills -isActive",
      });
      if (!project) {
         return next(createHttpError.NotFound("Project not found"));
      }
      res.status(200).json({
         message: "Single Company project fetch successfully",
         data: {
            project: project,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
