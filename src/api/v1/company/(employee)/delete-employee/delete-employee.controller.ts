import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Employee from "../../../../../models/employee.model";

export default async function DeleteEmployeeController(req: Request, res: Response, next: NextFunction) {
   try {
      const _id = req.params?.id;
      if (!_id) {
         return next(createHttpError.BadRequest("_id is param required"));
      }
      if (!isValidObjectId(_id)) {
         return next(createHttpError.BadRequest("_id is invalid"));
      }

      const employee = await Employee.findOne({ _id });

      if (!employee) {
         return next(createHttpError.NotFound("Employee not found!"));
      }
      if (req.user?._id.toString() !== employee.employee_details?.company?.toString()) {
         return next(createHttpError.NotFound("Employee not found!"));
      }
      let updatedDocs = await Employee.findByIdAndDelete({ _id });

      res.status(201).json({
         message: "Single employee successfully deleted!",
         data: {},
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
