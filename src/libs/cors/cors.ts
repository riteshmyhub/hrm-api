import { CorsOptions } from "cors";

const allowlist: string[] = [
   process.env.DEVELOPMENT_FRONTEND_URL as string, //
   process.env.PRODUCTION_FRONTEND_URL as string,
];

const corsOptions: CorsOptions = {
   origin: allowlist,
   credentials: true,
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

export { corsOptions };
