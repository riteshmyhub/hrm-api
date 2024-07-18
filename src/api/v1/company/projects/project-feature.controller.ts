import httpErrors from "http-errors";
import { NextFunction, Request, Response, Router } from "express";
import Project from "../../../../models/project.model";
import createHttpError from "http-errors";
import { isDocumentId } from "../../../../utils/pipes/validation.pipe";

type Body = {
   _id?: string;
   title: string;
   sprint: string;
   description: string;
   note: string;
};

export async function addCompanyFeature(req: Request, res: Response, next: NextFunction) {
   try {
      const { _id, title, sprint, description, note }: Body = req.body;

      if (!isDocumentId(req.params?.id)) {
         return next(createHttpError.BadRequest("invalid project id!"));
      }
      if (!title || !sprint || !description || !note) {
         return next(createHttpError.BadRequest(`title, sprint, description, note required!`));
      }
      const project = await Project.findOne({ _id: req.params?.id, company: req.user._id });

      if (!project) {
         return next(createHttpError.NotFound("project not found!"));
      }

      let ProjectDB = null;
      const payload = { _id, title, sprint, description, note };
      if (_id) {
         if (!isDocumentId(_id as string)) {
            return next(createHttpError.BadRequest("invalid feature id!"));
         }
         ProjectDB = await Project.findOneAndUpdate(
            { _id: req.params?.id, "features._id": _id }, // Find document by id and feature _id
            { $set: { "features.$": payload } }, // Update the matching feature with the new body
            { new: true }
         );
      } else {
         if (project?.features.some((feature: any) => feature?.title === title)) {
            return next(createHttpError.BadRequest("feature already exists!"));
         }
         ProjectDB = await Project.findOneAndUpdate({ _id: req.params?.id }, { $push: { features: payload } }, { new: true });
      }
      res.status(201).json({
         message: "project feature successfully created",
         data: {
            project: ProjectDB,
         },
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError("Internal Server Error"));
   }
}

export async function deleteCompanyFeature(req: Request, res: Response, next: NextFunction) {
   try {
      const projectId = req.params?.id;
      const featureID = req.body?.featureID;
      if (!isDocumentId(featureID as string) || !isDocumentId(projectId as string)) {
         return next(createHttpError.BadRequest("invalid feature or project id!"));
      }
      const project = await Project.findOne({ _id: projectId, company: req.user._id });

      if (!project) {
         return next(createHttpError.NotFound("project not found!"));
      }
      if (!project.features.some((ele) => ele._id?.toString() === featureID?.toString())) {
         return next(createHttpError.NotFound("feature not found!"));
      }
      const updatedDocs = await Project.findOneAndUpdate({ _id: projectId }, { $pull: { features: { _id: featureID } } }, { new: true });

      res.status(201).json({
         message: "project feature successfully deleted!",
         data: {
            project: updatedDocs,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError("Internal Server Error"));
   }
}
