import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Company from "../models/company.model";

export default async function CompanyGuard(req: Request, res: Response, next: NextFunction) {
   try {
      const dbUser = await Company.findOne({ _id: req.user._id });
      if (dbUser?.role === "company") {
         next();
      } else {
         next(createHttpError.Unauthorized("only company access"));
      }
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
