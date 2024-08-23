import { Router } from "express";
import AuthGuard from "../../../middlewares/auth.guard";
import GetStoriesController from "./workspace/get-stories/get-stories.controller";
import ChangeStoryStatusController from "./workspace/change-story-status/change-story-status.controller";
import { updateEmployeePassword } from "./profile/update-password/update-password.controller";
import { updateEmployeeProfile } from "./profile/update-profile/update-profile.controller";

const router = Router();
router.use(AuthGuard); // middleware

router.use("/profile", function(){
    router.post("/update-password", updateEmployeePassword);
    router.put("/update-profile", updateEmployeeProfile);
    return router
}());

router.use("/workspace", function(){
    router.route('/stories').get(GetStoriesController);
    router.route('/stories/status').post(ChangeStoryStatusController);
    return router;
}());


export default router;

