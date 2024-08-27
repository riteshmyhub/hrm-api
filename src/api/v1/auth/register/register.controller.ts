import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcryptjs from "bcryptjs";
import Company from "../../../../models/company.model";
import Employee from "../../../../models/employee.model";
import { mongooseSchemaError } from "../../../../utils/pipes/validation.pipe";

type Body = {
   email: string;
   password: string;
   company_phone_number: string;
   company_name: string;
};

export default async function RegisterController(req: Request, res: Response, next: NextFunction) {
   try {
      const { email, password, company_phone_number, company_name }: Body = req.body;
      if (!password) {
         return next(createHttpError.BadRequest("password is required"));
      }
      const company_or_employee =
         (await Company.findOne({ email })) || //
         (await Employee.findOne({ email }));

      if (company_or_employee) {
         return next(createHttpError.BadRequest("email is already exist"));
      }
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(password, salt);

      await Company.create({
         email,
         password: hashPassword,
         company_details: {
            company_name: company_name,
            phone_number: company_phone_number,
         },
      });
      res.status(200).json({
         message: "registration successfully",
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
