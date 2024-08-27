import { Router } from "express";
import CompanyGuard from "../../../middlewares/company.guard";
import AuthGuard from "../../../middlewares/auth.guard";
import EmployeeRestrictController from "./(employee)/employee-restrict/employee-restrict.controller";

//(profile)
import UpdateCompanyPasswordController from "./(profile)/update-password/update-password.controller";
import UpdateCompanyProfileController from "./(profile)/update-profile/update-profile.controller";
import AddDesignationController from "./(profile)/add-designation/add-designation.controller";
import UpdateDesignationController from "./(profile)/update-designation/update-designation.controller";
import DeleteDesignationController from "./(profile)/delete-designation/delete-designation.controller";
//(employee)
import CreateEmployeeController from "./(employee)/create-employee/create-employee.controller";
import GetEmployeesController from "./(employee)/get-employees/get-employees.controller";
import GetEmployeeController from "./(employee)/get-employee/get-employee.controller";
import DeleteEmployeeController from "./(employee)/delete-employee/delete-employee.controller";
//(project)
import CreateStoryContoller from "./(project)/(stroy)/create-story/create-story.contoller";
import GetStoriesController from "./(project)/(stroy)/get-stories/get-stories.controller";
import UpdateStoryStatusController from "./(project)/(stroy)/update-story-status/update-story-status.controller";
import AddSprintController from "./(project)/(sprint)/add-sprint/add-sprint.controller";
import DeleteSprintController from "./(project)/(sprint)/delete-sprint/delete-sprint.controller";
import AddFeatureController from "./(project)/(feature)/add-feature/add-feature.controller";
import DeleteFeatureController from "./(project)/(feature)/delete-feature/delete-feature.controller";
import GetProjectsController from "./(project)/get-projects/get-projects.controller";
import CreateProjectController from "./(project)/create-project/create-project.controller";
import GetSingleProjectController from "./(project)/get-single-project/get-single-project.controller";
import UpdateProjectController from "./(project)/update-project/update-project.controller";
import DeleteProjectController from "./(project)/delete-project/delete-project.controller";
import AddMemberController from "./(project)/(member)/add-member/add-member.controller";
import DeallocateMemberController from "./(project)/(member)/deallocate-member/deallocate-member.controller";
// resource
import GetResourcesController from "./resource/get-resources.controller";

const router = Router();
router.use(AuthGuard, CompanyGuard); // middleware

router.use(
   "/profile",
   (function () {
      router.post("/update-password", UpdateCompanyPasswordController);
      router.put("/update-profile", UpdateCompanyProfileController);
      router.post("/add-designation", AddDesignationController);
      router.put("/update-designation", UpdateDesignationController);
      router.delete("/delete-designation/:id", DeleteDesignationController);
      return router;
   })()
);

router.use(
   "/employee",
   (function () {
      router.post("/create-employee", CreateEmployeeController);
      router.get("/get-employees", GetEmployeesController);
      router.get("/get-employee/:id", GetEmployeeController);
      router.post("/employee-restrict/:id", EmployeeRestrictController);
      router.delete("/delete-employee/:id", DeleteEmployeeController);
      return router;
   })()
);

router.use(
   "/projects",
   (function () {
      router.post("/create-project", CreateProjectController);
      router.get("/get-projects", GetProjectsController);
      router.get("/get-single-project/:projectID", GetSingleProjectController);
      router.put("/update-project/:projectID", UpdateProjectController);
      router.delete("/delete-project/:projectID", DeleteProjectController);
      // story
      router.post("/:projectID/story/create-story", CreateStoryContoller);
      router.get("/:projectID/story/get-stories", GetStoriesController);
      router.put("/:projectID/story/update-story-status", UpdateStoryStatusController);
      // features
      router.post("/:projectID/feature/add-feature", AddFeatureController);
      router.delete("/:projectID/feature/delete-feature", DeleteFeatureController);
      // sprint
      router.post("/:projectID/sprint/add-sprint", AddSprintController);
      router.delete("/:projectID/sprint/delete-sprint", DeleteSprintController);
      // member
      router.post("/:projectID/add-member", AddMemberController);
      router.delete("/:projectID/deallocate-member/:employeeID", DeallocateMemberController);
      return router;
   })()
);

router.use(
   "/resource",
   (function () {
      router.get("/get-resources", GetResourcesController);
      return router;
   })()
);

export default router;
