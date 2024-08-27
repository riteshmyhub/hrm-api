import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Employee from "../../../../../../models/employee.model";
import Project from "../../../../../../models/project.model";

export default async function DeallocateMemberController(req: Request, res: Response, next: NextFunction) {
   try {
      const { projectID, employeeID } = req.params;
      if (!employeeID || !projectID) {
         return next(createHttpError.BadRequest("employeeID & projectID required!"));
      }
      if (!isValidObjectId(employeeID) || !isValidObjectId(projectID)) {
         return next(createHttpError.BadRequest("Invalid employeeID or projectID"));
      }
      const project = await Project.findOne({
         _id: projectID,
         company: req.user._id,
      });
      if (!project) {
         return next(createHttpError.NotFound("Project not found!"));
      }
      const employee = await Employee.findOne({
         _id: employeeID,
         "employee_details.company": req.user._id,
      });
      if (!employee) {
         return next(createHttpError.NotFound("Employee not found!"));
      }
      if (!employee.employee_allocation?.isAllocate) {
         return next(createHttpError.BadRequest("Employee is already deallocated"));
      }
      // Add employee in project teams
      project.teams = project.teams.filter((id) => id.toString() !== employeeID);
      await project.save();
      // Update employee allocation
      employee.employee_allocation = {
         isAllocate: false,
         project: undefined,
         start_date: undefined,
         end_date: undefined,
      };
      await employee.save();

      res.status(201).json({
         message: "Employee deallocated",
         data: {},
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError());
   }
}
