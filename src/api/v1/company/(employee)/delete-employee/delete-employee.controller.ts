import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Employee from "../../../../../models/employee.model";
import { bucket } from "../../../../../libs/libs";

export default async function DeleteEmployeeController(req: Request, res: Response, next: NextFunction) {
   try {
      const _id = req.params?.id;
      if (!_id) {
         return next(createHttpError.BadRequest("_id is param required"));
      }
      if (!isValidObjectId(_id)) {
         return next(createHttpError.BadRequest("_id is invalid"));
      }

      const employee = await Employee.findOne({ _id, "employee_details.company": req?.user?._id });

      if (!employee) {
         return next(createHttpError.NotFound("Employee not found!"));
      }
      if (req.user?._id.toString() !== employee.employee_details?.company?.toString()) {
         return next(createHttpError.NotFound("Employee not found!"));
      }
      await Employee.findByIdAndDelete({ _id });
      await bucket.deleteFile(employee._id.toString());
      res.status(201).json({
         message: "Single employee successfully deleted!",
         data: {},
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
