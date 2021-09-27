import { Schema, model, Types } from "mongoose";
import { IReminder } from "./reminder.models";

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
  birthDate: Date;
  isPremium: boolean;
  themeConfigs?: ITheme;
}

interface ITheme {
  primaryColor: string;
  secondaryColor: string;
  appBGColor: string;
  reminderNotRandomColorInList: string;
  reminderWithRandomColorInList: boolean;
}

const schema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, require: true },
    email: { type: String, required: true },
    profilePictureUrl: { type: String },
    isPremium: { type: Boolean, required: true },
    themeConfigs: {
      primaryColor: { type: String },
      secondaryColor: { type: String },
      appBGColor: { type: String },
      reminderNotRandomColorInList: { type: String },
      reminderWithRandomColorInList: { type: Boolean },
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", schema);
