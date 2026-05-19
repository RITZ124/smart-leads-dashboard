import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  sendError(res, message, statusCode);
};

export const notFound = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};
