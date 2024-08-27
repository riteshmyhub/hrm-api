import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId, Types } from "mongoose";
import Employee from "../../../../../../models/employee.model";
import Project from "../../../../../../models/project.model";
import Story from "../../../../../../models/story.model";
import { mongooseSchemaError } from "../../../../../../utils/pipes/validation.pipe";

export default async function CreateStoryContoller(req: Request, res: Response, next: NextFunction) {
   try {
      const projectID = req.params?.projectID;
      const { title, priority, type, description, employeeID, featureID, sprintID, _id } = req.body;

      if (!isValidObjectId(projectID)) {
         return next(createHttpError.BadRequest("invalid projectID"));
      }
      if (!isValidObjectId(employeeID)) {
         return next(createHttpError.BadRequest("invalid employeeID"));
      }
      if (!isValidObjectId(featureID)) {
         return next(createHttpError.BadRequest("invalid featureID"));
      }
      if (!isValidObjectId(sprintID)) {
         return next(createHttpError.BadRequest("invalid sprintID"));
      }
      const employee = await Employee.findOne({ _id: employeeID, "employee_details.company": req.user._id });
      if (!employee) {
         return next(createHttpError.NotFound("employee not found!"));
      }
      const project = await Project.findOne({ _id: projectID, company: req.user._id });
      if (!project) {
         return next(createHttpError.NotFound("project not found!"));
      }
      let feature = project?.features.find((e) => e?._id?.toString() === featureID?.toString());
      let sprint = project?.sprints.find((e) => e?._id?.toString() === sprintID?.toString());
      if (!feature) {
         return next(createHttpError.NotFound("feature not found!"));
      }
      if (!sprint) {
         return next(createHttpError.NotFound("sprint not found!"));
      }
      const story = await Story.findOne({
         title,
         company: req?.user?._id,
         project: project?._id,
         assignedTo: employee?._id,
      });

      if (!_id) {
         if (story) {
            return next(createHttpError.BadRequest("duplicate story title!"));
         }
         await Story.create({
            company: req?.user?._id,
            project: project?._id,
            assignedTo: employee?._id,
            feature: feature?._id,
            sprint: sprint?._id,
            type: type,
            title: title,
            priority: priority,
            description: description,
         });
         return res.status(201).json({
            message: "story successfully created",
            data: {},
            success: true,
         });
      }
      if (!isValidObjectId(_id)) {
         return next(createHttpError.BadRequest("Invalid story id!"));
      }
      const stroy = await Story.findById(_id);
      if (!stroy) {
         return next(createHttpError.NotFound("story not found!"));
      }
      stroy.assignedTo = employee?._id;
      stroy.feature = feature?._id as Types.ObjectId;
      stroy.sprint = sprint?._id as Types.ObjectId;
      stroy.type = type;
      stroy.title = title;
      stroy.priority = priority;
      stroy.description = description;

      await stroy.save();
      res.status(201).json({
         message: "story successfully updated",
         data: {},
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
