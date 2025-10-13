import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { User } from "../db/models/User.js";
import { Session } from "../db/models/Session.js";

const ACCESS_TOKEN_TTL = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: REFRESH_TOKEN_TTL,
};

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw createHttpError(409, "Email in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const safeUser = user.toObject();
  delete safeUser.password;

  return safeUser;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw createHttpError(401, "Invalid email or password");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createHttpError(401, "Invalid email or password");

  await Session.deleteMany({ userId: user._id });

  const accessToken = randomBytes(30).toString("hex");
  const refreshToken = randomBytes(40).toString("hex");
  const now = Date.now();

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(now + REFRESH_TOKEN_TTL),
  });

  return { accessToken, refreshToken, cookieOptions };
}

export async function refreshSession(refreshTokenFromCookie) {
  if (!refreshTokenFromCookie) throw createHttpError(401, "No refresh token");

  const old = await Session.findOne({ refreshToken: refreshTokenFromCookie });
  if (!old) throw createHttpError(401, "Invalid refresh token");

  if (Date.now() > new Date(old.refreshTokenValidUntil).getTime()) {
    await Session.deleteOne({ _id: old._id });
    throw createHttpError(401, "Refresh token expired");
  }

  await Session.deleteMany({ userId: old.userId });

  const accessToken = randomBytes(30).toString("hex");
  const newRefreshToken = randomBytes(40).toString("hex");
  const now = Date.now();

  await Session.create({
    userId: old.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(now + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(now + REFRESH_TOKEN_TTL),
  });

  return { accessToken, newRefreshToken, cookieOptions };
}

export async function logoutUser(refreshTokenFromCookie) {
  if (!refreshTokenFromCookie) return;
  await Session.deleteOne({ refreshToken: refreshTokenFromCookie });
}
