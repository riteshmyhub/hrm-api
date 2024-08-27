import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Project from "../../../../../models/project.model";
import { slugPipe } from "../../../../../utils/pipes/string.pipe";
import { bucket } from "../../../../../libs/libs";

export default async function UpdateProjectController(req: Request, res: Response, next: NextFunction) {
   try {
      if (!isValidObjectId(req.params?.projectID)) {
         return next(createHttpError.BadRequest("Invalid project id"));
      }
      const project = await Project.findOne({ _id: req.params?.projectID, company: req?.user?._id });
      if (!project) {
         return next(createHttpError.NotFound("Project not found"));
      }
      if (!Object.keys(req.body)?.length) {
         return next(createHttpError.BadRequest("No data payload"));
      }

      if (req.body.name) {
         project.name = req.body.name;
         project.slug = slugPipe(req.body.name);
      }
      if (req.body.image) {
         const fileRes = await bucket.uploadFile({
            file: req.body.image,
            options: {
               folder: "projects",
               overwrite: true,
               public_id: project?._id.toString(),
            },
         });
         project.image = fileRes.url;
      }
      if (req.body.description) project.description = req.body.description;
      if (req.body.platform) project.platform = req.body.platform;
      if (req.body.platform) project.release_plan = req.body.release_plan;
      if (req.body["technology[]"]) project.technologies = req.body["technology[]"];

      await project.save();
      res.status(200).json({
         message: "Project update successfully",
         data: { project },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
