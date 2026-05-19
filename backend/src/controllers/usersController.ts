import { Response, NextFunction } from "express";
import User from "../models/User";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../types";

export const getUsers = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select("-password").lean();
    sendSuccess(res, users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }
    if (user._id.toString() === req.user?.id) {
      sendError(res, "Cannot delete your own account", 400);
      return;
    }
    await user.deleteOne();
    sendSuccess(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
