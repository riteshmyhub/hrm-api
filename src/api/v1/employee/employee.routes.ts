import { Router } from "express";
import AuthGuard from "../../../middlewares/auth.guard";
// (workspace)
import GetStoriesController from "./(workspace)/get-stories/get-stories.controller";
import ChangeStoryStatusController from "./(workspace)/change-story-status/change-story-status.controller";
// (profile)
import UpdateEmployeePasswordController from "./(profile)/update-password/update-password.controller";
import UpdateEmployeeProfileController from "./(profile)/update-profile/update-profile.controller";

const router = Router();
router.use(AuthGuard); // middleware

router.use("/profile",
   (function () {
      router.post("/update-password", UpdateEmployeePasswordController);
      router.put("/update-profile", UpdateEmployeeProfileController);
      return router;
   })()
);

router.use("/workspace",
   (function () {
      router.route("/stories").get(GetStoriesController);
      router.route("/stories/status").post(ChangeStoryStatusController);
      return router;
   })()
);

export default router;
