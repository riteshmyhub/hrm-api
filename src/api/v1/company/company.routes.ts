import { Router } from "express";
import { addNewDesignation, deleteDesignation, updateDesignation } from "./designations/designation.controller";
import CompanyGuard from "../../../middlewares/company.guard";
import AuthGuard from "../../../middlewares/auth.guard";
import { createEmployeeByCompanyID, deleteEmployeeByCompanyID, getEmployeesByCompanyID, getSingleEmployeeByCompanyID } from "./employee/employee.contoller";
import { updateCompanyPassword } from "./update-password/update-password.controller";
import { updateCompanyProfile } from "./update-profile/update-profile.controller";
import { employeeRestrict } from "./employee/employee-restrict/employee-restrict.controller";
import { createCompanyProject, getCompanyProjects, getCompanyProjectBySlug, updateCompanyProjectBySlug } from "./projects/project.contoller";
import { addCompanyFeature, deleteCompanyFeature } from "./projects/project-feature.controller";
import { addCompanySprints, deleteCompanySprints } from "./projects/project.sprints.controller";

const router = Router();
router.use(AuthGuard, CompanyGuard); // middleware
router.route("/designations").post(addNewDesignation);
router.route("/designations/:id").put(updateDesignation).delete(deleteDesignation);
router.route("/employees").get(getEmployeesByCompanyID).post(createEmployeeByCompanyID);
router.route("/employees/:id").get(getSingleEmployeeByCompanyID).delete(deleteEmployeeByCompanyID);
router.route("/update-password").post(updateCompanyPassword);
router.route("/update-profile").put(updateCompanyProfile);
router.route("/employee-restrict/:id").post(employeeRestrict);
router.route("/projects").get(getCompanyProjects).post(createCompanyProject);
router.route("/projects/:slug").get(getCompanyProjectBySlug).put(updateCompanyProjectBySlug);
router.route("/projects/:slug/features").post(addCompanyFeature).delete(deleteCompanyFeature);
router.route("/projects/:slug/sprints").post(addCompanySprints).delete(deleteCompanySprints);
export default router;
