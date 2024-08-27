import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { mongooseSchemaError } from "../../../../../utils/pipes/validation.pipe";
import Company from "../../../../../models/company.model";
import { isValidObjectId } from "mongoose";

export default async function UpdateDesignationController(req: Request, res: Response, next: NextFunction) {
   try {
      const name = req.body?.name;
      const _id = req.body?._id;
      if (!_id || !name) {
         return next(createHttpError.BadRequest("_id , name is required!"));
      }
      if (!isValidObjectId(_id)) {
         return next(createHttpError.BadRequest("invalid _id"));
      }
      const company = await Company.findById(req?.user?._id);
      const duplicate = company?.company_details?.designations?.find((item) => item?.name === name);
      if (duplicate) {
         return next(createHttpError.BadRequest("Designation already exists"));
      }

      company?.company_details?.designations?.forEach((item) => {
         if (item._id?.toString() === _id.toString()) {
            item.name = name;
         }
      });
      await company?.save({ validateBeforeSave: true });
      return res.status(201).json({
         message: "designation successfully updates!",
         data: {
            designations: company?.company_details?.designations,
         },
         success: true,
      });
   } catch (error: any) {
      if (error?.name === "ValidationError") {
         const schemaErrors = mongooseSchemaError(error);
         return next(createHttpError.BadRequest(schemaErrors.toString()));
      }
      next(createHttpError.InternalServerError());
   }
}
