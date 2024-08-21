import createHttpError from "http-errors";
import { NextFunction, Request, Response, Router } from "express";
import Story from "../../../../../models/story.model";
import { isValidObjectId } from "mongoose";
import { mongooseSchemaError } from "../../../../../utils/pipes/validation.pipe";

export default class StoryController {
   get routes() {
      const storiesRoutes = Router();
      storiesRoutes.get("/", this.getStories);
      storiesRoutes.post("/status", this.changeStoryStatus);
      return storiesRoutes;
   }

   private getStories = async (req: Request, res: Response, next: NextFunction) => {
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
   };

   private changeStoryStatus = async (req: Request, res: Response, next: NextFunction) => {
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
            return next(createHttpError.BadRequest(`story in ${story.status}`));
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
   };
}
