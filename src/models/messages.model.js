import { Schema, model } from "mongoose";

const messageColletion = "Messages";

const messageSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export const messagesModel = model(messageColletion, messageSchema);
