import { User } from "../users/user.model";
import { IUser, USER_ROLE } from "../users/user.interface";
import config from "../../config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";

const registerUser = async (payload: IUser): Promise<IUser> => {
  const result = await User.create(payload);
  return result;
};

const loginUser = async (payload: Partial<IUser>) => {
  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password as string,
    user.password as string,
  );
  if (!isPasswordMatched) {
    throw new Error("Invalid password");
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    config.jwt_access_secret as Secret,
    { expiresIn: "1d" },
  );

  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    config.jwt_refresh_secret as Secret,
    { expiresIn: "365d" },
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const loginWithGoogle = async (accessToken: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
    );

    if (!response.ok) {
      throw new Error("Failed to authenticate with Google");
    }

    const data = await response.json();
    const { email, name, picture } = data;

    if (!email) {
      throw new Error("Google account provided no email");
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profileImage: picture,
        role: USER_ROLE.USER,
      });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      config.jwt_access_secret as Secret,
      { expiresIn: "1d" },
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      config.jwt_refresh_secret as Secret,
      { expiresIn: "365d" },
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    };
  } catch (error) {
    throw new Error("Google Login Failed");
  }
};

export const AuthService = {
  registerUser,
  loginUser,
  loginWithGoogle,
};
