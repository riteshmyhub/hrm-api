import { Router } from "express";
import { updateEmployeePassword } from "./update-password/update-password.controller";
import AuthGuard from "../../../middlewares/auth.guard";
import { updateProfile } from "./update-profile/update-profile.controller";
import { employeeRestrict } from "../company/employees/employee-restrict/employee-restrict.controller";

const router = Router();
router.use(AuthGuard); // middleware
router.route("/update-password").post(updateEmployeePassword);
router.route("/update-profile").put(updateProfile);

export default router;
