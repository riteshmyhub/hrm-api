import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
   company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "company id required"],
   },
   project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "project id required"],
   },
   assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "assignedTo id required"],
   },
   feature: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "feature id required"],
   },
   sprint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "sprint id required"],
   },
   status: {
      type: String,
      enum: {
         values: ["todo", "progress", "qa", "rejected", "delivered", "hold", "canceled"],
         message: "Invalid story status",
      },
      default: "todo",
   },
   priority: {
      type: String,
      enum: {
         values: ["p1", "p2", "p3"],
         message: "priority type following: p1, p2, p3",
      },
      required: [true, "story priority required"],
   },
   type: {
      type: String,
      enum: {
         values: ["task", "bug", "sub task"],
         message: "story type following: task, bug, sub task",
      },
      required: [true, "story type required"],
   },
   title: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "required title"],
   },
   description: {
      type: String,
      trim: true,
      required: [true, "required description"],
   },
});

storySchema.set("timestamps", true);

const Story = mongoose.model("story", storySchema);
export default Story;
