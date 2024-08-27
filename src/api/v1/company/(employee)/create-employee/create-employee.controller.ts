import bcryptjs from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Company from "../../../../../models/company.model";
import Employee from "../../../../../models/employee.model";
import sendEmail from "../../../../../mails/send-email";
import FRONTEND_URL from "../../../../../utils/variables/variables";
import { mongooseSchemaError } from "../../../../../utils/pipes/validation.pipe";

type Body = {
   first_name: string;
   last_name: string;
   email: string;
   password: string;
   designation: string;
};

export default async function CreateEmployeeController(req: Request, res: Response, next: NextFunction) {
   try {
      const { first_name, last_name, email, password, designation }: Body = req.body;
      if (!first_name || !last_name || !email || !password || !designation) {
         return next(createHttpError.BadRequest("first_name, last_name , email , password , designation required"));
      }
      const company_or_employee =
         (await Company.findOne({ email })) || //
         (await Employee.findOne({ email }));

      const designations: { _id: string; name: string }[] = req?.user?.company_details?.designations;
      const isDesignationMatch = designations?.find((item) => item?.name === designation);
      if (company_or_employee) {
         return next(createHttpError.BadRequest("employee email is already exist"));
      }
      if (!designations?.length) {
         return next(createHttpError.BadRequest("please create designation!"));
      }
      if (!isDesignationMatch) {
         return next(createHttpError.BadRequest("invalid designation name!"));
      }
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(password, salt);

      await Employee.create({
         email: email,
         password: hashPassword,
         employee_details: {
            company: req.user?._id,
            first_name,
            last_name,
            designation,
         },
      });

      const mail = await sendEmail({
         to: [email],
         subject: `Welcome to ${req.user?.company_details?.company_name}!`,
         context: {
            company: {
               company_name: req.user?.company_details?.company_name,
               email: req.user?.email,
               current_year: new Date().getFullYear(),
               auth_url: FRONTEND_URL + "/auth/login",
            },
            employee: { first_name, last_name, email, password, designation },
         },
         templateName: "welcome-employee.mail",
      });

      res.status(201).json({
         message: "Employee successfully created!",
         success: true,
      });
   } catch (error: any) {
      console.log(error);

      if (error?.name === "ValidationError") {
         const schemaErrors = mongooseSchemaError(error);
         return next(createHttpError.BadRequest(schemaErrors.toString()));
      }
      next(createHttpError.InternalServerError(error));
   }
}
