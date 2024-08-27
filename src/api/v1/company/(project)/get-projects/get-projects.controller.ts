import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Project from "../../../../../models/project.model";

export default async function GetProjectsController(req: Request, res: Response, next: NextFunction) {
   try {
      const projects = await Project.find({ company: req?.user?._id });
      res.status(200).json({
         message: "Company projects fetch  successfully",
         data: {
            projects,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
