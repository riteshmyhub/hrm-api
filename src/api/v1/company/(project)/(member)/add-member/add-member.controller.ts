import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Employee from "../../../../../../models/employee.model";
import Project from "../../../../../../models/project.model";
import { isValidDate } from "../../../../../../utils/pipes/validation.pipe";
import sendEmail from "../../../../../../mails/send-email";

export default async function AddMemberController(req: Request, res: Response, next: NextFunction) {
   try {
      const { projectID } = req.params;
      const { endDate, employeeID } = req.body;
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
         company: req?.user._id,
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
         "employee_details.company": req.user._id,
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
         from: req.user?.email,
         subject: `${req?.user?.company_details?.company_name} - Project Allocation (${project?.name})`,
         context: {
            props: {
               companyName: req?.user?.company_details?.company_name,
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

      res.status(201).json({
         message: "Allocation added successfully",
         data: {},
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError());
   }
}
