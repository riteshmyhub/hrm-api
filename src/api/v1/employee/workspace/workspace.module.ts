import { Router } from "express";
import StoryController from "./story/story.controller";

export default class WorkspaceModule {
   get routes() {
      const routes = Router();
      routes.use("/stories", new StoryController().routes);
      return routes;
   }
}
