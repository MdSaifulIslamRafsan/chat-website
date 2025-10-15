import httpStatus from "http-status";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppError";

const createUserIntoDB = async (data: TUser) => {
  const isExistUser = await User.findOne({ email: data?.email });

  if (isExistUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  const result = await User.create(data);
  return result;
};

// const getUserFromDB = async () => {
//   const result = await User.findOne();
//   return result;
// };

export const userService = {
  createUserIntoDB,
  // getUserFromDB,
};
