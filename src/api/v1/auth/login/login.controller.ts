import bcryptjs from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Company from "../../../../models/company.model";
import Employee from "../../../../models/employee.model";
import { createAccessToken } from "../../../../utils/functions/token";

type Body = {
   email: string;
   password: string;
};
export default async function LoginController(req: Request, res: Response, next: NextFunction) {
   try {
      const { email, password }: Body = req.body;
      if (!email || !password) {
         return next(createHttpError.BadRequest("email , password  is required"));
      }
      const user =
         (await Company.findOne({ email }).select("+password")) || //
         (await Employee.findOne({ email }).select("+password"));

      if (!user) {
         return next(createHttpError.NotFound("entry not exist"));
      }
      let match = await bcryptjs.compare(password, user.password);
      if (!match) {
         return next(createHttpError.Unauthorized());
      }
      if (user.isActive === false) {
         return next(createHttpError.Unauthorized("Account disabled. Contact your organization."));
      }
      const accessToken = await createAccessToken(user._id);
      const [value] = process.env.TOKEN_EXPIRES_IN?.split("-") as string[];
      if (process.env.AUTH_MODE_TYPE === "http-cookies-auth") {
         return res.cookie("accessToken", accessToken, {
            httpOnly: true,
            expires: new Date(Date.now() + Number(value) * 60 * 1000),
         });
      }
      res.status(200).json({
         success: true,
         data: {
            accessToken: accessToken,
         },
         message: "login successfully",
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError());
   }
}
