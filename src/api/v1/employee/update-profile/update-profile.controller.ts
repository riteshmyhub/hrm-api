import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Employee from "../../../../models/employee.model";

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
   try {
      const body = req.body;
      let image = body?.avatar;

      if (image) {
         console.log(image);
      }
      const employee = await Employee.findOneAndUpdate(
         { _id: req?.user?._id },
         {
            $set: {
               "employee_details.first_name": body?.first_name,
               "employee_details.last_name": body?.last_name,
               "employee_details.linkedin_username": body?.linkedin_username,
               "employee_details.about": body?.about,
               "employee_details.total_experience": body?.total_experience,
               "employee_details.skills": body["skills[]"],
            },
         },
         { new: true } // This option returns the updated document
      );

      res.status(201).json({
         message: "Profile updated successfully",
         data: {
            user: employee,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
