import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isDocumentId } from "../../../../../utils/pipes/validation.pipe";
import Company from "../../../../../models/company.model";

export default async function DeleteDesignationController(req: Request, res: Response, next: NextFunction) {
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
         data: { designations: company?.company_details?.designations },
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError());
   }
}
