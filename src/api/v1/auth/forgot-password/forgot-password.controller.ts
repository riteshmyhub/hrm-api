import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import Company from "../../../../models/company.model";
import Employee from "../../../../models/employee.model";
import { passwordResetOtp } from "../../../../utils/functions/otp";
import sendEmail from "../../../../mails/send-email";

export default async function ForgotPasswordController(req: Request, res: Response, next: NextFunction) {
   try {
      const { email } = req.body;
      if (!email) {
         return next(createHttpError.BadRequest("email is required!"));
      }

      const company_or_employee =
         (await Company.findOne({ email: email })) || //
         (await Employee.findOne({ email: email }));

      if (!company_or_employee) {
         return next(createHttpError.NotFound("email not found!"));
      }
      const data = passwordResetOtp();
      company_or_employee.resetPasswordToken = data.otpEncode;
      company_or_employee.resetPasswordExpire = data.expTime;
      await company_or_employee.save();
      const ex_time = Date.now() + 60 * parseInt(process.env.RESET_PASSWORD_OTP_EXP_TIME?.split("-")[0] as string) - Date.now();

      const user: any = company_or_employee;
      const mail = await sendEmail({
         to: [email],
         subject: "Password Reset Request",
         context: {
            otp: data.otp,
            company: "EcomZone",
            name: user?.company_name || `${user?.first_name}  ${user?.last_name}`,
            ex_time: `${ex_time} minute`,
         },
         templateName: "forgot-password.mail",
      });

      res.status(200).json({
         message: "otp successfully send on your email",
         data: { ex_time },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
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
