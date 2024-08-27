import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import Company from "../../../../../models/company.model";

type Body = {
   company_name: string;
   phone_number: string;
   logo?: any;
};
export default async function UpdateCompanyProfileController(req: Request, res: Response, next: NextFunction) {
   try {
      const body: Body = req.body;
      let logo = body?.logo;

      if (logo) {
         console.log(logo);
      }
      const company = await Company.findOneAndUpdate(
         { _id: req?.user?._id },
         {
            $set: {
               "company_details.company_name": body?.company_name,
               "company_details.phone_number": body?.phone_number,
            },
         },
         { new: true } // This option returns the updated document
      );

      res.status(201).json({
         message: "Company profile updated successfully",
         data: {
            user: company,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
