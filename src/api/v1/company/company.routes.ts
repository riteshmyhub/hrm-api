import { Router } from "express";
import { addNewDesignation, deleteDesignation, updateDesignation } from "./designations/designation.controller";
import CompanyGuard from "../../../middlewares/company.guard";
import AuthGuard from "../../../middlewares/auth.guard";
import { createEmployeeByCompanyID, deleteEmployeeByCompanyID, getEmployeesByCompanyID, getSingleEmployeeByCompanyID } from "./employees/employee.contoller";
import { updateCompanyPassword } from "./update-password/update-password.controller";
import { updateCompanyProfile } from "./update-profile/update-profile.controller";
import { employeeRestrict } from "./employees/employee-restrict/employee-restrict.controller";

const router = Router();
router.use(AuthGuard, CompanyGuard); // middleware
router.route("/designations").post(addNewDesignation);
router.route("/designations/:id").put(updateDesignation).delete(deleteDesignation);
router.route("/employees").get(getEmployeesByCompanyID).post(createEmployeeByCompanyID);
router.route("/employees/:id").get(getSingleEmployeeByCompanyID).delete(deleteEmployeeByCompanyID);
router.route("/update-password").post(updateCompanyPassword);
router.route("/update-profile").put(updateCompanyProfile);
router.route("/employee-restrict/:id").post(employeeRestrict);
export default router;
