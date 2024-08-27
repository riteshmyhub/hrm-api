import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Story from "../../../../../../models/story.model";

export default async function UpdateStoryStatusController(req: Request, res: Response, next: NextFunction) {
   try {
      const { status, storyID } = req.body;
      const story = await Story.findOne({ _id: storyID, company: req?.user?._id });
      if (!story) {
         return next(createHttpError.NotFound("story not found!"));
      }
      story.status = status;
      await story.save();
      res.status(200).json({
         message: "story successfully updated",
         data: { test: req?.user },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
