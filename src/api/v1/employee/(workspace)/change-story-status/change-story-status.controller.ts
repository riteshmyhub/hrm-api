import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { mongooseSchemaError } from "../../../../../utils/pipes/validation.pipe";
import Story from "../../../../../models/story.model";
import { isValidObjectId } from "mongoose";

export default async function ChangeStoryStatusController(req: Request, res: Response, next: NextFunction) {
   try {
      const { status, storyID } = req.body;
      if (!status || !storyID) {
         return next(createHttpError(400, "status & storyID is required!"));
      }

      if (!isValidObjectId(storyID)) {
         return next(createHttpError(400, "Invalid storyID!"));
      }
      const project = req.user?.employee_allocation?.project?._id;
      const company = req.user?.employee_details?.company?._id;

      const story = await Story.findOne({ project, company, _id: storyID });
      if (!story?.status) {
         return next(createHttpError.BadRequest("No story status"));
      }
      if (["rejected", "delivered", "canceled", "hold"].includes(status)) {
         return next(createHttpError.BadRequest(`${status} status can't process`));
      }
      if (["rejected", "delivered", "canceled", "hold"].includes(story.status)) {
         return next(createHttpError.BadRequest(`story is ${story.status}`));
      }
      story.status = status;
      await story?.save();
      res.status(201).json({
         message: `Story status updated to ${story.status}.`,
         data: { story },
         success: true,
      });
   } catch (error: any) {
      if (error?.name === "ValidationError") {
         const errors = mongooseSchemaError(error);
         return next(createHttpError.BadRequest(errors.toString()));
      }
      next(createHttpError.InternalServerError());
   }
}
