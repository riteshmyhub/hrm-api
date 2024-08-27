import { Request } from "express";
import cors from "cors";

const allowlist: string[] = [
   process.env.DEVELOPMENT_FRONTEND_URL || "", //
   process.env.PRODUCTION_FRONTEND_URL || "",
];

function corsOptionsDelegate(req: Request, callback: (err: Error | null, options?: any) => void) {
   let corsOptions;
   if (allowlist.indexOf(req.header("Origin") || "") !== -1) {
      corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
   } else {
      corsOptions = { origin: false }; // disable CORS for this request
   }
   callback(null, corsOptions); // callback expects two parameters: error and options
}
const corsConfig = () => cors(corsOptionsDelegate);
export { corsConfig };
