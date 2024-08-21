import { Router } from "express";
import AuthGuard from "../../../middlewares/auth.guard";
import EmployeeProfileModule from "./profile/profile.module";
import WorkspaceModule from "./workspace/workspace.module";

const router = Router();
router.use(AuthGuard); // middleware
router.use("/profile", new EmployeeProfileModule().routes);
router.use("/workspace", new WorkspaceModule().routes);

export default router;
