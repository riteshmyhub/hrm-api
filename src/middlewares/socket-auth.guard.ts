import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import Employee from "../models/employee.model";
import Company from "../models/company.model";
import { Socket } from "socket.io";

export default async function socketAuthGuard(socket: Socket, next: (err?: any) => void) {
   try {
      const token = socket.handshake.auth?.token as string;
      if (!token) {
         return next(createHttpError.Unauthorized("Your unauthorized"));
      }

      const verifyUser: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

      const user =
         (await Company.findById(verifyUser?._id)) ||
         (await Employee.findById(verifyUser?._id).populate([
            {
               path: "employee_details.company",
               model: "company",
               select: "company_details.company_name company_details.phone_number _id email",
            },
            {
               path: "employee_allocation.project",
               model: "project",
               select: "-__v",
               populate: {
                  path: "teams",
                  model: "employee",
                  select: "-__v -role -employee_details.skills -employee_allocation -employee_details.company -isActive",
               },
            },
         ]));

      if (!user || user?.isActive === false) {
         return next(createHttpError.Unauthorized());
      }

      // Attach user to socket object
      socket.user = user;
      next();
   } catch (error: any) {
      if (error.name === "TokenExpiredError") {
         return next(createHttpError.Forbidden("Token expired"));
      }
      if (error.name === "JsonWebTokenError") {
         return next(createHttpError.Unauthorized("Invalid token"));
      }
      next(createHttpError.InternalServerError());
   }
}
