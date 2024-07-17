import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import Project from "../../../../models/project.model";
import { slugPipe } from "../../../../utils/pipes/string.pipe";
import { isDocumentId } from "../../../../utils/pipes/validation.pipe";

export async function createCompanyProject(req: Request, res: Response, next: NextFunction) {
   try {
      const { name } = req.body;
      if (!name) {
         return next(createHttpError.BadRequest("name is required"));
      }
      const slug = slugPipe(name);
      const idDuplicate = await Project.findOne({ slug });
      if (idDuplicate) {
         return next(createHttpError.BadRequest("Project name is already taken"));
      }
      await Project.create({ name, slug, company: req.user?._id });
      res.status(201).json({
         message: "Project successfully created!",
         data: {},
         success: true,
      });
   } catch (error: any) {
      next(createHttpError.InternalServerError("Internal Server Error"));
   }
}

export async function getCompanyProjects(req: Request, res: Response, next: NextFunction) {
   try {
      const projects = await Project.find({ company: req?.user?._id });
      res.status(200).json({
         message: "Company projects fetch  successfully",
         data: {
            projects,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}

export async function getCompanyProjectBySlug(req: Request, res: Response, next: NextFunction) {
   try {
      const project = await Project.findOne({ slug: req.params?.slug, company: req?.user?._id });
      if (!project) {
         return next(createHttpError.NotFound("Project not found"));
      }
      res.status(200).json({
         message: "Single Company project fetch successfully",
         data: {
            project: project,
         },
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}

export async function updateCompanyProjectBySlug(req: Request, res: Response, next: NextFunction) {
   try {
      const project = await Project.findOne({ slug: req.params?.slug, company: req?.user?._id });
      if (!project) {
         return next(createHttpError.NotFound("Project not found"));
      }
      if (!Object.keys(req.body)?.length) {
         return next(createHttpError.BadRequest("No data payload"));
      }
      if (req.body.name) {
         project.name = req.body.name;
         project.slug = slugPipe(req.body.name);
      }
      if (req.body.image) {
         console.log(req.body.image);
      }
      if (req.body.description) project.description = req.body.description;
      if (req.body.platform) project.platform = req.body.platform;
      if (req.body.platform) project.release_plan = req.body.release_plan;
      if (req.body["technology[]"]) project.technologies = req.body["technology[]"];
      await project.save();
      res.status(200).json({
         message: "Project update successfully",
         data: {},
         success: true,
      });
   } catch (error) {
      next(createHttpError.InternalServerError());
   }
}
