import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { TLogin } from "./auth.interface";
import httpStatus from "http-status";
import config from "../../config";
import { createJwtToken, verifyToken } from "./auth.utils";

const loginUserFromDB = async (payload: TLogin) => {
  const { email, password } = payload;

  const user = await User.isUserExistByCustomEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (await User.isDeleted(email)) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!(await User.isValidPassword(password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Invalid password");
  }

  const jwtPayload = {
    id: user._id,
  };
  const accessToken = createJwtToken(
    jwtPayload,
    config.access_token as string,
    Number(config.access_expires_in) as number
  );

  const refreshToken = createJwtToken(
    jwtPayload,
    config.refresh_token as string,
    Number(config.refresh_expires_in) as number
  );
  return {
    accessToken,
    refreshToken,
  };
};
const refreshTokenFromCookie = async (refreshToken: string) => {
  const decoded = verifyToken(refreshToken, config.refresh_token as string);

  const { id, iat } = decoded;

  const user = await User.findById(id);
  console.log({ refreshToken, decoded, user });
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, "User not found");
  }
  if (await User.isDeleted(id)) {
    throw new AppError(httpStatus.FORBIDDEN, "User not found");
  }
  if (
    user?.passwordChangeAt &&
    (await User.isJWTTokenIssuedBeforePassword(
      iat as number,
      user?.passwordChangeAt
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "user token not valid");
  }

  const jwtPayload = {
    id: user._id,
  };
  const accessToken = createJwtToken(
    jwtPayload,
    config.access_token as string,
    Number(config.access_expires_in)
  );
  return {
    accessToken,
  };
};

export const AuthService = {
  loginUserFromDB,
  refreshTokenFromCookie,
};
