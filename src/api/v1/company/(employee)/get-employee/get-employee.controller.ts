import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Employee from "../../../../../models/employee.model";

export default async function GetEmployeeController(req: Request, res: Response, next: NextFunction) {
   try {
      const _id = req.params?.id;
      if (!_id) {
         return next(createHttpError.BadRequest("_id is param required"));
      }
      if (!isValidObjectId(_id)) {
         return next(createHttpError.BadRequest("_id is invalid"));
      }
      const employee = await Employee.findOne({ _id, "employee_details.company": req?.user?._id }).populate([
         {
            path: "employee_details.company", //
            model: "company",
            select: "-__v -role -isActive",
         },
         {
            path: "employee_allocation.project", //
            model: "project",
            select: "-__v",
         },
      ]);

      if (!employee) {
         return next(createHttpError.NotFound("Employee not found!"));
      }
      res.status(200).json({
         message: `${employee.email} employee successfully fetched!`,
         data: { employee },
         success: true,
      });
   } catch (error: any) {
      console.log(error);

      next(createHttpError.InternalServerError(error));
   }
}
