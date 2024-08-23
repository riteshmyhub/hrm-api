import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Story from "../../../../../models/story.model";

export default async function GetStoriesController(req: Request, res: Response, next: NextFunction) {
   try {
      const stories = await Story.find({
         assignedTo: req?.user._id,
         company: req?.user?.employee_allocation?.project?.company,
      });
      res.status(200).json({
         message: "stories fetched successfully",
         data: { stories },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
