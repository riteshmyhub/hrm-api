import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Employee from "../../../../../models/employee.model";
import { bucket } from "../../../../../libs/libs";

export default async function UpdateEmployeeProfileController(req: Request, res: Response, next: NextFunction) {
   try {
      const { first_name, last_name, linkedin_username, about, total_experience, avatar } = req.body;
      const updateFields: any = {};
      if (first_name) updateFields["employee_details.first_name"] = first_name;
      if (last_name) updateFields["employee_details.last_name"] = last_name;
      if (linkedin_username) updateFields["employee_details.linkedin_username"] = linkedin_username;
      if (about) updateFields["employee_details.about"] = about;
      if (total_experience) updateFields["employee_details.total_experience"] = total_experience;
      if (req.body["skills[]"]) updateFields["employee_details.skills"] = req.body["skills[]"];

      if (avatar) {
         const fileRes = await bucket.uploadFile({
            file: avatar,
            options: {
               folder: "employees",
               width: 200,
               overwrite: true,
               public_id: req.user?._id,
            },
         });
         updateFields["employee_details.avatar"] = fileRes.url;
      }

      const employee = await Employee.findOneAndUpdate(
         { _id: req?.user?._id },
         { $set: updateFields },
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
      console.log(error);

      next(createHttpError.InternalServerError());
   }
}
