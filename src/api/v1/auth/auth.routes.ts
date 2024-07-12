import { Router } from "express";
import register from "./register/register";
import login from "./login/login";
import { forgotPassword, resetPassword } from "./forgot-password/forgot-password";
import authUser from "./user/auth-user";
import AuthGuard from "../../../middlewares/auth.guard";

const authRoutes = Router();
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.get("/user", [AuthGuard], authUser);
export default authRoutes;
