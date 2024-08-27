import { Router } from "express";
import RegisterController from "./register/register.controller";
import LoginController from "./login/login.controller";
import ForgotPasswordController from "./forgot-password/forgot-password.controller";
import ResetPasswordController from "./reset-password/reset-password.controller";
import AuthUserController from "./user/auth-user";
import AuthGuard from "../../../middlewares/auth.guard";

const authRoutes = Router();
authRoutes.post("/register", RegisterController);
authRoutes.post("/login", LoginController);
authRoutes.post("/forgot-password", ForgotPasswordController);
authRoutes.post("/reset-password", ResetPasswordController);
authRoutes.get("/session", [AuthGuard], AuthUserController);
export default authRoutes;
