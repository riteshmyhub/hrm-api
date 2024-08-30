import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";
import { corsOptions } from "../libs/libs";
import socketAuthGuard from "../middlewares/socket-auth.guard";
import Chat from "../models/chat.model";

const app = express();

const server = http.createServer(app);
const io = new SocketServer(server, { cors: corsOptions }).of("/api/v1/chat");

io.use(socketAuthGuard);
const userSoketMap: any = {};
io.on("connection", async (socket) => {
   const userID = socket.user?._id;
   if (userID) {
      userSoketMap[userID] = socket.id;
   }
   console.log(`user connected ${userID} with socketId: ${socket.id}`);
   console.log(Object.keys(userSoketMap));
   io.emit("onlineUsers", Object.keys(userSoketMap));
   // disconnect
   socket.on("disconnect", () => {
      delete userSoketMap[userID];
      io.emit("onlineUsers", Object.keys(userSoketMap));
      console.log("user disconnect ", socket.id);
   });
});

export { app, server };
