import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Employee from "../../../../models/employee.model";

export default async function GetResourcesController(req: Request, res: Response, next: NextFunction) {
   try {
      const resources = await Employee.find({
         "employee_details.company": req?.user?._id,
         "employee_allocation.isAllocate": false,
      });
      res.status(201).json({
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
