import { Router } from "express";
import { addNewDesignation, deleteDesignation, updateDesignation } from "./designations/designation.controller";
import CompanyGuard from "../../../middlewares/company.guard";
import AuthGuard from "../../../middlewares/auth.guard";
import { createEmployeeByCompanyID, deleteEmployeeByCompanyID, getEmployeesByCompanyID, getSingleEmployeeByCompanyID } from "./employee/employee.contoller";
import { updateCompanyPassword } from "./update-password/update-password.controller";
import { updateCompanyProfile } from "./update-profile/update-profile.controller";
import { employeeRestrict } from "./employee/employee-restrict/employee-restrict.controller";
import { createCompanyProject, getCompanyProjects, getCompanyProjectById, updateCompanyProjectById, deleteProjectById } from "./projects/project.contoller";
import { addCompanyFeature, deleteCompanyFeature } from "./projects/project-feature.controller";
import { addCompanySprints, deleteCompanySprints } from "./projects/project.sprints.controller";
import { addAllocation, deallocation, getResources } from "./projects/project-allocation.controller";
import { createStory, getStories, updateStoryStatus } from "./projects/project-story.controller";

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
router.route("/projects/:id").get(getCompanyProjectById).put(updateCompanyProjectById).delete(deleteProjectById);
router.route("/projects/:id/features").post(addCompanyFeature).delete(deleteCompanyFeature);
router.route("/projects/:id/sprints").post(addCompanySprints).delete(deleteCompanySprints);
router.route("/projects/:id/stroy").post(createStory).get(getStories).put(updateStoryStatus);

router.route("/project-allocation").get(getResources).post(addAllocation).delete(deallocation);
export default router;
