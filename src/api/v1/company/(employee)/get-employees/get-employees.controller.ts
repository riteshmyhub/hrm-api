import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Employee from "../../../../../models/employee.model";

export default async function GetEmployeesController(req: Request, res: Response, next: NextFunction) {
   try {
      const employees = await Employee.find({ "employee_details.company": req?.user?._id });
      res.status(200).json({
         message: "Employees successfully fetched!",
         data: {
            employees,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
