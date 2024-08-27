import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Project from "../../../../../../models/project.model";

export default async function DeleteSprintController(req: Request, res: Response, next: NextFunction) {
   try {
      const projectID = req.params?.projectID;
      const sprintID = req.body?.sprintID;
      if (!isValidObjectId(sprintID as string) || !isValidObjectId(projectID as string)) {
         return next(createHttpError.BadRequest("invalid sprint or project id!"));
      }
      const project = await Project.findOne({ _id: projectID, company: req.user._id });

      if (!project) {
         return next(createHttpError.NotFound("project not found!"));
      }
      if (!project.sprints.some((ele) => ele._id?.toString() === sprintID?.toString())) {
         return next(createHttpError.NotFound("sprints not found!"));
      }
      const updatedDocs = await Project.findOneAndUpdate(
         { _id: projectID }, //
         { $pull: { sprints: { _id: sprintID } } },
         { new: true }
      );

      res.status(201).json({
         message: "project feature successfully deleted!",
         data: {
            sprints: updatedDocs?.sprints,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError("Internal Server Error"));
   }
}
