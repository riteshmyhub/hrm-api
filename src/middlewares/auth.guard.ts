import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Employee from "../models/employee.model";
import Company from "../models/company.model";

export default async function AuthGuard(req: Request, res: Response, next: NextFunction) {
   try {
      if (!req.headers["authorization"]) {
         return next(createHttpError.Unauthorized("your unauthorized"));
      }

      const accessToken = req.headers["authorization"].split(" ")[1];

      const verifyUser: any = await jwt.verify(accessToken, process.env.JWT_SECRET_KEY as string);

      const user =
         (await Company.findById(verifyUser?._id)) ||
         (await Employee.findById(verifyUser?._id).populate({
            path: "employee_details.company",
            model: "company",
            select: "company_details.company_name company_details.phone_number _id email",
         }));

      if (!user) {
         next(createHttpError.Unauthorized());
      }
      if (user?.isActive === false) {
         next(createHttpError.Unauthorized());
      }
      req.user = user;
      next();
   } catch (error: any) {
      if (error.name === "TokenExpiredError") {
         return next(createHttpError.Forbidden());
      }
      next(createHttpError.InternalServerError());
   }
}
