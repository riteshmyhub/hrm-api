import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Company from "../../../../../models/company.model";
import { mongooseSchemaError } from "../../../../../utils/pipes/validation.pipe";

export default async function AddDesignationController(req: Request, res: Response, next: NextFunction) {
   try {
      const body: { name: string } = req.body;
      const company = await Company.findById(req?.user?._id);
      const duplicate = company?.company_details?.designations?.find((item) => item.name === body.name);

      if (duplicate) {
         return next(createHttpError.BadRequest("Designation already exists"));
      }
      company?.company_details?.designations.push({ name: body?.name });
      await company?.save({ validateBeforeSave: true });

      res.status(201).json({
         message: "designation successfully created!",
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
