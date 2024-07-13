const FRONTEND_URL = Boolean(Number(process.env.PRODUCTION)) //
   ? process.env.PRODUCTION_FRONTEND_URL
   : process.env.DEVELOPMENT_FRONTEND_URL;

export default FRONTEND_URL;
