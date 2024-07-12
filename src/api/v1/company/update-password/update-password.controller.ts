import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcryptjs from "bcryptjs";
import Company from "../../../../models/company.model";

type Body = {
   old_password: string;
   new_password: string;
   confirm_password: string;
};
export async function updateCompanyPassword(req: Request, res: Response, next: NextFunction) {
   try {
      const { old_password, new_password, confirm_password }: Body = req.body;
      if (!old_password || !new_password || !confirm_password) {
         return next(createHttpError.BadRequest(`old_password, new_password, confirm_password is required!`));
      }
      if (new_password !== confirm_password) {
         return next(createHttpError.BadRequest("new password and confirm password not matching!"));
      }
      const company = await Company.findById(req.user?._id).select("+password");
      if (!company) {
         return next(createHttpError.NotFound("Company not found!"));
      }
      const isMatch = await bcryptjs.compare(old_password, company?.password as string);
      if (!isMatch) {
         return next(createHttpError.BadRequest("invalid old password!"));
      }
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(new_password, salt);
      company.password = hashPassword;
      await company.save();
      res.status(201).json({
         success: true,
         message: "password successfully updated",
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
