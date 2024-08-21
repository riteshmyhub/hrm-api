import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Project from "../../../../models/project.model";
import Employee from "../../../../models/employee.model";
import { isValidDate } from "../../../../utils/pipes/validation.pipe";
import sendEmail from "../../../../mails/send-email";

export async function getResources(request: Request, response: Response, next: NextFunction) {
   try {
      const resources = await Employee.find({
         "employee_details.company": request?.user?._id,
         "employee_allocation.isAllocate": false,
      });
      response.status(201).json({
         message: "resources fetched successfully",
         data: {
            resources,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}

export async function addAllocation(request: Request, response: Response, next: NextFunction) {
   try {
      const { employeeID, projectID, endDate } = request.body;
      if (!employeeID || !projectID || !endDate) {
         return next(createHttpError.BadRequest("employeeID and projectID and endDate is required!"));
      }
      if (!isValidObjectId(employeeID) || !isValidObjectId(projectID)) {
         return next(createHttpError.BadRequest("Invalid employeeID or projectID"));
      }
      if (!isValidDate(endDate)) {
         return next(createHttpError.BadRequest("Invalid endDate format"));
      }
      if (new Date(endDate).getTime() <= Date.now()) {
         return next(createHttpError.BadRequest("Please provide a future date!"));
      }
      const project = await Project.findOne({
         _id: projectID,
         company: request.user._id,
      });
      if (!project) {
         return next(createHttpError.NotFound("Project not found!"));
      }
      if (!project.release_plan) {
         return next(createHttpError.BadRequest("Not project release plan"));
      }
      if (new Date(endDate).getTime() > project.release_plan.getTime()) {
         return next(createHttpError.BadRequest("End date must be before project release plan"));
      }
      const employee = await Employee.findOne({
         _id: employeeID,
         "employee_details.company": request.user._id,
      });
      if (!employee) {
         return next(createHttpError.NotFound("Employee not found!"));
      }
      if (employee.employee_allocation?.isAllocate) {
         return next(createHttpError.NotFound("Employee is already allocated."));
      }
      if (project.teams.includes(employee._id)) {
         return next(createHttpError.BadRequest("Employee is already on the team"));
      }
      // Add employee in project teams
      project.teams.push(employee._id);
      await project.save();

      // Update employee allocation
      employee.employee_allocation = {
         isAllocate: true,
         project: project?._id,
         start_date: new Date(Date.now()),
         end_date: endDate,
      };
      await employee.save();

      const mail = await sendEmail({
         to: [employee.email],
         from: request.user?.email,
         subject: `${request?.user?.company_details?.company_name} - Project Allocation (${project?.name})`,
         context: {
            props: {
               companyName: request?.user?.company_details?.company_name,
               projectName: project.name,
               employeeName: `${employee.employee_details?.first_name} ${employee.employee_details?.last_name}`,
               startDate: new Date(Date.now()),
               endDate: endDate,
               role: employee.employee_details?.designation,
               year: new Date().getFullYear(),
            },
         },
         templateName: "project-allocation.mail",
      });

      response.status(201).json({
         message: "Allocation added successfully",
         data: {},
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError());
   }
}

export async function deallocation(request: Request, response: Response, next: NextFunction) {
   try {
      const { employeeID, projectID } = request.query;
      if (!employeeID || !projectID) {
         return next(createHttpError.BadRequest("employeeID & projectID required!"));
      }
      if (!isValidObjectId(employeeID) || !isValidObjectId(projectID)) {
         return next(createHttpError.BadRequest("Invalid employeeID or projectID"));
      }
      const project = await Project.findOne({
         _id: projectID,
         company: request.user._id,
      });
      if (!project) {
         return next(createHttpError.NotFound("Project not found!"));
      }
      const employee = await Employee.findOne({
         _id: employeeID,
         "employee_details.company": request.user._id,
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

      response.status(201).json({
         message: "Employee deallocated",
         data: {},
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError());
   }
}
