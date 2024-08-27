import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Project from "../../../../../../models/project.model";

export default async function AddFeatureController(req: Request, res: Response, next: NextFunction) {
   try {
      const { _id, title, sprint, description, note } = req.body;
      const projectID = req.params?.projectID;
      if (!isValidObjectId(projectID)) {
         return next(createHttpError.BadRequest("invalid project id!"));
      }
      if (!title || !sprint || !description || !note) {
         return next(createHttpError.BadRequest(`title, sprint, description, note required!`));
      }
      const project = await Project.findOne({ _id: projectID, company: req.user._id });

      if (!project) {
         return next(createHttpError.NotFound("project not found!"));
      }

      let ProjectDB = null;
      const payload = { _id, title, sprint, description, note };
      if (_id) {
         if (!isValidObjectId(_id as string)) {
            return next(createHttpError.BadRequest("invalid feature id!"));
         }
         ProjectDB = await Project.findOneAndUpdate(
            { _id: projectID, "features._id": _id }, // Find document by id and feature _id
            { $set: { "features.$": payload } }, // Update the matching feature with the new body
            { new: true }
         );
      } else {
         if (project?.features.some((feature: any) => feature?.title === title)) {
            return next(createHttpError.BadRequest("feature already exists!"));
         }
         ProjectDB = await Project.findOneAndUpdate({ _id: projectID }, { $push: { features: payload } }, { new: true });
      }
      res.status(201).json({
         message: "project feature successfully created",
         data: {
            features: ProjectDB?.features,
         },
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError("Internal Server Error"));
   }
}
