import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Project from "../../../../../models/project.model";
import { bucket } from "../../../../../libs/libs";

export default async function DeleteProjectController(req: Request, res: Response, next: NextFunction) {
   try {
      if (!isValidObjectId(req.params?.projectID)) {
         return next(createHttpError.BadRequest("Invalid project id"));
      }
      const project = await Project.findOneAndDelete({ _id: req.params?.projectID, company: req?.user?._id });
      if (!project) {
         return next(createHttpError.NotFound("Project not found!"));
      }
      await bucket.deleteFile(req.params?.projectID);
      res.status(200).json({
         message: "project successfully deleted!",
         data: {},
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
