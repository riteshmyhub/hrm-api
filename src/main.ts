import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import httpErrors from "http-errors";
import routes from "./api/app";
import fileUpload from "express-fileupload";
import "./database/database";

interface CustomError extends Error {
   status?: number;
}

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// @middlewares
if (process.env.AUTH_MODE_TYPE === "http-cookies-auth") app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use("/api/v1", routes);
app.use(function (req, res, next) {
   setTimeout(next, 2000);
});
app.use(async (req, res, next) => {
   next(httpErrors.NotFound());
});
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
   res.status(err.status || 500);
   res.send({ error: { status: err.status || 500, message: err.message } });
});

//server init
async function Server() {
   try {
      app.listen(port, () => {
         console.log(`--------------------------------------------------`);
         console.log(`server : http://localhost:${port}/api/v1  🚀🚀🚀....🌐`);
         console.log(`auth mode : ${process.env.AUTH_MODE_TYPE}`);
         console.log(`--------------------------------------------------`);
      });
   } catch (error) {
      console.log(error);
   }
}
Server();
