import { Schema, model, Types } from "mongoose";

export interface IUserAuth {
  _id?: string;
  email: string;
  password: string;
}

const schema = new Schema<IUserAuth>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model<IUserAuth>("UserAuth", schema);
