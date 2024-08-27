import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Project from "../../../../../models/project.model";
import { slugPipe } from "../../../../../utils/pipes/string.pipe";

export default async function CreateProjectController(req: Request, res: Response, next: NextFunction) {
   try {
      const { name } = req.body;
      if (!name) {
         return next(createHttpError.BadRequest("name is required"));
      }
      const idDuplicate = await Project.findOne({ name });
      if (idDuplicate) {
         return next(createHttpError.BadRequest("Project name is already taken"));
      }
      const slug = slugPipe(name);
      let project = await Project.create({ name, slug, company: req.user?._id });
      const projects = await Project.find({ company: req?.user?._id });
      res.status(201).json({
         message: "Project successfully created!",
         data: { projects },
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError("Internal Server Error"));
   }
}
