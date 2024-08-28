import cors from "cors";
import "dotenv/config";
import "./database/database";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import httpErrors from "http-errors";
import routes from "./api/routes";
import fileUpload from "express-fileupload";
import { bucket, corsOptions } from "./libs/libs";
import helmet from "helmet";
import morgan from "morgan";

interface CustomError extends Error {
   status?: number;
}

const app = express();
bucket.init();
const port: number = Number(process.env.PORT) || 3000;

// @middlewares
if (process.env.AUTH_MODE_TYPE === "http-cookies-auth") app.use(cookieParser());
app.use(helmet());
app.use(morgan(":method | :url | :status | :response-time ms"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use("/api/v1", routes);
app.use(function (req, res, next) {
   setTimeout(next, 0);
});
app.use(async (req, res, next) => {
   next(httpErrors.NotFound());
});
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
   res.status(err.status || 500);
   res.send({ error: { status: err.status || 500, message: err.message } });
});

//run server
(async function () {
   try {
      app.listen(port, () => {
         console.log(`------------------------------------------------------`);
         console.log(`server : http://localhost:${port}/api/v1  🚀🚀🚀....🌐`);
         console.log(`auth mode : ${process.env.AUTH_MODE_TYPE}`);
         console.log(`------------------------------------------------------`);
      });
   } catch (error) {
      console.log(error);
   }
})();
