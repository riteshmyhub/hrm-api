import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Project from "../../../../../../models/project.model";

export default async function DeleteFeatureController(req: Request, res: Response, next: NextFunction) {
   try {
      const projectID = req.params?.projectID;
      const featureID = req.body?.featureID;
      if (!isValidObjectId(featureID as string) || !isValidObjectId(projectID as string)) {
         return next(createHttpError.BadRequest("invalid feature or project id!"));
      }
      const project = await Project.findOne({ _id: projectID, company: req.user._id });

      if (!project) {
         return next(createHttpError.NotFound("project not found!"));
      }
      if (!project.features.some((ele) => ele._id?.toString() === featureID?.toString())) {
         return next(createHttpError.NotFound("feature not found!"));
      }
      const updatedDocs = await Project.findOneAndUpdate({ _id: projectID }, { $pull: { features: { _id: featureID } } }, { new: true });

      res.status(201).json({
         message: "project feature successfully deleted!",
         data: {
            features: updatedDocs?.features,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError("Internal Server Error"));
   }
}
