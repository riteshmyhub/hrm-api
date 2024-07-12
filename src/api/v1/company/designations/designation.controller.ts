import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Company from "../../../../models/company.model";
import { isDocumentId, mongooseSchemaError } from "../../../../utils/pipes/validation.pipe";

export async function addNewDesignation(req: Request, res: Response, next: NextFunction) {
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
         data: { company },
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

export async function updateDesignation(req: Request, res: Response, next: NextFunction) {
   try {
      const name = req.body?.name;
      const _id = req.params?.id;
      if (!_id || !name) {
         return next(createHttpError.BadRequest("_id , name is required!"));
      }
      if (!isDocumentId(_id)) {
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
         data: { company },
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
export async function deleteDesignation(req: Request, res: Response, next: NextFunction) {
   try {
      const _id = req.params.id;
      if (!_id) {
         return next(createHttpError.BadRequest("name , _id is required!"));
      }
      if (!isDocumentId(_id)) {
         return next(createHttpError.BadRequest("invalid _id"));
      }
      const company = await Company.findOneAndUpdate(
         {
            _id: req?.user?._id,
         },
         {
            $pull: {
               "company_details.designations": { _id },
            },
         },
         { new: true }
      );

      return res.status(201).json({
         message: "designation successfully deleted!",
         data: { company },
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError());
   }
}
