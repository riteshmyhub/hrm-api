import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Company from "../../../../models/company.model";
import Employee from "../../../../models/employee.model";

export default async function ResetPasswordController(req: Request, res: Response, next: NextFunction) {
   try {
      const { otp, password, confirm_password } = req.body;
      if (!otp || !password || !confirm_password) {
         return next(createHttpError.BadRequest("otp, password, confirm_password in required!"));
      }
      if (password !== confirm_password) {
         return next(createHttpError.BadRequest("password, confirm_password not match!"));
      }
      const decodeOtp = crypto.createHash("sha256").update(String(otp)).digest("hex");

      const filter = {
         resetPasswordToken: decodeOtp,
         resetPasswordExpire: { $gt: Date.now() },
      };
      const company_or_employee =
         (await Company.findOne(filter)) || //
         (await Employee.findOne(filter));

      if (!company_or_employee) {
         return next(createHttpError.NotFound("invalid otp!"));
      }
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(password, salt);
      company_or_employee.password = hashPassword;
      company_or_employee.resetPasswordToken = undefined;
      company_or_employee.resetPasswordExpire = undefined;
      await company_or_employee.save();
      //

      res.status(200).json({
         message: "you are password successfully reset",
         data: {},
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
