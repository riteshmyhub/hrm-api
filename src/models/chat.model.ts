import mongoose, { Document } from "mongoose";

interface IChat extends Document {
   sender: mongoose.Schema.Types.ObjectId;
   receiver?: mongoose.Schema.Types.ObjectId;
   messageType: "text" | "file";
   content?: string;
   fileURL?: string;
   createdAt: Date;
   updatedAt: Date;
}

const chatSchema = new mongoose.Schema(
   {
      sender: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      receiver: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
      messageType: {
         type: String,
         enum: ["text", "file"],
         required: true,
      },
      content: {
         type: String,
         required: function (this: IChat) {
            return this.messageType === "text";
         },
      },
      fileURL: {
         type: String,
         required: function (this: IChat) {
            return this.messageType === "file";
         },
      },
   },
   {
      timestamps: true,
   }
);
const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
