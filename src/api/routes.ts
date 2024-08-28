import { Router } from "express";
import authRoutes from "./v1/auth/auth.routes";
import companyRoutes from "./v1/company/company.routes";
import employeeRoutes from "./v1/employee/employee.routes";

const routes = Router();

routes.get("/", (req, res) => {
   res.status(200).json({
      message: "welcome to project buddy api",
   }); 
});
routes.use("/auth", authRoutes);
routes.use("/company", companyRoutes);
routes.use("/employee", employeeRoutes);
export default routes;
