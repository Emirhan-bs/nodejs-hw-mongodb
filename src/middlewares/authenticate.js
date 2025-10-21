import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { Session } from "../db/models/Session.js";
import { User } from "../db/models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createHttpError(401, "Authorization header missing");
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      throw createHttpError(401, "Invalid authorization format");
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createHttpError(401, "Invalid or expired session");
    }

    if (new Date() > session.accessTokenValidUntil) {
      throw createHttpError(401, "Access token expired");
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
