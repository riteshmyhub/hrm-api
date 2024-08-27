import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Story from "../../../../../../models/story.model";

export default async function GetStoriesController(req: Request, res: Response, next: NextFunction) {
   try {
      const projectID = req.params?.projectID;
      if (!projectID) {
         return next(createHttpError.NotFound("projectID required!"));
      }
      if (!isValidObjectId(projectID)) {
         return next(createHttpError.BadRequest("invalid projectID"));
      }
      const stories = await Story.find({ company: req?.user?._id, project: projectID }).populate([
         {
            path: "assignedTo", //
            model: "employee",
            select: "email _id employee_details.first_name employee_details.last_name employee_details.designation employee_details.avatar",
         },
      ]);
      res.status(200).json({
         message: "story successfully created",
         data: {
            stories,
         },
         success: true,
      });
   } catch (error) {
      console.log(error);
      next(createHttpError.InternalServerError());
   }
}
