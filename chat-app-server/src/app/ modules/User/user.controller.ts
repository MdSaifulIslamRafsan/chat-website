import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";

const createUser = catchAsync(async (req, res) => {

  const result = await userService.createUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User created successfully",
    data: result,
  });
});

// const getUser = catchAsync(async (req, res) => {
//   const result = await userService.getUserFromDB();

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Get User successfully",
//     data: result,
//   });
// });

export const userController = {
  createUser,
  // getUser,
};
