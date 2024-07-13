const FRONTEND_URL = Boolean(Number(process.env.PRODUCTION)) //
   ? "https://hrm-frontend-kappa.vercel.app"
   : "http://localhost:3000";

export default FRONTEND_URL;
