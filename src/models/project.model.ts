import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, "required name"],
      unique: true,
      trim: true,
   },
   slug: {
      type: String,
      required: [true, "required slug"],
      unique: true,
      trim: true,
   },
   company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
   },
   image: {
      type: String,
   },
   description: {
      type: String,
      trim: true,
   },
   platform: {
      type: String,
      trim: true,
   },
   release_plan: {
      type: Date,
      trim: true,
   },
   key_features: [
      {
         type: {
            title: {
               type: String,
               required: [true, "required title"],
            },
            description: {
               type: String,
               required: [true, "required description"],
            },
         },
      },
   ],
   technologies: [{ type: String, unique: true }],
   designations: [
      {
         type: {
            name: {
               type: String,
               unique: true,
               required: [true, "required title"],
            },
            post: {
               type: Number,
               required: [true, "required description"],
            },
            allocate: {
               type: Number,
               required: [true, "required description"],
               default: 0,
            },
         },
      },
   ],
   sprints: [
      {
         type: {
            title: {
               type: String,
               required: [true, "title is required"],
            },
            status: {
               type: String,
               required: [true, "status is required"],
            },
            started_on: {
               type: Date,
               required: [true, "started_on is required"],
            },
            updated_on: {
               type: Date,
               required: [true, "updated_on is required"],
            },
         },
      },
   ],
   features: [
      {
         type: {
            title: {
               type: String,
               required: [true, "Title is required"],
            },
            sprint: {
               type: String,
               required: [true, "Sprint status is required"],
            },
            description: {
               type: String,
               required: [true, "Description is required"],
            },
            note: {
               type: String,
               required: [true, "Note is required"],
            },
         },
      },
   ],
   theme: {
      type: {
         color1: { type: String },
         color2: { type: String },
         color3: { type: String },
         color4: { type: String },
         color5: { type: String },
      },
   },
   teams: [
      {
         type: {
            employee: {
               type: Schema.Types.ObjectId,
               ref: "Employee",
            },
         },
      },
   ],
});

projectSchema.set("timestamps", true);
const Project = mongoose.model("Project", projectSchema);
export default Project;
