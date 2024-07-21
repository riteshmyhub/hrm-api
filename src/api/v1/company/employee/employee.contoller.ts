import bcryptjs from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Employee from "../../../../models/employee.model";
import { isDocumentId, mongooseSchemaError } from "../../../../utils/pipes/validation.pipe";
import sendEmail from "../../../../mails/send-email";
import FRONTEND_URL from "../../../../utils/variables/variables";
import Company from "../../../../models/company.model";

type Body = {
   first_name: string;
   last_name: string;
   email: string;
   password: string;
   designation: string;
};

export async function createEmployeeByCompanyID(req: Request, res: Response, next: NextFunction) {
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
         from: req.user?.email,
         subject: "Welcome to the Team!",
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

export async function getEmployeesByCompanyID(req: Request, res: Response, next: NextFunction) {
   try {
      const employees = await Employee.find({ "employee_details.company": req?.user?._id });
      res.status(200).json({
         message: "Employees successfully fetched!",
         data: {
            employees,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}

export async function getSingleEmployeeByCompanyID(req: Request, res: Response, next: NextFunction) {
   try {
      const _id = req.params?.id;
      if (!_id) {
         return next(createHttpError.BadRequest("_id is param required"));
      }
      if (!isDocumentId(_id)) {
         return next(createHttpError.BadRequest("_id is invalid"));
      }
      const employee = await Employee.findOne({ _id, "employee_details.company": req?.user?._id }).populate({ path: "employee_details.company", model: "company" });

      if (!employee) {
         return next(createHttpError.NotFound("Employee not found!"));
      }
      res.status(200).json({
         message: `${employee.email} employee successfully fetched!`,
         data: { employee },
         success: true,
      });
   } catch (error: any) {
      console.log(error);

      next(createHttpError.InternalServerError(error));
   }
}

export async function deleteEmployeeByCompanyID(req: Request, res: Response, next: NextFunction) {
   try {
      const _id = req.params?.id;
      if (!_id) {
         return next(createHttpError.BadRequest("_id is param required"));
      }
      if (!isDocumentId(_id)) {
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
