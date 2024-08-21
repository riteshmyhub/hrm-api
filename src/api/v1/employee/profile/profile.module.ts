import { Router } from "express";
import { updateEmployeePassword } from "./update-password/update-password.controller";
import { updateEmployeeProfile } from "./update-profile/update-profile.controller";

export default class EmployeeProfileModule {
   private router = Router();

   get routes() {
      this.router.post("/update-password", updateEmployeePassword);
      this.router.put("/update-profile", updateEmployeeProfile);
      return this.router;
   }
}
