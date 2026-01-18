import { Schema, model } from "mongoose";
import { IUser, UserModel, USER_ROLE } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: 0 },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },
    profileImage: { type: String },
    bio: { type: String },
    interests: [{ type: String }],
    location: { type: String },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  const user = this;
  if (!user.isModified("password")) return;

  if (user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
});

export const User = model<IUser, UserModel>("User", userSchema);
