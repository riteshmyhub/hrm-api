import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";

export default async function authUser(req: Request, res: Response, next: NextFunction) {
   try {
      res.status(200).json({
         message: "user successfully fetched!",
         data: {
            user: req.user,
         },
         success: true,
      });
   } catch (error: any) {
      console.log(error);
      next(createHttpError.InternalServerError());
   }
}
