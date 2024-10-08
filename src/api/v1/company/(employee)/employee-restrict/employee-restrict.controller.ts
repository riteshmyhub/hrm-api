import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Employee from "../../../../../models/employee.model";
import { isValidObjectId } from "mongoose";

export default async function EmployeeRestrictController(req: Request, res: Response, next: NextFunction) {
   try {
      const body: { isActive: boolean } = req.body;
      const employeeID = req.params?.id;

      if (typeof body.isActive !== "boolean") {
         return next(createHttpError.BadRequest("invalid value or isActive required"));
      }
      if (!isValidObjectId(employeeID)) {
         return next(createHttpError.BadRequest("employeeID is invalid"));
      }
      const employee = await Employee.findOne({
         _id: employeeID,
      });

      if (!employee) {
         return next(createHttpError.NotFound("Employee Not Found"));
      }
      employee.isActive = body.isActive;
      await employee.save();

      res.status(201).json({
         message: `Employee is ${body.isActive ? "activate" : "deactivate"}`,
         data: {},
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
