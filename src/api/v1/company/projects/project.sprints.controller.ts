import createHttpError from "http-errors";
import { NextFunction, Request, Response, Router } from "express";
import Project from "../../../../models/project.model";
import { isDocumentId } from "../../../../utils/pipes/validation.pipe";

type Body = Readonly<{
   _id?: string;
   title: string;
   status: "planning" | "running" | "completed";
   started_on: string;
   updated_on: string;
}>;

type StatusType = Readonly<{
   planning: "planning";
   running: "running";
   completed: "completed";
}>;
export async function addCompanySprints(req: Request, res: Response, next: NextFunction) {
   try {
      const { _id, title, status, updated_on, started_on }: Body = req.body;

      const projectId = req.params?.id;
      if (!isDocumentId(projectId)) {
         return next(createHttpError.BadRequest("Invalid project id!"));
      }
      if (!title || !status || !updated_on || !started_on) {
         return next(createHttpError.BadRequest(`title, status, updated_on, started_on required!`));
      }
      const statusType: StatusType = {
         planning: "planning",
         running: "running",
         completed: "completed",
      };
      if (!statusType[status]) {
         return next(createHttpError.BadRequest("invalid status!"));
      }
      const project = await Project.findOne({ _id: projectId, company: req.user._id });

      if (!project) {
         return next(createHttpError.NotFound("project not found!"));
      }

      let ProjectDB = null;
      const payload = { _id, title, status, updated_on, started_on };
      if (_id) {
         if (!isDocumentId(_id as string)) {
            return next(createHttpError.BadRequest("invalid sprint id!"));
         }

         ProjectDB = await Project.findOneAndUpdate(
            { _id: projectId, "sprints._id": _id }, // Find document by projectId and feature _id
            { $set: { "sprints.$": payload } }, // Update the matching feature with the new body
            { new: true }
         );
      } else {
         if (project?.sprints.some((sprint: any) => sprint?.title === title)) {
            return next(createHttpError.BadRequest("sprint already exists!"));
         }
         ProjectDB = await Project.findOneAndUpdate(
            { _id: projectId }, //
            { $push: { sprints: payload } },
            { new: true }
         );
      }
      res.status(201).json({
         message: "project sprint successfully created",
         data: {
            project: ProjectDB,
         },
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError("Internal Server Error"));
   }
}

export async function deleteCompanySprints(req: Request, res: Response, next: NextFunction) {
   try {
      const projectId = req.params?.id;
      const sprintID = req.body?.sprintID;
      if (!isDocumentId(sprintID as string) || !isDocumentId(projectId as string)) {
         return next(createHttpError.BadRequest("invalid sprint or project id!"));
      }
      const project = await Project.findOne({ _id: projectId, company: req.user._id });

      if (!project) {
         return next(createHttpError.NotFound("project not found!"));
      }
      if (!project.sprints.some((ele) => ele._id?.toString() === sprintID?.toString())) {
         return next(createHttpError.NotFound("sprints not found!"));
      }
      const updatedDocs = await Project.findOneAndUpdate(
         { _id: projectId }, //
         { $pull: { sprints: { _id: sprintID } } },
         { new: true }
      );

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
